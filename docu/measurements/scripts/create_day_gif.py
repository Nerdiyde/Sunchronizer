#!/usr/bin/env python3
"""Create compact day-analysis media from a Sunchronizer tracking MP4.

Targets:
- Duration: approximately 10 seconds
- WebM as efficient main format
- Optional GIF preview with <= 10 MB target (iterative quality fallback)

Requires ffmpeg + ffprobe in PATH.
"""

from __future__ import annotations

import argparse
import json
import shutil
import subprocess
import sys
import tempfile
import re
from pathlib import Path


FFMPEG_CMD = "ffmpeg"
FFPROBE_CMD = "ffprobe"


def run_cmd(cmd: list[str], capture_output: bool = True) -> subprocess.CompletedProcess[str]:
    if capture_output:
        return subprocess.run(cmd, check=True, capture_output=True, text=True)

    subprocess.run(cmd, check=True)
    return subprocess.CompletedProcess(cmd, 0, "", "")


def ffmpeg_input_args(
    clip_start: float,
    clip_duration: float,
    speed_profile: str,
) -> list[str]:
    """Fast and robust input options for long/corrupt recordings."""
    args = [
        "-ss",
        f"{clip_start:.6f}",
        "-t",
        f"{clip_duration:.6f}",
        "-fflags",
        "+discardcorrupt",
        "-err_detect",
        "ignore_err",
        "-analyzeduration",
        "20M",
        "-probesize",
        "20M",
    ]

    # Turbo mode: decode keyframes only for long/corrupt recordings.
    if speed_profile == "quick":
        args.extend(["-skip_frame", "nokey"])

    return args


def resolve_ffmpeg_tools() -> tuple[str, str]:
    """Resolve ffmpeg/ffprobe commands, with imageio-ffmpeg fallback for ffmpeg."""
    ffmpeg_cmd = shutil.which("ffmpeg") or ""
    ffprobe_cmd = shutil.which("ffprobe") or ""

    if ffmpeg_cmd and ffprobe_cmd:
        return ffmpeg_cmd, ffprobe_cmd

    # Fallback: use imageio-ffmpeg binary if system ffmpeg is unavailable.
    if not ffmpeg_cmd:
        try:
            import imageio_ffmpeg  # type: ignore

            ffmpeg_candidate = imageio_ffmpeg.get_ffmpeg_exe()
            if ffmpeg_candidate and Path(ffmpeg_candidate).exists():
                ffmpeg_cmd = ffmpeg_candidate
        except Exception:
            pass

    if not ffmpeg_cmd:
        raise RuntimeError(
            "Required tool 'ffmpeg' not found in PATH and no imageio-ffmpeg fallback available."
        )

    # ffprobe is optional; if missing we will probe duration via ffmpeg stderr parsing.
    return ffmpeg_cmd, (ffprobe_cmd or "")


def probe_duration_seconds(video_path: Path) -> float:
    # Preferred: ffprobe JSON output
    if FFPROBE_CMD:
        cmd = [
            FFPROBE_CMD,
            "-v",
            "error",
            "-show_entries",
            "format=duration",
            "-of",
            "json",
            str(video_path),
        ]
        result = run_cmd(cmd)
        payload = json.loads(result.stdout)
        duration_str = payload.get("format", {}).get("duration")
        if duration_str is not None:
            duration = float(duration_str)
            if duration > 0:
                return duration

    # Fallback: parse ffmpeg stderr line "Duration: HH:MM:SS.xx"
    probe_cmd = [FFMPEG_CMD, "-i", str(video_path)]
    result = subprocess.run(probe_cmd, check=False, capture_output=True, text=True)
    stderr = result.stderr or ""
    match = re.search(r"Duration:\s*(\d+):(\d+):(\d+(?:\.\d+)?)", stderr)
    if not match:
        raise RuntimeError("Could not read video duration via ffprobe/ffmpeg.")

    hours = int(match.group(1))
    minutes = int(match.group(2))
    seconds = float(match.group(3))
    duration = hours * 3600 + minutes * 60 + seconds
    if duration <= 0:
        raise RuntimeError("Video duration must be > 0 seconds.")
    return duration


