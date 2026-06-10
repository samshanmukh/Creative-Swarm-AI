"use client";
import { AgentRun } from "@/lib/types";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
const regionColor: Record<string, string> = {
  Global: "bg-lime",
  US: "bg-sky-400",
  EU: "bg-violet-400",
  APAC: "bg-amber-400",
};
export function Observability({ runs }: { runs: AgentRun[] }) {
  const totalTokens = runs.reduce((s, r) => s + r.tokensUsed, 0);
  const avg = Math.round(
    runs.reduce((s, r) => s + r.latencyMs, 0) / Math.max(runs.length, 1),
  );
  const regions = new Set(runs.map((r) => r.region)).size;
  const wallClock = Math.max(
    ...runs.map(
      (run) =>
        new Date(run.startedAt).getTime() +
        run.latencyMs -
        Math.min(...runs.map((item) => new Date(item.startedAt).getTime())),
    ),
  );
  return (
    <section id="observability" className="section-shell">
      <div className="eyebrow">06 / OPERATIONS</div>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2>Swarm observability</h2>
          <p className="section-copy">
            Every creative decision, traced across the edge.
          </p>
        </div>
        <span className="live-dot">● LIVE TRACE</span>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Metric
          label="Agents completed"
          value={`${runs.length}/9`}
          detail="100% success rate"
        />
        <Metric
          label="Average latency"
          value={`${avg} ms`}
          detail="Parallel execution"
        />
        <Metric
          label="Tokens used"
          value={totalTokens.toLocaleString()}
          detail={`${regions} active regions`}
        />
        <Metric
          label="Wall-clock runtime"
          value={`${wallClock} ms`}
          detail="Fan-out execution"
        />
      </div>
      <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_1.4fr]">
        <div className="card min-h-72">
          <p className="card-label">Latency by agent</p>
          <div className="mt-5 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={runs} layout="vertical" margin={{ left: 18 }}>
                <CartesianGrid stroke="#ffffff0b" horizontal={false} />
                <XAxis type="number" hide />
                <YAxis
                  dataKey="agentName"
                  type="category"
                  width={104}
                  tick={{ fill: "#8890a4", fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    background: "#171a28",
                    border: "1px solid #ffffff18",
                    borderRadius: 12,
                  }}
                />
                <Bar dataKey="latencyMs" fill="#c7ff47" radius={[0, 5, 5, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="card overflow-hidden p-0">
          <div className="border-b border-white/10 px-5 py-4">
            <p className="card-label">Distributed execution trace</p>
          </div>
          <div>
            {runs.map((run, i) => (
              <div
                key={run.agentName}
                className="grid grid-cols-[24px_1fr_auto] items-center gap-3 border-b border-white/[.06] px-5 py-3 last:border-0"
              >
                <span
                  className={`h-2 w-2 rounded-full ${regionColor[run.region]}`}
                />
                <div>
                  <p className="text-sm font-medium text-white">
                    {run.agentName}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    {run.region} · {run.edge} · {run.tokensUsed} tokens
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-mono text-xs text-slate-300">
                    {run.latencyMs}ms
                  </p>
                  <p className="text-[10px] text-lime">COMPLETED</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
function Metric({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="card">
      <p className="card-label">{label}</p>
      <p className="mt-3 text-3xl font-semibold tracking-tight text-white">
        {value}
      </p>
      <p className="mt-2 text-xs text-lime">↗ {detail}</p>
    </div>
  );
}
