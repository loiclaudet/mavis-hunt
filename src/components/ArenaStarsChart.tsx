/* eslint-disable @next/next/no-img-element */
"use client";

import useWindowSize from "hooks/windowSize";
import { relativeTime } from "lib/relativeTime";
import type { Battle } from "lib/validators";
import { useMemo } from "react";
import {
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ArenaStarsChartSkeleton } from "./ArenaStarsChartSkeleton";

interface ArenaStarsChartProps {
  userID: string;
  battles: Battle[];
}

export function ArenaStarsChart({ userID, battles }: ArenaStarsChartProps) {
  const windowSize = useWindowSize();
  const chartData = useMemo(
    () =>
      battles
        .map((battle) => {
          const reward = battle.rewards.find(
            (reward) => reward.user_id === userID
          );
          return {
            startedAt: relativeTime(battle.created_at, "long"),
            stars: reward?.new_vstar,
          };
        })
        .reverse(),
    [battles, userID]
  );

  if (
    battles.length === 0 ||
    windowSize.height === undefined ||
    windowSize.width === undefined
  ) {
    return <ArenaStarsChartSkeleton />;
  }

  return (
    <LineChart
      width={windowSize.height < 1000 ? Math.min(windowSize.width, 948) : 948}
      height={
        windowSize.height < 1000 ? Math.min(windowSize.height / 2, 420) : 550
      }
      data={chartData}
      className={`box-border rounded bg-[#2b1812eb]`}
      margin={{ top: 20, right: 40, left: 40, bottom: 40 }}
      style={{
        maxWidth: "100%",
      }}
    >
      <Legend
        align="center"
        verticalAlign="top"
        iconSize={0}
        wrapperStyle={{ paddingBottom: 12 }}
        formatter={() => {
          return (
            <span>
              <span className="font-semibold text-white sm:text-2xl">
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
              <div className="text-sm font-[300] text-white">{`evolution on last ${chartData.length} battles`}</div>
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
        y={chartData[chartData.length - 1]?.stars}
        strokeDasharray="8 6"
        strokeWidth={1}
        stroke="#fff"
      />
    </LineChart>
  );
}
