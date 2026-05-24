import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const tooltipStyle = {
  background: "#0A0E1A",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "12px",
  color: "white",
  boxShadow: "0 16px 32px rgba(0,0,0,0.4)",
  padding: "12px",
  fontSize: "13px",
};

export function FocusAreaChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient
            id="focusGradient"
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
          </linearGradient>
        </defs>

        <CartesianGrid
          strokeDasharray="3 3"
          stroke="rgba(255,255,255,0.05)"
          vertical={false}
        />

        <XAxis
          dataKey="day"
          tick={{ fill: "#94a3b8", fontSize: 12 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} />

        <Tooltip
          cursor={{ stroke: "rgba(139,92,246,0.2)", strokeWidth: 2 }}
          contentStyle={tooltipStyle}
          itemStyle={{ color: "#c4b5fd", fontWeight: 600 }}
        />

        <Area
          type="monotone"
          dataKey="hours"
          stroke="#8b5cf6"
          strokeWidth={4}
          fill="url(#focusGradient)"
          activeDot={{ r: 6, fill: "#c4b5fd", stroke: "#8b5cf6", strokeWidth: 2 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function TaskBarChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{
          top: 10,
          right: 10,
          left: -20,
          bottom: 0,
        }}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="rgba(255,255,255,0.05)"
          vertical={false}
        />
        <XAxis
          dataKey="name"
          tick={{ fill: "#94a3b8", fontSize: 12 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: "#94a3b8", fontSize: 12 }}
          axisLine={false}
          tickLine={false}
          allowDecimals={false}
        />
        <Tooltip
          cursor={{ fill: "rgba(255,255,255,0.03)" }}
          contentStyle={tooltipStyle}
          itemStyle={{ color: "#fff", fontWeight: 600 }}
        />
        <Bar dataKey="count" radius={[6, 6, 0, 0]} maxBarSize={40}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export function SubjectPieChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
        <Tooltip
          contentStyle={tooltipStyle}
          itemStyle={{ color: "#fff", fontWeight: 600 }}
        />
        <Pie
          data={data}
          innerRadius={65}
          outerRadius={90}
          paddingAngle={5}
          dataKey="value"
          stroke="none"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
}

// Keep default export for backwards compatibility
export default FocusAreaChart;
