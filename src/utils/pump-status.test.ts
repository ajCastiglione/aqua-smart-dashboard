import { describe, expect, it } from "vitest";
import { buildPumpStatusTileDisplay } from "./pump-status";

describe("buildPumpStatusTileDisplay", () => {
  it("maps API on/off variants", () => {
    expect(buildPumpStatusTileDisplay("On", undefined)).toEqual({
      primaryLabel: "On",
    });
    expect(buildPumpStatusTileDisplay("OFF", undefined)).toEqual({
      primaryLabel: "Off",
    });
    expect(buildPumpStatusTileDisplay("idle", undefined)).toEqual({
      primaryLabel: "Off",
    });
  });

  it("infers Off from zero snapshot flow when status missing", () => {
    const r = buildPumpStatusTileDisplay(null, 0);
    expect(r.primaryLabel).toBe("Off");
    expect(r.hint).toMatch(/Inferred from the latest flow reading/);
  });

  it("does not guess On when status missing but flow is positive", () => {
    const r = buildPumpStatusTileDisplay(null, 42);
    expect(r.primaryLabel).toBe("—");
    expect(r.hint).toMatch(/not reported/);
  });

  it("shows em dash when status and flow snapshot are unknown", () => {
    const r = buildPumpStatusTileDisplay(null, undefined);
    expect(r.primaryLabel).toBe("—");
    expect(r.hint).toMatch(/No pump status/);
  });
});
