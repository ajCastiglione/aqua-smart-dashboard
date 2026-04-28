import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Card } from "../components/ui/Card";
import { EmptyState } from "../components/ui/EmptyState";
import { ErrorMessage } from "../components/ui/ErrorMessage";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";
import { MetricTiles } from "../components/features/detail/MetricTiles";
import { ServicingTab } from "../components/features/detail/ServicingTab";
import { TempChart } from "../components/features/detail/TempChart";
import { useCustomerProfile } from "../hooks/queries/customer-profile-queries";
import { useCustomerPumpCyclesByCustomer } from "../hooks/queries/customer-pumpcycle-queries";
import { useCustomerFlowRateByCustomer } from "../hooks/queries/customer-flowrate-queries";
import { useCustomerPressureByCustomer } from "../hooks/queries/customer-pressure-queries";
import { useCustomerTempByCustomer } from "../hooks/queries/customer-temp-queries";
import { useSerialNumber } from "../hooks/queries/serial-numbers-queries";
import { useVendorProfile } from "../hooks/queries/vendor-profile-queries";
import { parseApiError } from "../utils/errors";
import {
  formatFullName,
  formatInstallDate,
  formatStreetAddress,
} from "../utils/format";
import {
  latestFlowReading,
  latestPressureReading,
  latestTempReading,
  parseNumericString,
} from "../utils/telemetry";

type TabId = "info" | "servicing" | "notes" | "messages";

const tabs: { id: TabId; label: string }[] = [
  { id: "info", label: "Info" },
  { id: "servicing", label: "Servicing" },
];

