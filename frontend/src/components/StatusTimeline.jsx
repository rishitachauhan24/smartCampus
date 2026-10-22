/**
 * StatusTimeline — shows 4 steps with current step highlighted
 * Pending → Assigned → In Progress → Resolved
 */
const STEPS = [
  { key: "Pending",     label: "Pending",     icon: "⏳", color: "#f59e0b" },
  { key: "Assigned",    label: "Assigned",    icon: "👤", color: "#3b82f6" },
  { key: "In Progress", label: "In Progress", icon: "🔧", color: "#8b5cf6" },
  { key: "Resolved",    label: "Resolved",    icon: "✅", color: "#10b981" },
];

const ORDER = { Pending: 0, Assigned: 1, "In Progress": 2, Resolved: 3 };

function StatusTimeline({ currentStatus }) {
  const currentIdx = ORDER[currentStatus] ?? 0;

  return (
    <div className="status-timeline">
      {STEPS.map((step, idx) => {
        const isDone    = idx < currentIdx;
        const isCurrent = idx === currentIdx;
        const isFuture  = idx > currentIdx;

        return (
          <div
            className={`timeline-step ${isDone ? "done" : ""} ${isCurrent ? "current" : ""} ${isFuture ? "future" : ""}`}
            key={step.key}
          >
            {/* Connector line (before first step hidden) */}
            {idx > 0 && (
              <div className={`timeline-line ${isDone || isCurrent ? "filled" : ""}`} />
            )}

            {/* Dot */}
            <div
              className="timeline-dot"
              style={
                isCurrent
                  ? { background: step.color, borderColor: step.color }
                  : isDone
                  ? { background: "#10b981", borderColor: "#10b981" }
                  : {}
              }
            >
              {isDone ? "✓" : isCurrent ? step.icon : ""}
            </div>

            {/* Label */}
            <span
              className="timeline-label"
              style={isCurrent ? { color: step.color, fontWeight: 700 } : {}}
            >
              {step.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default StatusTimeline;
