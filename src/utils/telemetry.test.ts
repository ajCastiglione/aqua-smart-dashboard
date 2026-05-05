import { describe, expect, it } from "vitest";
import {
  flowRateRaw,
  latestFlowReading,
  latestPressureReading,
  latestTempReading,
} from "./telemetry";

describe("latestTempReading", () => {
  it("prefers a row with a temperature over a clock-newer row without one", () => {
    const rows = [
      {
        Customer_Number: "C1",
        Sequence_Number: "1",
        Date: "01/02/2024",
        Time: "12:00:00",
        Temp_Reading: "",
      },
      {
        Customer_Number: "C1",
        Sequence_Number: "2",
        Date: "01/01/2024",
        Time: "12:00:00",
        Temp_Reading: "88",
      },
    ];
    expect(latestTempReading(rows)?.Temp_Reading).toBe("88");
  });

  it("uses last row with temp when Date/Time cannot be parsed", () => {
    const rows = [
      {
        Customer_Number: "C1",
        Sequence_Number: "1",
        Date: "",
        Time: "",
        Temp_Reading: "70",
      },
      {
        Customer_Number: "C1",
        Sequence_Number: "2",
        Date: "",
        Time: "",
        Temp_Reading: "72",
      },
    ];
    expect(latestTempReading(rows)?.Temp_Reading).toBe("72");
  });
});

describe("latestFlowReading", () => {
  it("prefers latest non-zero flow over newer idle 0.00 rows (matches live API behaviour)", () => {
    const rows = [
      {
        CustomerNumber: "100001",
        DateTime: "2026-05-01T16:10:16.893000Z",
        Flow_Rate: "0.00",
      },
      {
        CustomerNumber: "100001",
        DateTime: "2026-04-30T12:42:16.847000Z",
        Flow_Rate: "32.70",
      },
    ];
    expect(latestFlowReading(rows)?.Flow_Rate).toBe("32.70");
  });

  it("prefers a row with GPM over a clock-newer row without Flow_Rate", () => {
    const rows = [
      {
        CustomerNumber: "C1",
        DateTime: "2026-02-25T12:00:00.000000Z",
        Flow_Rate: "",
      },
      {
        CustomerNumber: "C1",
        DateTime: "2026-02-24T12:00:00.000000Z",
        Flow_Rate: "42",
      },
    ];
    expect(latestFlowReading(rows)?.Flow_Rate).toBe("42");
  });

  it("uses last row with GPM when DateTime is unparseable for all", () => {
    const rows = [
      {
        CustomerNumber: "C1",
        DateTime: "",
        Flow_Rate: "10",
      },
      {
        CustomerNumber: "C1",
        DateTime: "",
        Flow_Rate: "11",
      },
    ];
    expect(latestFlowReading(rows)?.Flow_Rate).toBe("11");
  });

  it("treats snake_case flow_rate as the reading when Flow_Rate is absent", () => {
    const rows = [
      {
        CustomerNumber: "C1",
        DateTime: "2026-02-24T12:00:00.000000Z",
        flow_rate: "88",
      },
    ];
    const latest = latestFlowReading(rows);
    expect(latest).toBeDefined();
    expect(flowRateRaw(latest)).toBe("88");
  });
});

describe("latestPressureReading", () => {
  it("prefers a row with PSI over a clock-newer row without Pressure_Reading", () => {
    const rows = [
      {
        CustomerNumber: "C1",
        DateTime: "2026-02-25T12:00:00.000000Z",
        Pressure_Reading: null,
      },
      {
        CustomerNumber: "C1",
        DateTime: "2026-02-24T12:00:00.000000Z",
        Pressure_Reading: "32",
      },
    ];
    expect(latestPressureReading(rows)?.Pressure_Reading).toBe("32");
  });
});
