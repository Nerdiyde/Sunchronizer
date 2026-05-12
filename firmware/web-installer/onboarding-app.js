(function () {
  const IMPROV_SERVICE_UUID = "00467768-6228-2272-4663-277478268000";
  const IMPROV_STATE_UUID = "00467768-6228-2272-4663-277478268006";
  const IMPROV_ERROR_UUID = "00467768-6228-2272-4663-277478268002";
  const IMPROV_RPC_COMMAND_UUID = "00467768-6228-2272-4663-277478268003";
  const IMPROV_RPC_RESULT_UUID = "00467768-6228-2272-4663-277478268004";

  const stateMap = {
    0x00: "Authorization required",
    0x01: "Authorized",
    0x02: "Provisioning",
    0x03: "Provisioned"
  };

  const errorMap = {
    0x00: "No error",
    0x01: "Invalid RPC packet",
    0x02: "Unknown RPC command",
    0x03: "Unable to connect",
    0x04: "Not authorized",
    0x05: "Unknown error"
  };

  const globalStatus = document.getElementById("globalStatus");
  const bleStatus = document.getElementById("bleStatus");
  const bleDetailStatus = document.getElementById("bleDetailStatus");
  const apStatus = document.getElementById("apStatus");
  const controlStatus = document.getElementById("controlStatus");
  const telemetryLog = document.getElementById("telemetryLog");
  const apiStatus = document.getElementById("apiStatus");
  const apiResponse = document.getElementById("apiResponse");
  const presetControls = document.getElementById("presetControls");
  const refreshPresetStatesButton = document.getElementById("refreshPresetStatesButton");
  const presetStateOutput = document.getElementById("presetStateOutput");
  const modeAutoTrackingButton = document.getElementById("modeAutoTracking");
  const modeStandbySafeButton = document.getElementById("modeStandbySafe");
  const modeServicePositionButton = document.getElementById("modeServicePosition");
  const modeCalibrationButton = document.getElementById("modeCalibration");
  const manualElevationInput = document.getElementById("manualElevationInput");
  const manualAzimuthInput = document.getElementById("manualAzimuthInput");
  const manualToleranceInput = document.getElementById("manualToleranceInput");
  const applyManualTargetsButton = document.getElementById("applyManualTargetsButton");
  const calibMagDeclinationButton = document.getElementById("calibMagDeclinationButton");
  const calibElevationButton = document.getElementById("calibElevationButton");
  const calibAzimuthButton = document.getElementById("calibAzimuthButton");
  const calibSaveDeclinationButton = document.getElementById("calibSaveDeclinationButton");
  const calibrationStatus = document.getElementById("calibrationStatus");

  const wifiSsidInput = document.getElementById("wifiSsid");
  const wifiPasswordInput = document.getElementById("wifiPassword");
  const connectBleButton = document.getElementById("connectBleButton");
  const sendWifiButton = document.getElementById("sendWifiButton");

  const portalUrlInput = document.getElementById("portalUrl");
  const openPortalButton = document.getElementById("openPortalButton");

  const deviceUrlInput = document.getElementById("deviceUrl");
  const saveDeviceUrlButton = document.getElementById("saveDeviceUrlButton");
  const probeDeviceButton = document.getElementById("probeDeviceButton");
  const refreshCommonStatesButton = document.getElementById("refreshCommonStatesButton");
  const connectEventsButton = document.getElementById("connectEventsButton");
  const disconnectEventsButton = document.getElementById("disconnectEventsButton");
  const openDeviceButton = document.getElementById("openDeviceButton");

  const apiDomainInput = document.getElementById("apiDomain");
  const apiEntityInput = document.getElementById("apiEntity");
  const apiActionInput = document.getElementById("apiAction");
  const apiQueryInput = document.getElementById("apiQuery");
  const apiGetButton = document.getElementById("apiGetButton");
  const apiPostButton = document.getElementById("apiPostButton");

  const installPwaButton = document.getElementById("installPwaButton");

  let bleContext = {
    device: null,
    server: null,
    service: null,
    stateChar: null,
    errorChar: null,
    rpcCommandChar: null,
    rpcResultChar: null
  };

  let blePhase = "idle";
  let eventsSource = null;

  const sunchronizerPresets = [
    { label: "Lift Up", domain: "button", entity: "Panel Lifter Up", action: "press" },
    { label: "Lift Down", domain: "button", entity: "Panel Lifter Down", action: "press" },
    { label: "Lift Stop", domain: "button", entity: "Panel Lifter Stop", action: "press" },
    { label: "Rotate CCW", domain: "button", entity: "Panel Rotation CCW", action: "press" },
    { label: "Rotate CW", domain: "button", entity: "Panel Rotation CW", action: "press" },
    { label: "Rotate Stop", domain: "button", entity: "Panel Rotation Stop", action: "press" },
    { label: "Enable Elevation Auto", domain: "switch", entity: "Auto control elevation angle", action: "turn_on" },
    { label: "Disable Elevation Auto", domain: "switch", entity: "Auto control elevation angle", action: "turn_off" },
    { label: "Enable Azimuth Auto", domain: "switch", entity: "Auto control azimuth angle", action: "turn_on" },
    { label: "Disable Azimuth Auto", domain: "switch", entity: "Auto control azimuth angle", action: "turn_off" },
    { label: "Retrieve OWM", domain: "button", entity: "Retrieve OWM data", action: "press" },
    { label: "Mag Declination Cal", domain: "button", entity: "Perform magnetic declination calibration", action: "press" }
  ];

  const keyStateReads = [
    { domain: "sensor", entity: "Panel elevation angle" },
    { domain: "sensor", entity: "Panel azimuth target angle" },
    { domain: "sensor", entity: "Sun Elevation" },
    { domain: "sensor", entity: "Sun Azimuth" },
    { domain: "text_sensor", entity: "Elevation Axis status" },
    { domain: "text_sensor", entity: "Azimuth Axis status" },
    { domain: "binary_sensor", entity: "Elevation axis not calibrated" },
    { domain: "binary_sensor", entity: "Azimuth axis not calibrated" }
  ];

  let deferredInstallPrompt = null;

  function setStatus(element, message, type) {
    element.textContent = message;
    element.classList.remove("warn", "error");

    if (type === "warn") {
      element.classList.add("warn");
    }

    if (type === "error") {
      element.classList.add("error");
    }
  }

  function updateGlobal(message, type) {
    setStatus(globalStatus, message, type);
  }

  function setBlePhase(phase, message, type) {
    blePhase = phase;
    setStatus(bleDetailStatus, `BLE phase: ${phase}. ${message || ""}`.trim(), type);
  }

  function appendTelemetry(message) {
    const line = `[${new Date().toLocaleTimeString()}] ${message}`;
    if (telemetryLog.textContent === "No telemetry yet.") {
      telemetryLog.textContent = "";
    }
    telemetryLog.textContent += `${line}\n`;
    telemetryLog.scrollTop = telemetryLog.scrollHeight;
  }

  function ensureSecureContext() {
    if (!window.isSecureContext) {
      updateGlobal("Web Bluetooth requires HTTPS (or localhost).", "warn");
    }
  }

  function supportsBle() {
    return !!navigator.bluetooth;
  }

  function mapState(value) {
    return stateMap[value] || `Unknown state (0x${value.toString(16)})`;
  }

  function mapError(value) {
    return errorMap[value] || `Unknown error (0x${value.toString(16)})`;
  }

  function readByte(event) {
    const view = event.target.value;
    if (!view || view.byteLength < 1) {
      return 0;
    }

    return view.getUint8(0);
  }

  function bytesToUtf8(bytes) {
    try {
      return new TextDecoder().decode(bytes);
    } catch (err) {
      return "";
    }
  }

  function onBleStateChanged(event) {
    const state = readByte(event);
    setStatus(bleStatus, `State update: ${mapState(state)}`);

    if (state === 0x00) {
      setBlePhase("authorization_required", "Device requires authorization.", "warn");
    } else if (state === 0x01) {
      setBlePhase("authorized", "Ready to send Wi-Fi credentials.");
    } else if (state === 0x02) {
      setBlePhase("provisioning", "Credentials accepted, waiting for Wi-Fi join.");
    }

    if (state === 0x03) {
      setBlePhase("provisioned", "Provisioning completed.");
      updateGlobal("Provisioning finished. Continue with device access in Step 3.");
    }
  }

  function onBleErrorChanged(event) {
    const code = readByte(event);
    if (code !== 0x00) {
      const message = mapError(code);
      setStatus(bleStatus, `Improv error: ${message}`, "error");
      setBlePhase("error", message, "error");
      updateGlobal(`Provisioning error: ${message}`, "error");
    }
  }

  function onBleRpcResult(event) {
    const value = event.target.value;
    if (!value || value.byteLength < 2) {
      return;
    }

    const command = value.getUint8(0);
    const payloadLength = value.getUint8(1);
    const payload = new Uint8Array(value.buffer.slice(2, 2 + payloadLength));
    const payloadText = bytesToUtf8(payload);

    if (payloadText) {
      setStatus(
        bleStatus,
        `RPC result (cmd 0x${command.toString(16)}): ${payloadText}`
      );
    } else {
      setStatus(
        bleStatus,
        `RPC result received for command 0x${command.toString(16)}.`
      );
    }
  }

  async function connectImprovBle() {
    if (!supportsBle()) {
      setStatus(bleStatus, "Web Bluetooth is not available in this browser.", "error");
      updateGlobal("BLE onboarding unavailable. Use AP fallback in Step 2.", "warn");
      return;
    }

    try {
      connectBleButton.disabled = true;
      setBlePhase("connecting", "Opening BLE device picker...");
      setStatus(bleStatus, "Requesting BLE device...");

      const device = await navigator.bluetooth.requestDevice({
        filters: [{ services: [IMPROV_SERVICE_UUID] }],
        optionalServices: [IMPROV_SERVICE_UUID]
      });

      const server = await device.gatt.connect();
      const service = await server.getPrimaryService(IMPROV_SERVICE_UUID);

      const stateChar = await service.getCharacteristic(IMPROV_STATE_UUID);
      const errorChar = await service.getCharacteristic(IMPROV_ERROR_UUID);
      const rpcCommandChar = await service.getCharacteristic(IMPROV_RPC_COMMAND_UUID);
      const rpcResultChar = await service.getCharacteristic(IMPROV_RPC_RESULT_UUID);

      bleContext = {
        device,
        server,
        service,
        stateChar,
        errorChar,
        rpcCommandChar,
        rpcResultChar
      };

      await stateChar.startNotifications();
      await errorChar.startNotifications();
      await rpcResultChar.startNotifications();

      stateChar.addEventListener("characteristicvaluechanged", onBleStateChanged);
      errorChar.addEventListener("characteristicvaluechanged", onBleErrorChanged);
      rpcResultChar.addEventListener("characteristicvaluechanged", onBleRpcResult);

      sendWifiButton.disabled = false;
      setStatus(bleStatus, `Connected to ${device.name || "Improv BLE device"}.`);
      setBlePhase("connected", "Waiting for state notifications.");
      updateGlobal("BLE connected. Enter Wi-Fi credentials and send provisioning.");
    } catch (error) {
      setStatus(bleStatus, `BLE connect failed: ${error.message || error}`, "error");
      setBlePhase("connect_failed", "Use AP fallback if needed.", "warn");
      updateGlobal("BLE onboarding failed. You can continue with AP fallback.", "warn");
    } finally {
      connectBleButton.disabled = false;
    }
  }

  function buildWifiPayload(ssid, password) {
    const encoder = new TextEncoder();
    const ssidBytes = encoder.encode(ssid);
    const passwordBytes = encoder.encode(password);

    const payload = new Uint8Array(ssidBytes.length + passwordBytes.length + 2);
    payload.set(ssidBytes, 0);
    payload[ssidBytes.length] = 0x00;
    payload.set(passwordBytes, ssidBytes.length + 1);
    payload[payload.length - 1] = 0x00;

    const command = 0x01;
    const packet = new Uint8Array(payload.length + 2);
    packet[0] = command;
    packet[1] = payload.length;
    packet.set(payload, 2);
    return packet;
  }

  async function sendWifiCredentials() {
    if (!bleContext.rpcCommandChar) {
      setStatus(bleStatus, "No BLE connection available.", "error");
      return;
    }

    const ssid = wifiSsidInput.value.trim();
    const password = wifiPasswordInput.value;

    if (!ssid) {
      setStatus(bleStatus, "SSID is required.", "warn");
      return;
    }

    if (blePhase === "authorization_required") {
      setStatus(bleStatus, "Device reports authorization required. Check firmware auth flow.", "warn");
    }

    try {
      sendWifiButton.disabled = true;
      setBlePhase("sending_credentials", "Sending Improv Wi-Fi RPC payload...");
      const packet = buildWifiPayload(ssid, password);
      await bleContext.rpcCommandChar.writeValue(packet);
      setStatus(bleStatus, "Wi-Fi credentials sent. Waiting for state updates...");
      updateGlobal("Provisioning command sent via Improv BLE.");
    } catch (error) {
      setStatus(bleStatus, `Failed to send credentials: ${error.message || error}`, "error");
      updateGlobal("Could not send BLE provisioning command.", "error");
    } finally {
      sendWifiButton.disabled = false;
    }
  }

  function getResolvedDeviceUrl() {
    const fromInput = normalizeDeviceUrl(deviceUrlInput.value);
    if (fromInput) {
      return fromInput;
    }

    return localStorage.getItem("sunchronizer.deviceUrl") || "";
  }

  function buildApiPath(domain, entity, action, query) {
    const safeDomain = encodeURIComponent(domain.trim());
    const safeEntity = encodeURIComponent(entity.trim());
    let path = `/${safeDomain}/${safeEntity}`;

    if (action && action.trim()) {
      path += `/${encodeURIComponent(action.trim())}`;
    }

    if (query && query.trim()) {
      path += `?${query.trim()}`;
    }

    return path;
  }

  async function apiRequest(path, options) {
    const baseUrl = getResolvedDeviceUrl();
    if (!baseUrl) {
      setStatus(apiStatus, "No device URL configured. Set Step 3 first.", "warn");
      throw new Error("No device URL");
    }

    const url = `${baseUrl}${path}`;
    const response = await fetch(url, {
      method: options.method,
      mode: "cors"
    });

    const contentType = response.headers.get("content-type") || "";
    let payload;
    if (contentType.includes("application/json")) {
      payload = await response.json();
    } else {
      payload = await response.text();
    }

    return {
      ok: response.ok,
      status: response.status,
      url,
      payload
    };
  }

  async function probeWebApi() {
    const baseUrl = getResolvedDeviceUrl();
    if (!baseUrl) {
      setStatus(controlStatus, "No device URL configured.", "warn");
      return;
    }

    setStatus(controlStatus, "Probing ESPHome web endpoints...");

    const checks = [
      { label: "Root index", path: "/" },
      { label: "Events endpoint", path: "/events" },
      { label: "Version text sensor (common)", path: "/text_sensor/Firmware Version" },
      { label: "Status binary sensor (common)", path: "/binary_sensor/Status" }
    ];

    const lines = [];
    for (const check of checks) {
      try {
        const result = await fetch(`${baseUrl}${check.path}`, { method: "GET", mode: "cors" });
        lines.push(`${check.label}: HTTP ${result.status}`);
      } catch (error) {
        lines.push(`${check.label}: ${error.message || error}`);
      }
    }

    const message = lines.join(" | ");
    setStatus(controlStatus, message);
    appendTelemetry(`Probe: ${message}`);
  }

  async function fetchCommonStates() {
    const baseUrl = getResolvedDeviceUrl();
    if (!baseUrl) {
      setStatus(controlStatus, "No device URL configured.", "warn");
      return;
    }

    const candidates = [
      ["switch", "Sun Tracking"],
      ["switch", "Automatic Tracking"],
      ["number", "Target Elevation"],
      ["sensor", "Panel Elevation"],
      ["sensor", "Panel Azimuth"],
      ["binary_sensor", "Fault State"],
      ["text_sensor", "Fault Description"]
    ];

    const collected = [];
    for (const [domain, entity] of candidates) {
      try {
        const path = buildApiPath(domain, entity, "", "");
        const result = await apiRequest(path, { method: "GET" });
        if (result.ok) {
          collected.push({ domain, entity, payload: result.payload });
        }
      } catch (_) {
        // Ignore unknown entities and continue.
      }
    }

    if (!collected.length) {
      setStatus(controlStatus, "No common entity candidates resolved. Use custom control in Step 4.", "warn");
      return;
    }

    const summary = collected
      .map((item) => {
        const state = typeof item.payload === "object" && item.payload ? item.payload.state : "(no state)";
        return `${item.domain}/${item.entity}: ${state}`;
      })
      .join(" | ");

    setStatus(controlStatus, `Resolved entities: ${collected.length}.`);
    appendTelemetry(`Common states: ${summary}`);
  }

  function connectEvents() {
    const baseUrl = getResolvedDeviceUrl();
    if (!baseUrl) {
      setStatus(controlStatus, "No device URL configured.", "warn");
      return;
    }

    if (eventsSource) {
      return;
    }

    try {
      eventsSource = new EventSource(`${baseUrl}/events`);
      connectEventsButton.disabled = true;
      disconnectEventsButton.disabled = false;
      appendTelemetry("Connecting to /events stream...");

      eventsSource.addEventListener("open", function () {
        appendTelemetry("Event stream connected.");
        setStatus(controlStatus, "Live telemetry connected.");
      });

      eventsSource.addEventListener("state", function (event) {
        appendTelemetry(`state: ${event.data}`);
      });

      eventsSource.addEventListener("log", function (event) {
        appendTelemetry(`log: ${event.data}`);
      });

      eventsSource.addEventListener("error", function () {
        appendTelemetry("Event stream error. Check network or auth settings.");
      });
    } catch (error) {
      setStatus(controlStatus, `Unable to connect events: ${error.message || error}`, "error");
    }
  }

  function disconnectEvents() {
    if (eventsSource) {
      eventsSource.close();
      eventsSource = null;
      appendTelemetry("Event stream disconnected.");
    }

    connectEventsButton.disabled = false;
    disconnectEventsButton.disabled = true;
  }

  async function getEntityState() {
    const domain = apiDomainInput.value.trim();
    const entity = apiEntityInput.value.trim();

    if (!domain || !entity) {
      setStatus(apiStatus, "Domain and entity are required.", "warn");
      return;
    }

    try {
      const path = buildApiPath(domain, entity, "", "detail=all");
      const result = await apiRequest(path, { method: "GET" });
      setStatus(apiStatus, `GET ${result.status} for ${result.url}`);
      apiResponse.textContent = JSON.stringify(result.payload, null, 2);
    } catch (error) {
      setStatus(apiStatus, `GET failed: ${error.message || error}`, "error");
    }
  }

  async function postEntityAction() {
    const domain = apiDomainInput.value.trim();
    const entity = apiEntityInput.value.trim();
    const action = apiActionInput.value.trim();
    const query = apiQueryInput.value.trim();

    if (!domain || !entity || !action) {
      setStatus(apiStatus, "Domain, entity and action are required.", "warn");
      return;
    }

    try {
      const path = buildApiPath(domain, entity, action, query);
      const result = await apiRequest(path, { method: "POST" });
      setStatus(apiStatus, `POST ${result.status} for ${result.url}`);
      apiResponse.textContent =
        typeof result.payload === "string"
          ? result.payload
          : JSON.stringify(result.payload, null, 2);
    } catch (error) {
      setStatus(apiStatus, `POST failed: ${error.message || error}`, "error");
    }
  }

  async function runPresetControl(preset) {
    try {
      const path = buildApiPath(preset.domain, preset.entity, preset.action, "");
      const result = await apiRequest(path, { method: "POST" });
      setStatus(apiStatus, `${preset.label}: HTTP ${result.status}`);
      apiResponse.textContent =
        typeof result.payload === "string"
          ? result.payload
          : JSON.stringify(result.payload, null, 2);
      appendTelemetry(`Preset '${preset.label}' executed.`);
    } catch (error) {
      setStatus(apiStatus, `Preset '${preset.label}' failed: ${error.message || error}`, "error");
    }
  }

  async function setNumberValue(entity, value) {
    const encoded = encodeURIComponent(String(value));
    const path = buildApiPath("number", entity, "set", `value=${encoded}`);
    return apiRequest(path, { method: "POST" });
  }

  async function setSwitchValue(entity, enabled) {
    const action = enabled ? "turn_on" : "turn_off";
    const path = buildApiPath("switch", entity, action, "");
    return apiRequest(path, { method: "POST" });
  }

  async function pressButton(entity) {
    const path = buildApiPath("button", entity, "press", "");
    return apiRequest(path, { method: "POST" });
  }

  async function executeActions(actionList, label) {
    const results = [];

    for (const action of actionList) {
      try {
        let result;
        if (action.type === "switch") {
          result = await setSwitchValue(action.entity, action.value);
        } else if (action.type === "number") {
          result = await setNumberValue(action.entity, action.value);
        } else if (action.type === "button") {
          result = await pressButton(action.entity);
        }

        results.push(`${action.type}/${action.entity}: HTTP ${result.status}`);
      } catch (error) {
        results.push(`${action.type}/${action.entity}: ${error.message || error}`);
      }
    }

    const summary = `${label}: ${results.join(" | ")}`;
    setStatus(apiStatus, summary);
    appendTelemetry(summary);
    apiResponse.textContent = results.join("\n");
  }

  async function runAutoTrackingMode() {
    await executeActions(
      [
        { type: "switch", entity: "Auto control elevation angle", value: true },
        { type: "switch", entity: "Auto control azimuth angle", value: true }
      ],
      "Auto Tracking"
    );
  }

  async function runStandbySafeMode() {
    try {
      const standbyElevation = await apiRequest(
        buildApiPath("number", "Stand by elevtation target angle", "", ""),
        { method: "GET" }
      );
      const standbyAzimuth = await apiRequest(
        buildApiPath("number", "Stand by azimuth target angle", "", ""),
        { method: "GET" }
      );

      const elevationValue = standbyElevation.payload && standbyElevation.payload.value;
      const azimuthValue = standbyAzimuth.payload && standbyAzimuth.payload.value;

      await executeActions(
        [
          { type: "switch", entity: "Auto control elevation angle", value: false },
          { type: "switch", entity: "Auto control azimuth angle", value: false },
          { type: "number", entity: "Panel elevation target angle", value: elevationValue },
          { type: "number", entity: "Panel azimuth target angle", value: azimuthValue }
        ],
        "Standby / Safe Position"
      );
    } catch (error) {
      setStatus(apiStatus, `Standby mode failed: ${error.message || error}`, "error");
    }
  }

  async function runServicePositionMode() {
    await executeActions(
      [
        { type: "switch", entity: "Auto control elevation angle", value: false },
        { type: "switch", entity: "Auto control azimuth angle", value: false },
        { type: "number", entity: "Panel elevation target angle", value: 35 },
        { type: "number", entity: "Panel azimuth target angle", value: 180 }
      ],
      "Service Position"
    );
  }

  async function runCalibrationMode() {
    await executeActions(
      [
        { type: "switch", entity: "Auto control elevation angle", value: false },
        { type: "switch", entity: "Auto control azimuth angle", value: false },
        { type: "button", entity: "Perform magnetic declination calibration" },
        { type: "button", entity: "Start elevation angle measurement" },
        { type: "button", entity: "Start Azimuth angle measurement" }
      ],
      "Calibration Mode"
    );
  }

  async function applyManualTargets() {
    const elevation = Number(manualElevationInput.value);
    const azimuth = Number(manualAzimuthInput.value);
    const tolerance = manualToleranceInput.value.trim();

    if (Number.isNaN(elevation) || Number.isNaN(azimuth)) {
      setStatus(apiStatus, "Manual elevation and azimuth values are required.", "warn");
      return;
    }

    const actions = [
      { type: "switch", entity: "Auto control elevation angle", value: false },
      { type: "switch", entity: "Auto control azimuth angle", value: false },
      { type: "number", entity: "Panel elevation target angle", value: elevation },
      { type: "number", entity: "Panel azimuth target angle", value: azimuth }
    ];

    if (tolerance) {
      const tol = Number(tolerance);
      if (Number.isNaN(tol)) {
        setStatus(apiStatus, "Tolerance must be numeric.", "warn");
        return;
      }

      actions.push({ type: "number", entity: "Panel elevation target angle tolerance", value: tol });
      actions.push({ type: "number", entity: "Panel azimuth target angle tolerance", value: tol });
    }

    await executeActions(actions, "Manual Target Apply");
  }

  async function triggerCalibrationAction(entityName, label) {
    try {
      const result = await pressButton(entityName);
      const message = `${label}: HTTP ${result.status}`;
      setStatus(calibrationStatus, message);
      appendTelemetry(message);
      apiResponse.textContent =
        typeof result.payload === "string"
          ? result.payload
          : JSON.stringify(result.payload, null, 2);
    } catch (error) {
      const message = `${label} failed: ${error.message || error}`;
      setStatus(calibrationStatus, message, "error");
      setStatus(apiStatus, message, "error");
    }
  }

  async function runMagDeclinationCalibration() {
    await triggerCalibrationAction(
      "Perform magnetic declination calibration",
      "Magnetic declination calibration"
    );
  }

  async function runElevationCalibration() {
    await triggerCalibrationAction(
      "Start elevation angle measurement",
      "Elevation axis measurement"
    );
  }

  async function runAzimuthCalibration() {
    await triggerCalibrationAction(
      "Start Azimuth angle measurement",
      "Azimuth axis measurement"
    );
  }

  async function runSaveDeclination() {
    await triggerCalibrationAction(
      "Save current magnetic declination",
      "Save current declination"
    );
  }

  function renderPresetControls() {
    if (!presetControls) {
      return;
    }

    presetControls.innerHTML = "";
    sunchronizerPresets.forEach((preset) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "chip";
      button.textContent = preset.label;
      button.title = `${preset.domain}/${preset.entity}/${preset.action}`;
      button.addEventListener("click", function () {
        runPresetControl(preset);
      });
      presetControls.appendChild(button);
    });
  }

  async function refreshPresetStates() {
    const lines = [];

    for (const item of keyStateReads) {
      try {
        const path = buildApiPath(item.domain, item.entity, "", "");
        const result = await apiRequest(path, { method: "GET" });
        if (!result.ok) {
          lines.push(`${item.domain}/${item.entity}: HTTP ${result.status}`);
          continue;
        }

        if (typeof result.payload === "object" && result.payload) {
          const state = result.payload.state ?? "n/a";
          lines.push(`${item.entity}: ${state}`);
        } else {
          lines.push(`${item.entity}: ${String(result.payload)}`);
        }
      } catch (error) {
        lines.push(`${item.entity}: ${error.message || error}`);
      }
    }

    presetStateOutput.textContent = lines.join("\n");
  }

  function openApPortal() {
    const url = portalUrlInput.value.trim();
    if (!url) {
      setStatus(apStatus, "Please enter a portal URL.", "warn");
      return;
    }

    try {
      window.open(url, "_blank", "noopener,noreferrer");
      setStatus(apStatus, `Opened portal URL: ${url}`);
      updateGlobal("AP fallback started. Complete provisioning in the portal.");
    } catch (error) {
      setStatus(apStatus, `Could not open portal URL: ${error.message || error}`, "error");
    }
  }

  function normalizeDeviceUrl(rawValue) {
    const value = rawValue.trim();
    if (!value) {
      return "";
    }

    if (value.startsWith("http://") || value.startsWith("https://")) {
      return value;
    }

    return `http://${value}`;
  }

  function saveDeviceUrl() {
    const url = normalizeDeviceUrl(deviceUrlInput.value);
    if (!url) {
      setStatus(controlStatus, "Please enter a device URL first.", "warn");
      return;
    }

    localStorage.setItem("sunchronizer.deviceUrl", url);
    setStatus(controlStatus, `Saved device URL: ${url}`);
    updateGlobal("Device URL saved. You can now open the local UI.");
  }

  function openDeviceUi() {
    const url = getResolvedDeviceUrl();

    if (!url) {
      setStatus(controlStatus, "No URL found. Enter and save a local device URL.", "warn");
      return;
    }

    window.open(url, "_blank", "noopener,noreferrer");
    setStatus(controlStatus, `Opened device URL: ${url}`);
  }

  function restoreSavedDeviceUrl() {
    const saved = localStorage.getItem("sunchronizer.deviceUrl") || "";
    if (saved) {
      deviceUrlInput.value = saved;
      setStatus(controlStatus, `Loaded saved device URL: ${saved}`);
    }
  }

  function registerServiceWorker() {
    if (!("serviceWorker" in navigator)) {
      return;
    }

    navigator.serviceWorker
      .register("onboarding-sw.js")
      .catch((error) => {
        console.warn("Service worker registration failed", error);
      });
  }

  function setupPwaInstallPrompt() {
    window.addEventListener("beforeinstallprompt", (event) => {
      event.preventDefault();
      deferredInstallPrompt = event;
      installPwaButton.style.display = "inline-block";
    });

    installPwaButton.addEventListener("click", async function () {
      if (!deferredInstallPrompt) {
        return;
      }

      deferredInstallPrompt.prompt();
      await deferredInstallPrompt.userChoice;
      deferredInstallPrompt = null;
      installPwaButton.style.display = "none";
    });
  }

  function wireUi() {
    connectBleButton.addEventListener("click", connectImprovBle);
    sendWifiButton.addEventListener("click", sendWifiCredentials);
    openPortalButton.addEventListener("click", openApPortal);
    saveDeviceUrlButton.addEventListener("click", saveDeviceUrl);
    probeDeviceButton.addEventListener("click", probeWebApi);
    refreshCommonStatesButton.addEventListener("click", fetchCommonStates);
    connectEventsButton.addEventListener("click", connectEvents);
    disconnectEventsButton.addEventListener("click", disconnectEvents);
    openDeviceButton.addEventListener("click", openDeviceUi);
    apiGetButton.addEventListener("click", getEntityState);
    apiPostButton.addEventListener("click", postEntityAction);
    refreshPresetStatesButton.addEventListener("click", refreshPresetStates);
    modeAutoTrackingButton.addEventListener("click", runAutoTrackingMode);
    modeStandbySafeButton.addEventListener("click", runStandbySafeMode);
    modeServicePositionButton.addEventListener("click", runServicePositionMode);
    modeCalibrationButton.addEventListener("click", runCalibrationMode);
    applyManualTargetsButton.addEventListener("click", applyManualTargets);
    calibMagDeclinationButton.addEventListener("click", runMagDeclinationCalibration);
    calibElevationButton.addEventListener("click", runElevationCalibration);
    calibAzimuthButton.addEventListener("click", runAzimuthCalibration);
    calibSaveDeclinationButton.addEventListener("click", runSaveDeclination);
  }

  ensureSecureContext();
  restoreSavedDeviceUrl();
  wireUi();
  renderPresetControls();
  registerServiceWorker();
  setupPwaInstallPrompt();

  if (!supportsBle()) {
    setStatus(bleStatus, "Web Bluetooth not supported here. Use AP fallback in Step 2.", "warn");
    setBlePhase("unsupported", "Switch to AP onboarding.", "warn");
  }
})();
