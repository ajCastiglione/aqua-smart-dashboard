import type { PumpStatusTileDisplay } from "../../../utils/pump-status";

type MetricTilesProps = {
  poolTempFahrenheit?: number;
  pressurePsi?: number;
  flowGpm?: number;
  pumpStatus?: PumpStatusTileDisplay;
};

const pumpLabelClass = (label: PumpStatusTileDisplay["primaryLabel"]) => {
  if (label === "On") return "text-emerald-300";
  if (label === "Off") return "text-sky-100";
  return "text-white";
};

export const MetricTiles = ({
  poolTempFahrenheit,
  pressurePsi,
  flowGpm,
  pumpStatus = { primaryLabel: "—" },
}: MetricTilesProps) => (
  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
    <div className="rounded-lg bg-slate-800/80 px-4 py-3 text-center ring-1 ring-white/10">
      <p className="text-xs font-medium uppercase tracking-wide text-sky-200/80">
        Temperature
      </p>
      <p className="mt-1 text-2xl font-semibold text-white">
        {poolTempFahrenheit === undefined ? "—" : `${poolTempFahrenheit}°`}
      </p>
    </div>
    <div className="rounded-lg bg-slate-800/80 px-4 py-3 text-center ring-1 ring-white/10">
      <p className="text-xs font-medium uppercase tracking-wide text-sky-200/80">
        PSI Pressure
      </p>
      <p className="mt-1 text-2xl font-semibold text-white">
        {pressurePsi === undefined ? "—" : pressurePsi}
      </p>
    </div>
    <div className="rounded-lg bg-slate-800/80 px-4 py-3 text-center ring-1 ring-white/10">
      <p className="text-xs font-medium uppercase tracking-wide text-sky-200/80">
        GPM Flow Rate
      </p>
      <p className="mt-1 text-2xl font-semibold text-white">
        {flowGpm === undefined ? "—" : flowGpm}
      </p>
    </div>
    <div className="rounded-lg bg-slate-800/80 px-4 py-3 text-center ring-1 ring-white/10">
      <p className="text-xs font-medium uppercase tracking-wide text-sky-200/80">
        Pump status
      </p>
      <p
        className={`mt-1 text-2xl font-semibold ${pumpLabelClass(pumpStatus.primaryLabel)}`}
      >
        {pumpStatus.primaryLabel}
      </p>
      {pumpStatus.hint ? (
        <p className="mt-2 text-left text-xs leading-snug text-sky-200/70">
          {pumpStatus.hint}
        </p>
      ) : null}
    </div>
  </div>
);
