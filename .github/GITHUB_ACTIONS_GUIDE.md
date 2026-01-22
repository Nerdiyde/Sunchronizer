# GitHub Actions - Automated Firmware Build

This guide explains how the automatic build workflow functions.

## 🚀 Setup

The workflow is already configured in: `.github/workflows/build-firmware.yml`

### Prerequisites

✅ Repository hosted on GitHub  
✅ Secrets are configured (if needed)  
✅ GitHub Actions is enabled for your repository (default)

## 📋 Workflow Configuration

### Trigger Events

The workflow is automatically triggered when:

1. **Push to master/main Branch**
   - With changes in `firmware/config/**/*.yaml`
   - With changes in `.github/workflows/build-firmware.yml`

2. **Pull Requests**
   - Same path filters as push

3. **Manual Trigger**
   - Via GitHub UI: Actions → Build ESPHome Firmware → Run workflow

### Excluded Triggers

The workflow will **NOT** be triggered by:
- Commits to other branches (except master/main)
- Commits without changes in `firmware/config/`
- Changes to documentation/README

> This saves GitHub Actions minutes!

## 📦 What the Workflow Does

### 1. Check out code
```bash
git clone [repository]
```

### 2. Install Python & ESPHome
```bash
pip install esphome
```

### 3. Compile firmware
```bash
esphome compile firmware/config/pcb_v1.3/sunchronizer_firmware_pcb_v1.3.yaml
```

### 4. Save binary
Compiled `.bin` file is stored in Artifacts

### 5. Create GitHub Release (master only)
- Automatic release creation
- Binary uploaded to release
- Versioning by build number

## 📥 Download Binaries

### Option 1: From GitHub Actions Artifacts

1. Go to your repository
2. Click **"Actions"** tab
3. Select the latest successful build
4. Scroll to **"Artifacts"**
5. Download `firmware-v1.3.zip`

### Option 2: From GitHub Releases

1. Go to **"Releases"** in your repository
2. Select the latest release
3. Download the `.bin` file directly

### Option 3: Command Line

```bash
# Download only the latest release binary
gh release download --repo YourUsername/Sunchronizer --pattern "*.bin"

# Or with curl
curl -L https://github.com/YourUsername/Sunchronizer/releases/latest/download/sunchronizer_firmware_pcb_v1.3.bin -o firmware.bin
```

## 🔧 Customize Configuration

### Add Additional PCB Versions

Edit `.github/workflows/build-firmware.yml`:

```yaml
strategy:
  matrix:
    include:
      - config_file: firmware/config/pcb_v1.3/sunchronizer_firmware_pcb_v1.3.yaml
        binary_name: sunchronizer_firmware_pcb_v1.3
        version: v1.3
      
      # NEW: Add v1.4
      - config_file: firmware/config/pcb_v1.4/sunchronizer_firmware_pcb_v1.4.yaml
        binary_name: sunchronizer_firmware_pcb_v1.4
        version: v1.4
```

### Trigger Build Only on Specific Paths

```yaml
on:
  push:
    branches:
      - master
    paths:
      - 'firmware/config/**'  # Only firmware changes
      - '.github/workflows/build-firmware.yml'  # Or workflow changes
```

### Customize Artifact Retention

```yaml
retention-days: 30  # Change to 7, 14, 60, etc.
```

### Disable Manual Trigger

Remove this line if manual triggering is not desired:

```yaml
workflow_dispatch:  # Remove for no manual trigger
```

## 📊 Check Workflow Status

### GitHub UI

1. Go to **Actions** tab
2. See all builds with status:
   - ✅ **Success** - Binary built successfully
   - ❌ **Failed** - Compilation error
   - ⏳ **In Progress** - Build running

### Command Line

```bash
# Show latest workflow runs
gh run list --workflow=build-firmware.yml

# Check status of specific run
gh run view [run-id]

# View logs
gh run view [run-id] --log
```

## 🆘 Troubleshooting

### Build Fails

1. **Check logs**:
   - Go to Actions → Failed Run → Logs
   - Look for red error messages

2. **Common errors**:
   - **"esphome: command not found"** → ESPHome installation failed
   - **"YAML parsing error"** → Syntax error in `.yaml`
   - **"ModuleNotFoundError"** → Missing dependencies

3. **Test locally**:
   ```bash
   # Start ESPHome locally before pushing to GitHub
   esphome compile firmware/config/pcb_v1.3/sunchronizer_firmware_pcb_v1.3.yaml
   ```

### Binary Not in Release

1. Check workflow logs for errors
2. Ensure file is named correctly
3. Verify build path in workflow file

### GitHub Actions Minutes Exceeded

- Free plan: 2000 minutes/month
- One ESPHome build: ~5-10 minutes
- Optimization: Set path filters (see above)

## 📚 Advanced Features

### Email Notifications on Failure

```yaml
- name: Send notification on failure
  if: failure()
  uses: dawidd6/action-send-mail@v3
  with:
    server_address: smtp.gmail.com
    server_port: 465
    username: ${{ secrets.EMAIL_USERNAME }}
    password: ${{ secrets.EMAIL_PASSWORD }}
    subject: ❌ Firmware Build Failed
    to: your-email@example.com
    from: github-actions@example.com
    body: |
      Build #${{ github.run_number }} failed!
      Check logs: ${{ github.server_url }}/${{ github.repository }}/actions/runs/${{ github.run_id }}
```

### Automatic Binary Updates in Releases

The current workflow automatically creates releases with binaries.

### Matrix for Multiple Configurations

```yaml
strategy:
  matrix:
    config:
      - {file: 'pcb_v1.3.yaml', name: 'v1.3'}
      - {file: 'pcb_v1.4.yaml', name: 'v1.4'}
      - {file: 'pcb_d2.yaml', name: 'd2'}
```

## 🔐 Secrets (if needed)

If your workflow needs external services:

1. Go to Repository Settings → Secrets and variables → Actions
2. Add secrets: e.g., `EMAIL_PASSWORD`
3. Use in workflow: `${{ secrets.EMAIL_PASSWORD }}`

**⚠️ Never store secrets in the repository!**

## 📖 References

- **[GitHub Actions Documentation](https://docs.github.com/en/actions)**
- **[ESPHome CLI Reference](https://esphome.io/guides/cli.html)**
- **[GitHub Releases API](https://docs.github.com/en/rest/releases)**

---

**Last Updated**: January 2026  
**Status**: ✅ Automatic firmware builds configured  
**Tested with**: ESPHome 2024.12.x, GitHub Actions
