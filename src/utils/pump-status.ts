/**
 * Pump status helpers for customer detail telemetry: normalize API `Pump_Status` strings and
 * derive tile copy when the API omits status but flow readings imply idle.
 */
export type PumpStatusTileDisplay = {
  /** Short label for the metric tile */
  primaryLabel: "On" | "Off" | "—";
  /** Optional one-line explanation under the label (inferred status or missing data) */
  hint?: string;
};

const normalizePumpOnOff = (
  raw: string | null | undefined,
): "on" | "off" | null => {
  if (raw == null) return null;
  const s = String(raw).trim().toLowerCase();
  if (s === "") return null;

  if (
    s === "on" ||
    s === "running" ||
    s === "run" ||
    s === "true" ||
    s === "1" ||
    s === "yes" ||
    s === "active"
  ) {
    return "on";
  }
  if (
    s === "off" ||
    s === "idle" ||
    s === "stopped" ||
    s === "stop" ||
    s === "false" ||
    s === "0" ||
    s === "no" ||
    s === "standby"
  ) {
    return "off";
  }
  return null;
};

/**
 * @param statusRaw `Pump_Status` / `pump_status` from the **latest-by-time** flow snapshot row
 * @param snapshotFlowGpm parsed `Flow_Rate` from that same snapshot row (undefined if missing)
 */
export const buildPumpStatusTileDisplay = (
  statusRaw: string | null | undefined,
  snapshotFlowGpm: number | undefined,
): PumpStatusTileDisplay => {
  const fromApi = normalizePumpOnOff(statusRaw);
  if (fromApi === "on") return { primaryLabel: "On" };
  if (fromApi === "off") {
    return { primaryLabel: "Off" };
  }

  if (snapshotFlowGpm === 0) {
    return {
      primaryLabel: "Off",
      hint: "Inferred from the latest flow reading (0 GPM). The equipment did not send pump status.",
    };
  }

  if (snapshotFlowGpm !== undefined && snapshotFlowGpm > 0) {
    return {
      primaryLabel: "—",
      hint: "Pump on/off was not reported for the latest reading.",
    };
  }

  return {
    primaryLabel: "—",
    hint: "No pump status or flow reading for the latest snapshot.",
  };
};
