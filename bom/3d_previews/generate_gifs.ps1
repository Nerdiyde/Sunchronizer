# Edit these settings as needed.
$InputDir = ""
$Delay = 40
$Step = 15
$OutputDir = "renders_gif_slow"
$Size = "480x360"
$FitMargin = 20
$ZoomFactor = 2.2
$ModelColor = @(0.7019607843, 0.7019607843, 0.7019607843)
$BackgroundColor = "#333942"
$OpenScadBackgroundColor = "#FFF5E5"
$BackgroundFuzz = "5%"
$OpenScadPath = ""
$MagickPath = ""

Set-StrictMode -Version Latest
$ErrorActionPreference = "Continue"

function Resolve-OpenScadPath {
    param([string]$PathHint)
    if ($PathHint -and (Test-Path $PathHint)) { return $PathHint }
    $candidates = @(
        "C:\\Program Files\\OpenSCAD\\openscad.exe",
        "C:\\Program Files (x86)\\OpenSCAD\\openscad.exe"
    )
    foreach ($candidate in $candidates) {
        if (Test-Path $candidate) { return $candidate }
    }
    $cmd = Get-Command openscad -ErrorAction SilentlyContinue
    if ($cmd) { return $cmd.Source }
    throw "OpenSCAD not found. Install it or set `$OpenScadPath in this script."
}

function Resolve-MagickPath {
    param([string]$PathHint)
    if ($PathHint -and (Test-Path $PathHint)) { return $PathHint }
    $cmd = Get-Command magick -ErrorAction SilentlyContinue
    if ($cmd) { return $cmd.Source }
    $candidate = Get-ChildItem "C:\\Program Files\\ImageMagick-*\\magick.exe" -ErrorAction SilentlyContinue |
        Select-Object -First 1 -ExpandProperty FullName
    if ($candidate) { return $candidate }
    throw "ImageMagick not found. Install it or set `$MagickPath in this script."
}
function Get-StlBounds {
    param([string]$Path)

    $bytes = [System.IO.File]::ReadAllBytes($Path)
    if ($bytes.Length -lt 84) {
        throw "STL file too small: $Path"
    }

    $triangleCount = [BitConverter]::ToUInt32($bytes, 80)
    $isBinary = (84 + ($triangleCount * 50)) -eq $bytes.Length

    $minX = [double]::PositiveInfinity
    $minY = [double]::PositiveInfinity
    $minZ = [double]::PositiveInfinity
    $maxX = [double]::NegativeInfinity
    $maxY = [double]::NegativeInfinity
    $maxZ = [double]::NegativeInfinity

    if ($isBinary) {
        $offset = 84
        for ($i = 0; $i -lt $triangleCount; $i++) {
            $offset += 12
            for ($v = 0; $v -lt 3; $v++) {
                $x = [BitConverter]::ToSingle($bytes, $offset)
                $y = [BitConverter]::ToSingle($bytes, $offset + 4)
                $z = [BitConverter]::ToSingle($bytes, $offset + 8)
                $offset += 12

                if ($x -lt $minX) { $minX = $x }
                if ($y -lt $minY) { $minY = $y }
                if ($z -lt $minZ) { $minZ = $z }
                if ($x -gt $maxX) { $maxX = $x }
                if ($y -gt $maxY) { $maxY = $y }
                if ($z -gt $maxZ) { $maxZ = $z }
            }
            $offset += 2
        }
    }
    else {
        $text = [System.Text.Encoding]::UTF8.GetString($bytes)
        foreach ($line in ($text -split "`r?`n")) {
            if ($line -match '^\s*vertex\s+([-0-9.eE+]+)\s+([-0-9.eE+]+)\s+([-0-9.eE+]+)') {
                $x = [double]$matches[1]
                $y = [double]$matches[2]
                $z = [double]$matches[3]

                if ($x -lt $minX) { $minX = $x }
                if ($y -lt $minY) { $minY = $y }
                if ($z -lt $minZ) { $minZ = $z }
                if ($x -gt $maxX) { $maxX = $x }
                if ($y -gt $maxY) { $maxY = $y }
                if ($z -gt $maxZ) { $maxZ = $z }
            }
        }
    }

    $sizeX = $maxX - $minX
    $sizeY = $maxY - $minY
    $sizeZ = $maxZ - $minZ
    $maxDim = [Math]::Max($sizeX, [Math]::Max($sizeY, $sizeZ))

    [PSCustomObject]@{
        CenterX = ($minX + $maxX) / 2.0
        CenterY = ($minY + $maxY) / 2.0
        CenterZ = ($minZ + $maxZ) / 2.0
        SizeX = $sizeX
        SizeY = $sizeY
        SizeZ = $sizeZ
        MaxDim = $maxDim
    }
}
$openScad = Resolve-OpenScadPath -PathHint $OpenScadPath
$magick = Resolve-MagickPath -PathHint $MagickPath

$sizeParts = $Size -split "x"
if ($sizeParts.Count -ne 2) { throw "Size must be like 800x600." }
$imgW = [int]$sizeParts[0]
$imgH = [int]$sizeParts[1]

$baseDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $baseDir


# Zielverzeichnis für STL-Suche bestimmen
if ($InputDir -and (Test-Path $InputDir)) {
    $searchDir = Resolve-Path $InputDir
} else {
    $searchDir = Split-Path -Parent $MyInvocation.MyCommand.Path
}
Set-Location $searchDir

$stlFiles = Get-ChildItem -Path $searchDir -Filter *.stl -File
if (-not $stlFiles) { throw "No STL files found in $searchDir." }

