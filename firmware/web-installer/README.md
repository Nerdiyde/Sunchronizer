# Sunchronizer Web Installer

This directory contains the browser-based firmware installer page:

- `index.html`
- `onboarding.html` (PWA onboarding prototype)

## Public URL (GitHub Pages)

After Pages is enabled, users can open:

- `https://nerdiyde.github.io/Sunchronizer/`

This URL serves `firmware/web-installer/index.html` as the root page because the deployment workflow publishes this folder directly.

## One-time GitHub Setup

1. Open repository **Settings** -> **Pages**
2. In **Build and deployment**, set **Source** to **GitHub Actions**
3. Save

## Automatic Deployment

Workflow file:

- `.github/workflows/deploy-web-installer.yml`

Deploy is triggered on:

- Pushes to `main`/`master` that change `firmware/web-installer/**`
- Manual `workflow_dispatch`

## Notes

- Browser flashing requires a secure context (`https://`), which GitHub Pages provides.
- Chromium-based browser is required for Web Serial support.
- The installer supports selecting a release and binary (not only `latest`).
- The deployment workflow mirrors `.bin` assets for multiple recent releases into the Pages artifact (`/binaries/<tag>/*`) so install fetches work without cross-origin issues.
- A serial log panel can be toggled with a button and connected/disconnected on demand via Web Serial.

## Onboarding PWA (Initial Implementation)

The onboarding PWA is available at `onboarding.html` and is deployed together with the installer.

Current scope:

- Improv BLE-first onboarding flow (when Web Bluetooth is available)
- AP fallback flow for browsers/platforms without Web Bluetooth support
- Local device URL save/open helper for post-onboarding access
- ESPHome Web API probe and generic REST action testing
- Live telemetry stream via ESPHome EventSource (`/events`)
- Sunchronizer-specific quick controls mapped to common entities (buttons/switches)
- Key-state snapshot panel for calibration, axis status, and sun/target angles
- Fixed mode buttons (Auto Tracking, Standby/Safe, Service Position, Calibration)
- Collapsible advanced input section for manual target/tolerance values
- Dedicated calibration hub section with one-click calibration triggers

PWA assets:

- `onboarding-app.js`
- `onboarding-sw.js`
- `onboarding.webmanifest`
- `onboarding-icon.svg`

Notes:

- Web Bluetooth requires HTTPS and user interaction to open the device picker.
- Browser support differs by platform (especially iOS and non-Chromium browsers).
- Runtime control is based on ESPHome Web API endpoints (`/domain/entity[/action]`).
- Event streaming uses Server-Sent Events at `/events`.
