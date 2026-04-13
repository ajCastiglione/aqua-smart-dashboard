import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { CustomerTempData } from '../../../api/types'
import { parseNumericString, sortTempDataChronological } from '../../../utils/telemetry'

type TempChartProps = {
  rows: CustomerTempData[]
}

export const TempChart = ({ rows }: TempChartProps) => {
  const sortedReadings = sortTempDataChronological(rows)
  const chartPoints = sortedReadings.map((reading, pointIndex) => ({
    pointIndex,
    label: `${reading.Date} ${reading.Time}`,
    temp: parseNumericString(reading.Temp_Reading) ?? null,
  }))

  if (chartPoints.length === 0) {
    return <p className="text-sm text-slate-400">No temperature history.</p>
  }

  return (
    <div className="h-56 w-full md:h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartPoints} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} />
          <XAxis dataKey="pointIndex" tick={false} height={8} />
          <YAxis
            domain={['dataMin - 2', 'dataMax + 2']}
            tick={{ fill: '#94a3b8', fontSize: 11 }}
            unit="°"
          />
          <Tooltip
            contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 8 }}
            labelFormatter={(_, tooltipPayload) => {
              const point = tooltipPayload?.[0]?.payload as { label?: string } | undefined
              return point?.label ?? ''
            }}
            formatter={(value) => [`${value == null ? '—' : String(value)}°F`, 'Pool']}
          />
          <Line type="monotone" dataKey="temp" stroke="#38bdf8" strokeWidth={2} dot={false} name="Temp" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
