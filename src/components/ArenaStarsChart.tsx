/* eslint-disable @next/next/no-img-element */
"use client";

import {
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface ArenaStarsChartData {
  startedAt: string;
  stars: number | undefined;
}

interface ArenaStarsChartProps {
  data: ArenaStarsChartData[];
}

export default function ArenaStarsChart({ data }: ArenaStarsChartProps) {
  if (!data) return null;
  return (
    <LineChart
      width={948}
      height={500}
      data={data}
      className={`box-border rounded bg-[#2b1812eb]`}
      margin={{ top: 20, right: 40, left: 40, bottom: 40 }}
    >
      <Legend
        align="center"
        verticalAlign="top"
        iconSize={0}
        wrapperStyle={{ paddingBottom: 24 }}
        formatter={() => {
          return (
            <span>
              <span className="text-2xl font-semibold text-white">
                {`Arena Stars`}
              </span>
              <img
                src={`/vstar.png`}
                alt={"vstar"}
                width={16}
                height={16}
                style={{
                  marginLeft: 4,
                  marginBottom: 4,
                  display: "inline-block",
                }}
              />
              <div className="text-sm font-[300] text-white">{`evolution on last ${data.length} battles`}</div>
            </span>
          );
        }}
      />
      <YAxis
        dataKey="stars"
        domain={["dataMin", "dataMax"]}
        tick={{ fill: "white", fontSize: 18 }}
        tickLine={{ stroke: "white" }}
        axisLine={{ stroke: "white" }}
      />
      <XAxis dataKey="startedAt" hide={true} />
      <Tooltip
        wrapperClassName="rounded border-0"
        contentStyle={{ fontWeight: "600" }}
        labelClassName="text-[#2b1812eb] font-[300]"
      />
      <Line
        type="monotoneX"
        dataKey="stars"
        name={`Stars`}
        stroke="#D62382"
        dot={false}
        strokeWidth={3}
      />
      <ReferenceLine
        y={data[data.length - 1]?.stars}
        strokeDasharray="8 6"
        strokeWidth={1}
        stroke="#fff"
      />
    </LineChart>
  );
}
