# GitHub Repository Configuration

This directory contains GitHub-specific configurations, workflows, and automation scripts.

## 📁 Struktur

```
.github/
├── README.md                      # This file
├── GITHUB_ACTIONS_GUIDE.md        # Complete CI/CD setup documentation
├── workflows/                     # GitHub Actions workflows
│   └── build-firmware.yml         # Automatic firmware compilation
└── FUNDING.yml                    # Sponsorship information
```

## 🚀 GitHub Actions Workflows

### build-firmware.yml

**Zweck**: Automatische Kompilierung der ESPHome-Firmware bei Commits zum Master-Branch

**Auslöser**:
- ✅ Push zum `master` oder `main` Branch
- ✅ Pull Requests zu `master` oder `main`
- ✅ Manueller Trigger über GitHub UI
- ⏭️ Nur bei Änderungen in `firmware/config/**`

**Funktionen**:
- 🔨 Kompiliert alle Firmware-Konfigurationen
- 📦 Speichert Binaries als GitHub Actions Artifacts
- 🏷️ Erstellt automatische GitHub Releases
- ⬇️ Ermöglicht einfachen Download kompilierter Binaries

**Dokumentation**: [GITHUB_ACTIONS_GUIDE.md](GITHUB_ACTIONS_GUIDE.md)

## 📥 Binaries herunterladen

### Aus GitHub Actions

1. Gehe zu **Actions** Tab → letzte erfolgreiche Build
2. Scrolle zu **Artifacts**
3. Download die Firmware-Datei

### Aus Releases

1. Gehe zu **Releases**
2. Download die gewünschte `.bin`-Datei direkt

### Command Line

```bash
# Letzte Release Binary herunterladen
curl -L https://github.com/YOUR_USERNAME/Sunchronizer/releases/latest/download/sunchronizer_firmware_pcb_v1.3.bin -o firmware.bin
```

## 🔧 Workflows anpassen

Alle Workflows befinden sich in `workflows/`:

- **build-firmware.yml** - ESPHome Firmware-Build
  - PCB-Versionen hinzufügen/entfernen
  - Trigger-Bedingungen anpassen
  - Artifacts-Konfiguration ändern

## 📊 Workflow-Status

Aktuelle Status aller Workflows: **[Actions](../../actions)**

| Workflow | Status | Letzter Run |
|----------|--------|------------|
| Build Firmware | [Status Badge](../../workflows/Build%20ESPHome%20Firmware/badge.svg) | [Logs](../../actions) |

## 🆘 Troubleshooting

### Workflow schlägt fehl

1. Gehe zu **Actions** Tab
2. Klicke auf den fehlgeschlagenen Run
3. Überprüfe **Logs** für Fehler
4. Teste lokal: `esphome compile firmware/config/pcb_v1.3/sunchronizer_firmware_pcb_v1.3.yaml`

### Binary wird nicht erstellt

- Überprüfe Workflow-Logs
- Stelle sicher, dass `.yaml` Syntax korrekt ist
- Verifiziere, dass Datei in korrektem Pfad liegt

### GitHub Actions Minuten

Free-Plan: 2000 Minuten/Monat pro Benutzer
- ESPHome-Build: ~5-10 Minuten pro Konfiguration
- Mit Pfad-Filtern sparen: Workflow läuft nur bei relevanten Änderungen

## 📚 Zusätzliche Ressourcen

- **[Kompletter Setup Guide](GITHUB_ACTIONS_GUIDE.md)** - Detaillierte Konfiguration
- **[Firmware README](../firmware/README.md)** - Firmware-Informationen
- **[GitHub Actions Docs](https://docs.github.com/en/actions)** - Offizielle Dokumentation

---

**Last Updated**: January 2026  
**Status**: ✅ Automated builds configured
