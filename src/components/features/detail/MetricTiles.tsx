type MetricTilesProps = {
  poolTempFahrenheit?: number
  pressurePsi?: number
  flowGpm?: number
}

export const MetricTiles = ({
  poolTempFahrenheit,
  pressurePsi,
  flowGpm,
}: MetricTilesProps) => (
  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
    <div className="rounded-lg bg-slate-800/80 px-4 py-3 text-center ring-1 ring-white/10">
      <p className="text-xs font-medium uppercase tracking-wide text-sky-200/80">Temperature</p>
      <p className="mt-1 text-2xl font-semibold text-white">
        {poolTempFahrenheit === undefined ? '—' : `${poolTempFahrenheit}°`}
      </p>
    </div>
    <div className="rounded-lg bg-slate-800/80 px-4 py-3 text-center ring-1 ring-white/10">
      <p className="text-xs font-medium uppercase tracking-wide text-sky-200/80">PSI Pressure</p>
      <p className="mt-1 text-2xl font-semibold text-white">
        {pressurePsi === undefined ? '—' : pressurePsi}
      </p>
    </div>
    <div className="rounded-lg bg-slate-800/80 px-4 py-3 text-center ring-1 ring-white/10">
      <p className="text-xs font-medium uppercase tracking-wide text-sky-200/80">GPM Flow Rate</p>
      <p className="mt-1 text-2xl font-semibold text-white">
        {flowGpm === undefined ? '—' : flowGpm}
      </p>
    </div>
  </div>
)
