"use client";

import * as React from "react";
import { DemoFrame } from "../DemoFrame";
import { ActionButton } from "../ui";
import { Switch } from "@/components/ui/Switch";
import { useMotionSafe } from "@/lib/motion";

const W = 300;
const H = 180;
const N = 40;

/** Deterministic pseudo-random points so the picture is the same for everyone. */
function makePoints() {
  let seed = 7;
  const rnd = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  return Array.from({ length: N }, () => ({ x: 12 + rnd() * (W - 24), y: 12 + rnd() * (H - 24) }));
}

const POINTS = makePoints();
const dist = (a: { x: number; y: number }, b: { x: number; y: number }) => Math.hypot(a.x - b.x, a.y - b.y);

function buildGraph(express: boolean) {
  const links: Array<Set<number>> = POINTS.map(() => new Set<number>());
  POINTS.forEach((p, i) => {
    POINTS.map((q, j) => ({ j, d: dist(p, q) }))
      .filter((o) => o.j !== i)
      .sort((a, b) => a.d - b.d)
      .slice(0, 3)
      .forEach(({ j }) => {
        links[i].add(j);
        links[j].add(i);
      });
  });
  const longLinks: Array<[number, number]> = [];
  if (express) {
    // A few "hub" nodes get long-range links, like the upper layers of HNSW
    for (let i = 0; i < N; i += 5) {
      for (let k = 1; k <= 3; k++) {
        const j = (i + k * 13) % N;
        links[i].add(j);
        links[j].add(i);
        longLinks.push([i, j]);
      }
    }
  }
  return { links, longLinks };
}

const QUERIES = [
  { x: 265, y: 150 },
  { x: 150, y: 90 },
  { x: 40, y: 160 },
  { x: 230, y: 30 },
];
const ENTRY = POINTS.reduce((best, p, i) => (p.x + p.y < POINTS[best].x + POINTS[best].y ? i : best), 0);

function greedySearch(links: Array<Set<number>>, query: { x: number; y: number }) {
  let current = ENTRY;
  const path = [current];
  const visited = new Set<number>([current]);
  for (;;) {
    let best = current;
    for (const n of links[current]) {
      visited.add(n);
      if (dist(POINTS[n], query) < dist(POINTS[best], query)) best = n;
    }
    if (best === current) break;
    current = best;
    path.push(current);
  }
  return { path, visited: visited.size };
}

export default function HnswDemo() {
  const motionSafe = useMotionSafe();
  const [express, setExpress] = React.useState(false);
  const [qi, setQi] = React.useState(0);
  const [shown, setShown] = React.useState(1);
  const graph = React.useMemo(() => buildGraph(express), [express]);
  const query = QUERIES[qi];
  const { path, visited } = React.useMemo(() => greedySearch(graph.links, query), [graph, query]);
  const trueNearest = POINTS.reduce((best, p, i) => (dist(p, query) < dist(POINTS[best], query) ? i : best), 0);
  const found = path.at(-1) === trueNearest;

  React.useEffect(() => {
    setShown(motionSafe ? 1 : path.length);
  }, [path, motionSafe]);

  React.useEffect(() => {
    if (shown >= path.length) return;
    const t = window.setTimeout(() => setShown((s) => s + 1), 280);
    return () => window.clearTimeout(t);
  }, [shown, path.length]);

  const visiblePath = path.slice(0, shown);

  return (
    <DemoFrame title="Hop towards the question" hint="Each hop moves to the neighbour closest to the star." onReset={() => { setExpress(false); setQi(0); }}>
      <div className="flex flex-wrap items-center gap-3">
        <Switch checked={express} onChange={setExpress} label="Express routes (upper layers)" />
        <ActionButton onClick={() => setQi((i) => (i + 1) % QUERIES.length)} variant="secondary">
          New question
        </ActionButton>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="mt-2 w-full rounded-lg bg-surface" role="img" aria-label={`Greedy graph search in ${path.length - 1} hops`}>
        {graph.links.map((set, i) =>
          Array.from(set)
            .filter((j) => j > i)
            .map((j) => {
              const isLong = graph.longLinks.some(([a, b]) => (a === i && b === j) || (a === j && b === i));
              return (
                <line
                  key={`${i}-${j}`}
                  x1={POINTS[i].x}
                  y1={POINTS[i].y}
                  x2={POINTS[j].x}
                  y2={POINTS[j].y}
                  stroke={isLong ? "var(--area-rag)" : "var(--border)"}
                  strokeDasharray={isLong ? "3 3" : undefined}
                  strokeWidth="1"
                />
              );
            }),
        )}
        <polyline points={visiblePath.map((i) => `${POINTS[i].x},${POINTS[i].y}`).join(" ")} fill="none" stroke="var(--accent)" strokeWidth="2.5" />
        {POINTS.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={i === ENTRY ? 5 : 3.5} fill={visiblePath.includes(i) ? "var(--accent)" : "var(--muted)"} />
        ))}
        <circle cx={POINTS[trueNearest].x} cy={POINTS[trueNearest].y} r="8" fill="none" stroke="var(--good)" strokeWidth="1.5" />
        <text x={query.x} y={query.y + 5} textAnchor="middle" fontSize="16" fill="var(--area-llm)">
          ★
        </text>
      </svg>
      <p className="mt-2 text-xs" aria-live="polite">
        {shown >= path.length ? (
          <>
            {path.length - 1} hops, checked {visited} of {N} points.{" "}
            <span style={{ color: found ? "var(--good)" : "var(--warn)" }}>
              {found ? "Found the true nearest point (green ring)." : "Stopped at a good point, but not the very best one (green ring): approximate search."}
            </span>
          </>
        ) : (
          <span className="text-muted">Searching…</span>
        )}
      </p>
    </DemoFrame>
  );
}