def parse_timecode_to_seconds(raw: str) -> float:
    """Parse seconds or HH:MM:SS(.ms) into seconds."""
    value = raw.strip()
    if not value:
        raise ValueError("Timecode must not be empty.")

    # Allow plain seconds, e.g. 12 or 12.5
    try:
        seconds = float(value)
        if seconds < 0:
            raise ValueError("Timecode must be >= 0.")
        return seconds
    except ValueError:
        pass

    # Allow HH:MM:SS(.ms)
    if not re.fullmatch(r"\d{1,2}:\d{1,2}:\d{1,2}(?:\.\d+)?", value):
        raise ValueError(
            "Invalid timecode format. Use seconds (e.g. 12.5) or HH:MM:SS(.ms)."
        )

    parts = value.split(":")
    hours = int(parts[0])
    minutes = int(parts[1])
    secs = float(parts[2])

    if minutes >= 60 or secs >= 60:
        raise ValueError("Invalid HH:MM:SS timecode: minutes/seconds must be < 60.")

    return hours * 3600 + minutes * 60 + secs


def make_gif(
    input_video: Path,
    output_gif: Path,
    clip_start: float,
    clip_end: float,
    speed_factor: float,
    fps: int,
    width: int,
    colors: int,
    dither: str,
    speed_profile: str,
) -> None:
    clip_duration = clip_end - clip_start
    common_filter = (
        f"setpts=PTS/{speed_factor:.6f},"
        f"fps={fps},"
        f"scale={width}:-1:flags=lanczos"
    )

    with tempfile.TemporaryDirectory(prefix="gif_palette_") as tmp_dir:
        palette_path = Path(tmp_dir) / "palette.png"

        palette_cmd = [
            FFMPEG_CMD,
            "-v",
            "error",
            "-y",
            *ffmpeg_input_args(clip_start, clip_duration, speed_profile),
            "-i",
            str(input_video),
            "-vf",
            f"{common_filter},palettegen=max_colors={colors}",
            str(palette_path),
        ]
        run_cmd(palette_cmd, capture_output=False)

        gif_cmd = [
            FFMPEG_CMD,
            "-v",
            "error",
            "-y",
            *ffmpeg_input_args(clip_start, clip_duration, speed_profile),
            "-i",
            str(input_video),
            "-i",
            str(palette_path),
            "-lavfi",
            f"{common_filter}[x];[x][1:v]paletteuse=dither={dither}",
            "-loop",
            "0",
            str(output_gif),
        ]
        run_cmd(gif_cmd, capture_output=False)


def make_webm(
    input_video: Path,
    output_webm: Path,
    clip_start: float,
    clip_end: float,
    speed_factor: float,
    fps: int,
    width: int,
    crf: int,
    speed_profile: str,
) -> None:
    clip_duration = clip_end - clip_start
    common_filter = (
        f"setpts=PTS/{speed_factor:.6f},"
        f"fps={fps},"
        f"scale={width}:-1:flags=lanczos"
    )

    webm_cmd = [
        FFMPEG_CMD,
        "-v",
        "error",
        "-y",
        *ffmpeg_input_args(clip_start, clip_duration, speed_profile),
        "-i",
        str(input_video),
        "-vf",
        common_filter,
        "-an",
        "-c:v",
        "libvpx-vp9",
        "-b:v",
        "0",
        "-crf",
        str(crf),
        "-row-mt",
        "1",
        "-deadline",
        "good",
        str(output_webm),
    ]
    run_cmd(webm_cmd, capture_output=False)


def format_mb(num_bytes: int) -> str:
    return f"{num_bytes / (1024 * 1024):.2f} MB"


def format_duration(seconds: float) -> str:
    total = int(round(seconds))
    hours, rem = divmod(total, 3600)
    minutes, secs = divmod(rem, 60)
    if hours > 0:
        return f"{hours}h {minutes}m {secs}s"
    if minutes > 0:
        return f"{minutes}m {secs}s"
    return f"{secs}s"


