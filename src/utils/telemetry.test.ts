import { describe, expect, it } from "vitest";
import { latestTempReading } from "./telemetry";

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