export const CustomerDetailPage = () => {
  const { customerNumber: customerNumberRouteSegment } = useParams();
  const customerNumber = customerNumberRouteSegment
    ? decodeURIComponent(customerNumberRouteSegment)
    : undefined;
  const [tab, setTab] = useState<TabId>("info");

  const profileQuery = useCustomerProfile(customerNumber);
  const pressureQuery = useCustomerPressureByCustomer(customerNumber);
  const flowQuery = useCustomerFlowRateByCustomer(customerNumber);
  const tempQuery = useCustomerTempByCustomer(customerNumber);
  const pumpQuery = useCustomerPumpCyclesByCustomer(customerNumber);

  const profile = profileQuery.data;
  const vendorQuery = useVendorProfile(profile?.VendorNumber);
  const serialQuery = useSerialNumber(profile?.SerialNumber);

  if (profileQuery.isPending) {
    return <LoadingSpinner label="Loading customer" />;
  }

  if (profileQuery.isError || !profile) {
    const profileErr = parseApiError(profileQuery.error);
    return (
      <Card>
        <ErrorMessage
          title={profileErr.title}
          message={profileErr.message}
          onRetry={() => void profileQuery.refetch()}
        />
        <Link to="/" className="mt-4 inline-block text-sky-600 hover:underline">
          Back to list
        </Link>
      </Card>
    );
  }

  const latestTemperatureRow = latestTempReading(tempQuery.data ?? []);
  const latestPressureRow = latestPressureReading(pressureQuery.data ?? []);
  const latestFlowRateRow = latestFlowReading(flowQuery.data ?? []);
  const poolTempFahrenheit = parseNumericString(
    latestTemperatureRow?.Temp_Reading,
  );
  const pressurePsi = parseNumericString(latestPressureRow?.Pressure_Reading);
  const flowGpm = parseNumericString(latestFlowRateRow?.Flow_Rate);

  const pumpCycles = pumpQuery.data?.data ?? [];

  return (
    <div className="flex flex-col gap-6 lg:flex-row">
      <aside className="w-full shrink-0 space-y-4 lg:max-w-sm">
        <Card>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Customer
          </p>
          <p className="mt-1 text-lg font-bold text-slate-900">
            {formatFullName(profile)}
          </p>
          <p className="mt-2 text-sm text-slate-600">
            Service tech:{" "}
            <span className="font-medium text-slate-800">
              {profile.TechName}
            </span>
          </p>
          <div className="mt-4 flex gap-2">
            <button
              type="button"
              className="rounded-full border border-slate-200 p-2 text-slate-400"
              disabled
              aria-label="Previous pool"
              title="Single pool record in prototype"
            >
              ‹
            </button>
            <button
              type="button"
              className="rounded-full border border-slate-200 p-2 text-slate-400"
              disabled
              aria-label="Next pool"
              title="Single pool record in prototype"
            >
              ›
            </button>
          </div>
        </Card>

        <Card title="Pool & equipment">
          <p className="text-sm font-medium text-slate-800">
            {formatStreetAddress(profile)}
          </p>
          <p className="mt-2 text-sm text-slate-600">
            Phone: <span className="text-slate-900">{profile.PhoneNumber}</span>
          </p>
          <p className="mt-1 text-sm text-slate-600">
            Model / serial:{" "}
            <span className="font-mono text-slate-900">
              {profile.SerialNumber}
            </span>
          </p>
          <p className="mt-1 text-sm text-slate-600">
            Installed:{" "}
            <span className="text-slate-900">
              {formatInstallDate(profile.InstallDate)}
            </span>
          </p>
          {serialQuery.data?.DateRegistered ? (
            <p className="mt-1 text-xs text-slate-500">
              Registered: {formatInstallDate(serialQuery.data.DateRegistered)}
            </p>
          ) : serialQuery.isError ? (
            <p className="mt-1 text-xs text-slate-500" role="status">
              Registration details are unavailable for this equipment record.
            </p>
          ) : null}
        </Card>

        {vendorQuery.data ? (
          <Card title="Vendor">
            <p className="font-medium text-slate-800">
              {vendorQuery.data.VendorName}
            </p>
            <p className="mt-1 text-sm text-slate-600">
              {vendorQuery.data.Street}, {vendorQuery.data.City},{" "}
              {vendorQuery.data.State} {vendorQuery.data.ZipCode}
            </p>
          </Card>
        ) : null}
      </aside>

      <section className="min-w-0 flex-1 rounded-2xl border border-white/10 bg-[#0a1a2e]/90 p-4 shadow-xl backdrop-blur-md md:p-6">
        <div className="flex flex-col gap-4 border-b border-white/10 pb-4 md:flex-row">
          <nav
            className="flex flex-col gap-1 md:flex-row md:gap-2"
            aria-label="Customer sections"
          >
            {tabs.map(tabItem => (
              <button
                key={tabItem.id}
                type="button"
                className={`rounded-lg px-4 py-2 text-left text-sm font-semibold md:text-center ${
                  tab === tabItem.id
                    ? "bg-sky-600 text-white shadow"
                    : "bg-slate-800/80 text-sky-200 hover:bg-slate-700"
                }`}
                onClick={() => setTab(tabItem.id)}
              >
                {tabItem.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="pt-6">
          {tab === "info" ? (
            <div className="space-y-6">
              <div>
                <p className="text-sm font-medium text-sky-200/80">
                  Pool temperature
                </p>
                <p className="text-4xl font-bold text-white md:text-5xl">
                  {poolTempFahrenheit === undefined
                    ? "—"
                    : `${poolTempFahrenheit}°`}
                  <span className="ml-2 text-2xl font-normal text-sky-300">
                    Pool Temp
                  </span>
                </p>
              </div>

              {tempQuery.isError ? (
                <ErrorMessage
                  {...parseApiError(tempQuery.error)}
                  onRetry={() => void tempQuery.refetch()}
                />
              ) : tempQuery.isPending ? (
                <p className="text-sky-200/80">Loading chart…</p>
              ) : (
                <TempChart rows={tempQuery.data ?? []} />
              )}

              <MetricTiles
                poolTempFahrenheit={poolTempFahrenheit}
                pressurePsi={pressurePsi}
                flowGpm={flowGpm}
              />

              <div className="rounded-xl border border-dashed border-white/20 bg-slate-900/40 p-4">
                <p className="text-sm font-medium text-sky-200">
                  Cleaning / runtime
                </p>
                <p className="mt-2 text-sm text-sky-300/90">
                  Live completion percentage is not provided by the API. See the
                  Servicing tab for scheduled pump windows.
                </p>
              </div>
            </div>
          ) : null}

          {tab === "servicing" ? (
            <ServicingTab
              cycles={pumpCycles}
              isLoading={pumpQuery.isPending}
              isError={pumpQuery.isError}
              onRetry={() => void pumpQuery.refetch()}
            />
          ) : null}

          {tab === "notes" ? (
            <EmptyState
              title="Notes"
              description="No notes endpoint is available in the AquaSmart API (read-only prototype)."
            />
          ) : null}

          {tab === "messages" ? (
            <EmptyState
              title="Messages"
              description="No messages endpoint is available in the AquaSmart API (read-only prototype)."
            />
          ) : null}
        </div>

        <div className="mt-8 border-t border-white/10 pt-4">
          <Link
            to="/"
            className="text-sm font-medium text-sky-300 hover:text-white hover:underline"
          >
            ← Back to customer list
          </Link>
        </div>
      </section>
    </div>
  );
};
