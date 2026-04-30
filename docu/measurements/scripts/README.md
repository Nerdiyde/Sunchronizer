# Measurement Scripts

Diese Skripte helfen bei der Tagesanalyse der Sunchronizer-Messdaten.

## Enthaltene Skripte

- `create_analysis_final.py`: Erstellt eine umfassende Auswertung aus einer CSV-Datei (Diagramme + Markdown-Report).
- `create_day_gif.py`: Konvertiert ein Tagesvideo (`.mp4`) in WebM und/oder GIF (ca. 10 Sekunden). Empfohlen: WebM als Hauptdatei, GIF als Preview.

---

## 1) create_analysis_final.py

### Zweck

Erzeugt eine vollständige Tagesauswertung mit:
- Leistungsdiagramm
- Kumulierter Ertrag
- Vergleichsdiagramme
- Temperaturverlauf (falls vorhanden)
- Markdown-Bericht

### Wichtiger Hinweis

Das Skript ist aktuell auf feste Eingabe-/Ausgabepfade und den Tag `2026-03-02` ausgelegt.
Vor der Nutzung fuer einen anderen Tag bitte im Skript anpassen:

- CSV-Eingabedatei (`pd.read_csv(...)`)
- PNG-Ausgabepfade (`plt.savefig(...)`)
- Report-Dateiname (`ANALYSIS_REPORT_YYYY-MM-DD.md`)
- Datums-/Titeltexte im Report und in Diagrammen

### Ausfuehrung

Vom Repository-Root aus:

```powershell
python docu/measurements/scripts/create_analysis_final.py
```

### Python-Abhaengigkeiten

- pandas
- numpy
- matplotlib

Installationsbeispiel:

```powershell
pip install pandas numpy matplotlib
```

---

## 2) create_day_gif.py

### Zweck

Konvertiert ein Tagesvideo (`.mp4`) in WebM und/oder GIF fuer die Analyseordner.

Ziele:
- Medien-Laenge: ca. 10 Sekunden
- WebM als effizientes Hauptformat
- Optional GIF-Preview <= 10 MB (automatische Qualitaets-Reduktion in mehreren Stufen)
- Beschleunigter Kombi-Modus: bei `--output-mode both` wird das GIF aus dem bereits erzeugten 10s-WebM erstellt

Beim Start zeigt das Skript eine grobe Laufzeitschaetzung an und fragt zur Sicherheit nach einer Bestaetigung, bevor die Konvertierung wirklich beginnt.

### Voraussetzungen

- `ffmpeg` und `ffprobe` muessen im PATH verfuegbar sein.

Kurzer Test:

```powershell
ffmpeg -version
ffprobe -version
```

### Standardaufruf (empfohlen: WebM + GIF)

```powershell
python docu/measurements/scripts/create_day_gif.py \
  docu/measurements/2026-03-18_bochum_tracking_analysis/day_video.mp4 \
  --day-dir docu/measurements/2026-03-18_bochum_tracking_analysis
```

### Wichtige Optionen

- `--day-dir`: Zielordner (z. B. der passende Tagesanalyse-Ordner)
- `--output-mode`: `gif`, `webm` oder `both` (Standard: `both`)
- `--gif-output-name`: Dateiname des GIFs (Standard: `<input_stem>_10s.gif`)
- `--webm-output-name`: Dateiname des WebM (Standard: `<input_stem>_10s.webm`)
- `--target-seconds`: Ziel-Laenge in Sekunden (Standard: `10`)
- `--max-size-mb`: Maximale Dateigroesse in MB (Standard: `10`)
- `--start-time`: Optionaler Start-Timecode zum Zuschneiden vor der Konvertierung
- `--end-time`: Optionaler End-Timecode zum Zuschneiden vor der Konvertierung
- `--yes`: Ueberspringt die interaktive Rueckfrage und startet sofort
- `--webm-fps`: WebM Framerate (Standard: `20`)
- `--webm-width`: WebM Breite (Standard: `960`)
- `--webm-crf`: VP9 Qualitaet 0..63 (Standard: `32`, niedriger = besser)
- `--speed-profile`: `quick`, `balanced`, `quality` (Standard: `quick`)

Format fuer `--start-time` und `--end-time`:
- Sekunden als Zahl, z. B. `12.5`
- oder `HH:MM:SS(.ms)`, z. B. `00:00:12.500`

Beispiel nur WebM:

```powershell
python docu/measurements/scripts/create_day_gif.py \
  docu/measurements/2026-03-18_bochum_tracking_analysis/day_video.mp4 \
  --day-dir docu/measurements/2026-03-18_bochum_tracking_analysis \
  --output-mode webm \
  --webm-output-name day_overview_10s.webm
```

Beispiel nur GIF:

```powershell
python docu/measurements/scripts/create_day_gif.py \
  docu/measurements/2026-03-18_bochum_tracking_analysis/day_video.mp4 \
  --day-dir docu/measurements/2026-03-18_bochum_tracking_analysis \
  --output-mode gif \
  --gif-output-name day_overview_10s.gif
```

Beispiel mit zugeschnittenem Bereich (Anfang/Ende entfernen):

```powershell
python docu/measurements/scripts/create_day_gif.py \
  docu/measurements/2026-03-18_bochum_tracking_analysis/day_video.mp4 \
  --day-dir docu/measurements/2026-03-18_bochum_tracking_analysis \
  --start-time 00:00:20 \
  --end-time 00:09:40
```

Schneller Lauf fuer lange Tagesvideos (empfohlen):

```powershell
python docu/measurements/scripts/create_day_gif.py \
  docu/measurements/2026-03-18_bochum_tracking_analysis/day_video.mp4 \
  --day-dir docu/measurements/2026-03-18_bochum_tracking_analysis \
  --output-mode both \
  --speed-profile quick \
  --yes
```

### Ergebnis

WebM und/oder GIF werden im angegebenen `--day-dir` gespeichert und koennen direkt in den Tagesreport eingebunden werden.
