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
  {
    day: "Mon",
    hours: 2.5,
  },
  {
    day: "Tue",
    hours: 4,
  },
  {
    day: "Wed",
    hours: 3.2,
  },
  {
    day: "Thu",
    hours: 5.8,
  },
  {
    day: "Fri",
    hours: 6.5,
  },
  {
    day: "Sat",
    hours: 4.1,
  },
  {
    day: "Sun",
    hours: 7.4,
  },
];

export default function AnalyticsChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={data}
        margin={{
          top: 10,
          right: 10,
          left: -20,
          bottom: 0,
        }}
      >
        <defs>
          <linearGradient
            id="studyGradient"
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop
              offset="0%"
              stopColor="#8b5cf6"
              stopOpacity={0.7}
            />

            <stop
              offset="100%"
              stopColor="#3b82f6"
              stopOpacity={0}
            />
          </linearGradient>
        </defs>

        <CartesianGrid
          strokeDasharray="3 3"
          stroke="rgba(255,255,255,0.05)"
          vertical={false}
        />

        <XAxis
          dataKey="day"
          tick={{
            fill: "#94a3b8",
            fontSize: 12,
          }}
          axisLine={false}
          tickLine={false}
        />

        <YAxis
          tick={{
            fill: "#94a3b8",
            fontSize: 12,
          }}
          axisLine={false}
          tickLine={false}
        />

        <Tooltip
          contentStyle={{
            background: "#09090b",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "16px",
            color: "white",
          }}
        />

        <Area
          type="monotone"
          dataKey="hours"
          stroke="#8b5cf6"
          strokeWidth={4}
          fill="url(#studyGradient)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