def estimate_runtime_seconds(clip_duration_s: float, variants: list[dict[str, object]]) -> tuple[float, float]:
    """Return a rough min/max estimate for conversion runtime in seconds.

    Heuristic based on processed clip duration and the quality variant stack.
    """
    complexity_sum = 0.0
    for variant in variants:
        fps = float(variant["fps"])
        width = float(variant["width"])
        complexity_sum += (fps / 10.0) * (width / 800.0)

    # Lower/upper bounds to communicate uncertainty across different machines.
    min_seconds = clip_duration_s * complexity_sum * 0.03
    max_seconds = clip_duration_s * complexity_sum * 0.12
    return min_seconds, max_seconds


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description=(
            "Convert an MP4 tracking video to WebM and/or GIF with target duration."
        )
    )
    parser.add_argument("input_mp4", type=Path, help="Path to source MP4 video")
    parser.add_argument(
        "--day-dir",
        type=Path,
        default=None,
        help="Target daily analysis folder where the GIF should be saved",
    )
    parser.add_argument(
        "--output-mode",
        choices=["gif", "webm", "both"],
        default="both",
        help="Output format mode (default: both).",
    )
    parser.add_argument(
        "--output-name",
        default=None,
        help=(
            "Deprecated alias for --gif-output-name; kept for backward compatibility."
        ),
    )
    parser.add_argument(
        "--gif-output-name",
        default=None,
        help="Optional GIF file name (default: <input_stem>_10s.gif)",
    )
    parser.add_argument(
        "--webm-output-name",
        default=None,
        help="Optional WebM file name (default: <input_stem>_10s.webm)",
    )
    parser.add_argument(
        "--target-seconds",
        type=float,
        default=10.0,
        help="Target GIF length in seconds (default: 10)",
    )
    parser.add_argument(
        "--max-size-mb",
        type=float,
        default=10.0,
        help="Maximum GIF size in MB (default: 10)",
    )
    parser.add_argument(
        "--start-time",
        default=None,
        help=(
            "Optional trim start time. Format: seconds (e.g. 12.5) "
            "or HH:MM:SS(.ms)."
        ),
    )
    parser.add_argument(
        "--end-time",
        default=None,
        help=(
            "Optional trim end time. Format: seconds (e.g. 95.0) "
            "or HH:MM:SS(.ms)."
        ),
    )
    parser.add_argument(
        "--yes",
        action="store_true",
        help="Skip interactive confirmation and start conversion immediately.",
    )
    parser.add_argument(
        "--webm-fps",
        type=int,
        default=20,
        help="WebM frame rate (default: 20)",
    )
    parser.add_argument(
        "--webm-width",
        type=int,
        default=960,
        help="WebM width in pixels, aspect ratio preserved (default: 960)",
    )
    parser.add_argument(
        "--webm-crf",
        type=int,
        default=32,
        help="WebM VP9 quality factor 0-63, lower is better (default: 32)",
    )
    parser.add_argument(
        "--speed-profile",
        choices=["quick", "balanced", "quality"],
        default="quick",
        help="Conversion speed/quality profile for GIF generation (default: quick).",
    )
    return parser.parse_args()


def get_gif_variants(speed_profile: str) -> list[dict[str, object]]:
    if speed_profile == "quick":
        return [
            {"fps": 8, "width": 560, "colors": 96, "dither": "bayer"},
            {"fps": 7, "width": 520, "colors": 80, "dither": "bayer"},
        ]
    if speed_profile == "balanced":
        return [
            {"fps": 10, "width": 760, "colors": 192, "dither": "sierra2_4a"},
            {"fps": 8, "width": 640, "colors": 128, "dither": "floyd_steinberg"},
            {"fps": 7, "width": 560, "colors": 96, "dither": "bayer"},
        ]

    # quality
    return [
        {"fps": 14, "width": 960, "colors": 256, "dither": "sierra2_4a"},
        {"fps": 12, "width": 900, "colors": 256, "dither": "sierra2_4a"},
        {"fps": 12, "width": 800, "colors": 224, "dither": "sierra2_4a"},
        {"fps": 10, "width": 760, "colors": 192, "dither": "sierra2_4a"},
        {"fps": 10, "width": 700, "colors": 160, "dither": "floyd_steinberg"},
        {"fps": 8, "width": 640, "colors": 128, "dither": "floyd_steinberg"},
        {"fps": 7, "width": 560, "colors": 96, "dither": "bayer"},
    ]


