"use client";

import { useEffect, useState } from "react";
import { AkamaiInfrastructure } from "@/lib/types";

type Status = "loading" | "connected" | "unavailable";

export function AkamaiInfrastructurePanel({ compact = false }: { compact?: boolean }) {
  const [status, setStatus] = useState<Status>("loading");
  const [infrastructure, setInfrastructure] = useState<AkamaiInfrastructure | null>(null);

  useEffect(() => {
    let active = true;
    fetch("/api/akamai/infrastructure")
      .then(async (response) => {
        if (!response.ok) throw new Error("Akamai Cloud unavailable");
        return (await response.json()) as AkamaiInfrastructure;
      })
      .then((data) => {
        if (!active) return;
        setInfrastructure(data);
        setStatus("connected");
      })
      .catch(() => {
        if (active) setStatus("unavailable");
      });
    return () => { active = false; };
  }, []);

  const instances = infrastructure?.instances ?? [];
  const primary = instances.find((instance) => instance.status === "running");
  const activeRegions = new Set(instances.map((instance) => instance.region)).size;

  return (
    <div
      className={`overflow-hidden rounded-2xl border ${
        status === "connected"
          ? "border-lime/20 bg-lime/[.035]"
          : "border-white/10 bg-panel"
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-5 py-4">
        <div className="flex items-center gap-3">
          <span
            className={`h-2 w-2 rounded-full ${
              status === "connected"
                ? "animate-pulse bg-lime shadow-[0_0_14px_#c7ff47]"
                : status === "loading"
                  ? "animate-pulse bg-amber-400"
                  : "bg-slate-600"
            }`}
          />
          <div>
            <p className="card-label">AKAMAI CLOUD INFRASTRUCTURE</p>
            <p className="mt-1 text-xs text-slate-500">
              {status === "connected"
                ? "Live Linode API connection"
                : status === "loading"
                  ? "Checking live infrastructure..."
                  : "Using resilient mock routing fallback"}
            </p>
          </div>
        </div>
        <span
          className={`rounded-full border px-3 py-1 font-mono text-[9px] ${
            status === "connected"
              ? "border-lime/20 bg-lime/10 text-lime"
              : "border-white/10 bg-panel text-slate-500"
          }`}
        >
          {status === "connected" ? "CONNECTED" : status.toUpperCase()}
        </span>
      </div>

      <div className={`grid ${compact ? "md:grid-cols-2" : "lg:grid-cols-[1fr_1.4fr]"}`}>
        <div className="border-b border-white/10 p-5 lg:border-b-0 lg:border-r">
          <p className="card-label">PRIMARY ORCHESTRATOR</p>
          <p className="mt-4 text-lg font-semibold text-white">
            {primary?.label ?? "Waiting for Akamai Cloud"}
          </p>
          <p className="mt-1 text-sm text-slate-500">
            {primary
              ? `${primary.regionLabel} · ${primary.region}`
              : "Infrastructure metadata will appear here."}
          </p>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <InfrastructureMetric label="Status" value={primary?.status.toUpperCase() ?? "—"} />
            <InfrastructureMetric label="Public IP" value={primary?.ipv4[0] ?? "—"} />
            {!compact && (
              <>
                <InfrastructureMetric label="Instances" value={instances.length.toString()} />
                <InfrastructureMetric label="Live regions" value={activeRegions.toString()} />
              </>
            )}
          </div>
        </div>

        <div className="p-5">
          <div className="flex items-center justify-between">
            <p className="card-label">REGIONAL ROUTING TOPOLOGY</p>
            <span className="text-[9px] text-slate-600">LIVE + FALLBACK</span>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <RouteNode
              region="US"
              location={primary?.regionLabel ?? "US West"}
              status={status === "connected" ? "LIVE" : "MOCK"}
              live={status === "connected"}
            />
            <RouteNode region="EU" location={primary?.regionLabel ?? "US West"} status="FALLBACK" />
            <RouteNode region="APAC" location={primary?.regionLabel ?? "US West"} status="FALLBACK" />
          </div>
          {!compact && (
            <p className="mt-4 text-xs leading-5 text-slate-600">
              Regional campaign intent is preserved while execution falls back
              to the primary Akamai Cloud instance until EU and APAC workers
              are deployed.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function InfrastructureMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-ink px-3 py-3">
      <p className="font-mono text-[8px] tracking-[.15em] text-slate-600">{label}</p>
      <p className="mt-1 truncate text-xs font-medium text-slate-300">{value}</p>
    </div>
  );
}

function RouteNode({
  region,
  location,
  status,
  live = false,
}: {
  region: string;
  location: string;
  status: string;
  live?: boolean;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-ink p-4">
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-semibold text-white">{region}</span>
        <span className={`font-mono text-[8px] ${live ? "text-lime" : "text-amber-400"}`}>
          {status}
        </span>
      </div>
      <p className="mt-5 text-[10px] text-slate-500">{location}</p>
    </div>
  );
}
