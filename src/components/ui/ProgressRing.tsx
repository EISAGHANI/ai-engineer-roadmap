import { cn } from "@/lib/utils";

interface ProgressRingProps {
  value: number; // 0..1
  size?: number;
  stroke?: number;
  color?: string;
  label?: string;
  className?: string;
  children?: React.ReactNode;
}

export function ProgressRing({
  value,
  size = 40,
  stroke = 4,
  color = "var(--accent)",
  label,
  className,
  children,
}: ProgressRingProps) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const v = Math.max(0, Math.min(1, value));
  return (
    <div
      className={cn("relative inline-flex items-center justify-center", className)}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(v * 100)}
      aria-label={label}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--border)" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - v)}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: "stroke-dashoffset 400ms var(--ease-out)" }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-[10px] font-mono">
        {children}
      </div>
    </div>
  );
}

export function ProgressBar({
  value,
  color = "var(--accent)",
  className,
  label,
}: {
  value: number;
  color?: string;
  className?: string;
  label?: string;
}) {
  const v = Math.max(0, Math.min(1, value));
  return (
    <div
      className={cn("h-2 w-full overflow-hidden rounded-full bg-surface-2", className)}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(v * 100)}
      aria-label={label}
    >
      <div
        className="h-full rounded-full"
        style={{ width: `${v * 100}%`, backgroundColor: color, transition: "width 400ms var(--ease-out)" }}
      />
    </div>
  );
}