def main() -> int:
    args = parse_args()

    global FFMPEG_CMD
    global FFPROBE_CMD

    try:
        FFMPEG_CMD, FFPROBE_CMD = resolve_ffmpeg_tools()
    except RuntimeError as exc:
        print(f"ERROR: {exc}")
        return 1

    input_mp4 = args.input_mp4.resolve()
    if not input_mp4.exists():
        print(f"ERROR: Input file not found: {input_mp4}")
        return 1

    if args.target_seconds <= 0:
        print("ERROR: --target-seconds must be > 0")
        return 1

    if args.max_size_mb <= 0:
        print("ERROR: --max-size-mb must be > 0")
        return 1

    output_dir = (args.day_dir.resolve() if args.day_dir else input_mp4.parent)
    output_dir.mkdir(parents=True, exist_ok=True)

    if args.webm_fps <= 0:
        print("ERROR: --webm-fps must be > 0")
        return 1

    if args.webm_width <= 0:
        print("ERROR: --webm-width must be > 0")
        return 1

    if args.webm_crf < 0 or args.webm_crf > 63:
        print("ERROR: --webm-crf must be in range 0..63")
        return 1

    gif_output_name = args.gif_output_name or args.output_name or f"{input_mp4.stem}_10s.gif"
    webm_output_name = args.webm_output_name or f"{input_mp4.stem}_10s.webm"
    output_gif = output_dir / gif_output_name
    output_webm = output_dir / webm_output_name

    try:
        duration_s = probe_duration_seconds(input_mp4)
    except Exception as exc:
        print(f"ERROR: Failed to probe video duration: {exc}")
        return 1

    try:
        clip_start = (
            parse_timecode_to_seconds(args.start_time) if args.start_time is not None else 0.0
        )
        clip_end = (
            parse_timecode_to_seconds(args.end_time) if args.end_time is not None else duration_s
        )
    except ValueError as exc:
        print(f"ERROR: {exc}")
        return 1

    if clip_start > duration_s:
        print(
            f"ERROR: --start-time ({clip_start:.3f}s) is beyond video duration ({duration_s:.3f}s)."
        )
        return 1

    if clip_end > duration_s:
        print(
            f"INFO: --end-time ({clip_end:.3f}s) is beyond video duration; clipping to {duration_s:.3f}s."
        )
        clip_end = duration_s

    if clip_end <= clip_start:
        print("ERROR: --end-time must be greater than --start-time.")
        return 1

    clip_duration_s = clip_end - clip_start

    speed_factor = clip_duration_s / args.target_seconds
    max_bytes = int(args.max_size_mb * 1024 * 1024)

    variants = get_gif_variants(args.speed_profile)

    print("Planned media conversion:")
    print(f"- Input:  {input_mp4}")
    if args.output_mode in {"webm", "both"}:
        print(f"- WebM output: {output_webm}")
    if args.output_mode in {"gif", "both"}:
        print(f"- GIF output:  {output_gif}")
    print(f"- Input duration: {duration_s:.2f}s")
    print(f"- Trimmed segment: {clip_start:.2f}s -> {clip_end:.2f}s ({clip_duration_s:.2f}s)")
    print(f"- Target duration: {args.target_seconds:.2f}s")
    print(f"- Playback speed factor: {speed_factor:.3f}x")
    if args.output_mode in {"gif", "both"}:
        print(f"- GIF max size: {args.max_size_mb:.2f} MB")
        print(f"- GIF speed profile: {args.speed_profile}")
    if args.output_mode in {"webm", "both"}:
        print(
            f"- WebM settings: fps={args.webm_fps}, width={args.webm_width}, crf={args.webm_crf}"
        )

    gif_est_min_s, gif_est_max_s = estimate_runtime_seconds(clip_duration_s, variants)
    webm_est_min_s = clip_duration_s * 0.02
    webm_est_max_s = clip_duration_s * 0.07
    total_est_min_s = 0.0
    total_est_max_s = 0.0
    if args.output_mode in {"webm", "both"}:
        total_est_min_s += webm_est_min_s
        total_est_max_s += webm_est_max_s
    gif_source_video = input_mp4
    gif_clip_start = clip_start
    gif_clip_end = clip_end
    gif_speed_factor = speed_factor

    if args.output_mode in {"gif", "both"}:
        total_est_min_s += gif_est_min_s
        total_est_max_s += gif_est_max_s
    print(
        "- Estimated conversion time: "
        f"~{format_duration(total_est_min_s)} to {format_duration(total_est_max_s)} "
        "(rough estimate, machine dependent)"
    )

    if not args.yes:
        answer = input("Start conversion now? [y/N]: ").strip().lower()
        if answer not in {"y", "yes", "j", "ja"}:
            print("Cancelled by user.")
            return 0

    if args.output_mode in {"webm", "both"}:
        print("Converting video to WebM...")
        try:
            make_webm(
                input_video=input_mp4,
                output_webm=output_webm,
                clip_start=clip_start,
                clip_end=clip_end,
                speed_factor=speed_factor,
                fps=args.webm_fps,
                width=args.webm_width,
                crf=args.webm_crf,
                speed_profile=args.speed_profile,
            )
        except subprocess.CalledProcessError as exc:
            print("ERROR: ffmpeg command failed during WebM conversion.")
            if exc.stderr:
                print(exc.stderr)
            return 1
        webm_size = output_webm.stat().st_size
        print(f"SUCCESS: WebM created ({format_mb(webm_size)}).")
        print(f"Saved: {output_webm}")

        # In combined mode, create GIF from the short WebM instead of reprocessing
        # the full original clip to speed up conversion significantly.
        if args.output_mode == "both":
            gif_source_video = output_webm
            try:
                webm_duration = probe_duration_seconds(output_webm)
            except Exception:
                webm_duration = args.target_seconds
            gif_clip_start = 0.0
            gif_clip_end = webm_duration
            if webm_duration <= 0:
                webm_duration = args.target_seconds
            gif_speed_factor = webm_duration / args.target_seconds

    if args.output_mode in {"gif", "both"}:
        print("Converting video to GIF preview...")
        if args.output_mode == "both":
            print("- GIF source: generated WebM clip (fast path)")
        last_size = None
        for idx, variant in enumerate(variants, start=1):
            print(
                "- Try "
                f"{idx}/{len(variants)}: fps={variant['fps']}, width={variant['width']}, "
                f"colors={variant['colors']}, dither={variant['dither']}"
            )
            try:
                make_gif(
                    input_video=gif_source_video,
                    output_gif=output_gif,
                    clip_start=gif_clip_start,
                    clip_end=gif_clip_end,
                    speed_factor=gif_speed_factor,
                    fps=variant["fps"],
                    width=variant["width"],
                    colors=variant["colors"],
                    dither=variant["dither"],
                    speed_profile=args.speed_profile,
                )
            except subprocess.CalledProcessError as exc:
                print("ERROR: ffmpeg command failed during GIF conversion.")
                if exc.stderr:
                    print(exc.stderr)
                return 1

            size_bytes = output_gif.stat().st_size
            last_size = size_bytes
            print(f"  -> Result size: {format_mb(size_bytes)}")

            if size_bytes <= max_bytes:
                print("SUCCESS: GIF meets size limit.")
                print(f"Saved: {output_gif}")
                break
        else:
            print("WARNING: Could not meet max size with fallback settings.")
            if last_size is not None:
                print(f"Final GIF size: {format_mb(last_size)} (limit: {args.max_size_mb:.2f} MB)")
            print(f"Saved best-effort GIF: {output_gif}")

    print("Done.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
