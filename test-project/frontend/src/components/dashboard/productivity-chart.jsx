import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const data = [
  { day: "Mon", focus: 2, tasks: 3 },
  { day: "Tue", focus: 4, tasks: 5 },
  { day: "Wed", focus: 3, tasks: 4 },
  { day: "Thu", focus: 6, tasks: 7 },
  { day: "Fri", focus: 7, tasks: 6 },
  { day: "Sat", focus: 4, tasks: 5 },
  { day: "Sun", focus: 9, tasks: 8 },
];

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="
      rounded-[14px] border border-white/[0.09]
      bg-[#0c1028]/98 backdrop-blur-2xl
      px-4 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.5)]
    "
    >
      <p className="text-[11px] uppercase tracking-widest text-zinc-500 mb-2">
        {label}
      </p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2 mb-1 last:mb-0">
          <div
            className="h-[7px] w-[7px] rounded-full"
            style={{ background: p.color }}
          />
          <span className="text-[12px] text-zinc-300 capitalize">{p.name}</span>
          <span className="ml-auto pl-4 text-[13px] font-bold text-white">
            {p.value}h
          </span>
        </div>
      ))}
    </div>
  );
}

export default function ProductivityChart() {
  return (
    <div className="h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 6, right: 6, left: -18, bottom: 0 }}
        >
          <defs>
            <linearGradient id="gradFocus" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gradTasks" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.25} />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(255,255,255,0.04)"
            vertical={false}
          />

          <XAxis
            dataKey="day"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#52525b", fontSize: 11, fontWeight: 500 }}
            dy={8}
          />

          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#3f3f46", fontSize: 10 }}
            tickFormatter={(v) => `${v}h`}
          />

          <Tooltip
            content={<CustomTooltip />}
            cursor={{ stroke: "rgba(255,255,255,0.06)", strokeWidth: 1 }}
          />

          {/* Tasks area — render first so focus sits on top */}
          <Area
            type="monotone"
            dataKey="tasks"
            stroke="#06b6d4"
            strokeWidth={1.5}
            fill="url(#gradTasks)"
            dot={false}
            activeDot={{ r: 4, fill: "#06b6d4", strokeWidth: 0 }}
          />

          <Area
            type="monotone"
            dataKey="focus"
            stroke="#8b5cf6"
            strokeWidth={2}
            fill="url(#gradFocus)"
            dot={false}
            activeDot={{
              r: 5,
              fill: "#8b5cf6",
              stroke: "rgba(139,92,246,0.3)",
              strokeWidth: 4,
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