# Log und Output bleiben im Skriptverzeichnis
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$logPath = Join-Path $scriptDir "generate_gifs.log"
Set-Content -Path $logPath -Value "Total STL files: $($stlFiles.Count)" -Encoding ASCII -ErrorAction Stop

$targetDir = Join-Path $scriptDir $OutputDir
New-Item -ItemType Directory -Path $targetDir -Force | Out-Null

$tempRoot = Join-Path $env:TEMP ("openscad_gif_frames_" + [guid]::NewGuid().ToString("N"))
New-Item -ItemType Directory -Path $tempRoot -Force | Out-Null

try {
    foreach ($stl in $stlFiles) {
        $name = $stl.BaseName
        Write-Output "Processing: $name"
        Add-Content -Path $logPath -Value "START: $name" -Encoding ASCII -ErrorAction SilentlyContinue

        try {
            $frameDir = Join-Path $tempRoot $name
            New-Item -ItemType Directory -Path $frameDir -Force -ErrorAction Stop | Out-Null

            $bounds = Get-StlBounds -Path $stl.FullName
            $vptX = [Math]::Round($bounds.CenterX, 4)
            $vptY = [Math]::Round($bounds.CenterY, 4)
            $vptZ = [Math]::Round($bounds.CenterZ, 4)
            # Compute effective projected extents for the 60-degree camera tilt.
            # At vpr=[60,0,rot]: screen-vertical captures sin(60)*SizeZ + cos(60)*XY-diagonal,
            # screen-horizontal captures the XY-diagonal. Using only MaxDim misses tall narrow
            # objects where SizeZ dominates but the projected height exceeds MaxDim visually.
            $tiltRad  = [Math]::PI * 60.0 / 180.0
            $xyDiag   = [Math]::Sqrt($bounds.SizeX * $bounds.SizeX + $bounds.SizeY * $bounds.SizeY)
            $effVert  = [Math]::Sin($tiltRad) * $bounds.SizeZ + [Math]::Cos($tiltRad) * $xyDiag
            $effHoriz = $xyDiag
            $aspRatio = $imgW / [double]$imgH
            $effDim   = [Math]::Max($effVert, $effHoriz / $aspRatio)
            $vpd = [Math]::Round([Math]::Max(20.0, $effDim * $ZoomFactor), 4)
            Add-Content -Path $logPath -Value ("BOUNDS: {0} center=({1},{2},{3}) size=({4}x{5}x{6}) effDim={7} vpd={8}" -f $name, $vptX, $vptY, $vptZ, [Math]::Round($bounds.SizeX,2), [Math]::Round($bounds.SizeY,2), [Math]::Round($bounds.SizeZ,2), [Math]::Round($effDim,4), $vpd) -Encoding ASCII -ErrorAction SilentlyContinue

            $localStl = Join-Path $frameDir "model.stl"
            Copy-Item -Path $stl.FullName -Destination $localStl -Force -ErrorAction Stop
            $scadPath = Join-Path $frameDir "model.scad"
            @(
                "// Auto-generated",
                "color([$($ModelColor[0]), $($ModelColor[1]), $($ModelColor[2])]) import(`"model.stl`");"
            ) | Set-Content -Path $scadPath -Encoding ASCII -ErrorAction Stop

            $frameIndex = 0
            for ($rot = 0; $rot -lt 360; $rot += $Step) {
                $framePath = Join-Path $frameDir ("{0:000}.png" -f $frameIndex)
                $vprArg = "`$vpr=[60,0,$rot]"
                $vptArg = "`$vpt=[$vptX,$vptY,$vptZ]"
                $vpdArg = "`$vpd=$vpd"

                $openScadCmd = "`"$openScad`" -o `"$framePath`" --imgsize $imgW,$imgH -D $vprArg -D $vptArg -D $vpdArg `"$scadPath`" 1>nul 2>nul"
                cmd /c $openScadCmd
                if ($LASTEXITCODE -ne 0) {
                    throw "OpenSCAD failed (exit $LASTEXITCODE) for $name."
                }

                $frameIndex++
            }

            $frameCount = (Get-ChildItem -Path $frameDir -Filter *.png -File | Measure-Object).Count
            if ($frameCount -eq 0) { throw "No frames generated for $name." }

            & $magick mogrify -fuzz $BackgroundFuzz -transparent "$OpenScadBackgroundColor" `
                -background "$BackgroundColor" -flatten (Join-Path $frameDir "*.png")

            $gifPath = Join-Path $targetDir ("$name.gif")
            & $magick (Join-Path $frameDir "*.png") -coalesce -background $BackgroundColor -alpha remove -alpha off `
                -fuzz $BackgroundFuzz -layers TrimBounds +repage -bordercolor $BackgroundColor -border $FitMargin `
                -resize "$imgW`x$imgH" -gravity center -extent "$imgW`x$imgH" `
                -set delay $Delay -loop 0 $gifPath

            Add-Content -Path $logPath -Value "DONE: $name" -Encoding ASCII -ErrorAction SilentlyContinue
        }
        catch {
            $msg = "FAILED: $name :: $($_.Exception.Message)"
            Write-Output $msg
            Add-Content -Path $logPath -Value $msg -Encoding ASCII -ErrorAction SilentlyContinue
        }
    }
}
finally {
    if (Test-Path $tempRoot) { Remove-Item -Recurse -Force $tempRoot }
}

Write-Output "Done. GIFs are in: $targetDir"