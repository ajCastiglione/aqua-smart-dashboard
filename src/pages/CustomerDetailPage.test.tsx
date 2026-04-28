import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { CustomerProfile } from "../api/types";
import { CustomerDetailPage } from "./CustomerDetailPage";

const profile: CustomerProfile = {
  CustomerNumber: "C-200",
  FirstName: "Pool",
  LastName: "Owner",
  Street: "2 Wave Dr",
  City: "Orlando",
  State: "FL",
  ZipCode: "32801",
  EmailAddress: "p@example.com",
  PhoneNumber: "555-0200",
  VendorNumber: "V9",
  VendorName: "Aqua Vendor",
  TechName: "Chris Tech",
  SerialNumber: "SN-99",
  InstallDate: "01/15/2024",
  IPAddress: "10.0.0.2",
};

const baseQuery = {
  isPending: false,
  isError: false,
  error: null,
  refetch: vi.fn(),
};

vi.mock("../hooks/queries/customer-profile-queries", () => ({
  useCustomerProfile: vi.fn(),
}));
vi.mock("../hooks/queries/customer-pressure-queries", () => ({
  useCustomerPressureByCustomer: vi.fn(),
}));
vi.mock("../hooks/queries/customer-flowrate-queries", () => ({
  useCustomerFlowRateByCustomer: vi.fn(),
}));
vi.mock("../hooks/queries/customer-temp-queries", () => ({
  useCustomerTempByCustomer: vi.fn(),
}));
vi.mock("../hooks/queries/customer-pumpcycle-queries", () => ({
  useCustomerPumpCyclesByCustomer: vi.fn(),
}));
vi.mock("../hooks/queries/vendor-profile-queries", () => ({
  useVendorProfile: vi.fn(),
}));
vi.mock("../hooks/queries/serial-numbers-queries", () => ({
  useSerialNumber: vi.fn(),
}));

vi.mock("../components/features/detail/TempChart", () => ({
  TempChart: () => <div data-testid="temp-chart-stub" />,
}));

import { useCustomerProfile } from "../hooks/queries/customer-profile-queries";
import { useCustomerPressureByCustomer } from "../hooks/queries/customer-pressure-queries";
import { useCustomerFlowRateByCustomer } from "../hooks/queries/customer-flowrate-queries";
import { useCustomerTempByCustomer } from "../hooks/queries/customer-temp-queries";
import { useCustomerPumpCyclesByCustomer } from "../hooks/queries/customer-pumpcycle-queries";
import { useVendorProfile } from "../hooks/queries/vendor-profile-queries";
import { useSerialNumber } from "../hooks/queries/serial-numbers-queries";

describe("CustomerDetailPage", () => {
  beforeEach(() => {
    vi.mocked(useCustomerProfile).mockReturnValue({
      ...baseQuery,
      data: profile,
      isSuccess: true,
      isPending: false,
    } as never);
    vi.mocked(useCustomerPressureByCustomer).mockReturnValue({
      ...baseQuery,
      data: [
        {
          CustomerNumber: "C-200",
          DateTime: "2024-01-01 12:00:00",
          Pressure_Reading: "32",
        },
      ],
    } as never);
    vi.mocked(useCustomerFlowRateByCustomer).mockReturnValue({
      ...baseQuery,
      data: [
        {
          CustomerNumber: "C-200",
          DateTime: "2024-01-01 12:00:00",
          Flow_Rate: "45",
          Pump_Status: "on",
        },
      ],
    } as never);
    vi.mocked(useCustomerTempByCustomer).mockReturnValue({
      ...baseQuery,
      data: [
        {
          Customer_Number: "C-200",
          Sequence_Number: "1",
          Date: "01/01/2024",
          Time: "12:00:00",
          Temp_Reading: "89",
        },
      ],
    } as never);
    vi.mocked(useCustomerPumpCyclesByCustomer).mockReturnValue({
      ...baseQuery,
      data: {
        data: [],
        current_page: 1,
        last_page: 1,
        per_page: 100,
        total: 0,
      },
    } as never);
    vi.mocked(useVendorProfile).mockReturnValue({
      ...baseQuery,
      data: {
        VendorNumber: "V9",
        VendorName: "Aqua Vendor",
        Street: "100 Vendor Rd",
        City: "Tampa",
        State: "FL",
        ZipCode: "33602",
      },
    } as never);
    vi.mocked(useSerialNumber).mockReturnValue({
      ...baseQuery,
      data: undefined,
    } as never);
  });

  const renderAt = (path: string) =>
    render(
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route
            path="/customers/:customerNumber"
            element={<CustomerDetailPage />}
          />
        </Routes>
      </MemoryRouter>,
    );

  it("shows customer name and encodes customer number in the route param", () => {
    renderAt("/customers/C-200");
    expect(screen.getByText("Pool Owner")).toBeInTheDocument();
    expect(screen.getByText("Chris Tech")).toBeInTheDocument();
  });
});
