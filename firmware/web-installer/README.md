# Sunchronizer Web Installer

This directory contains the browser-based firmware installer page:

- `index.html`

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
