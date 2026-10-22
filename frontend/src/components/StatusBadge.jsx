/**
 * Color-coded StatusBadge for issue status & priority.
 * Usage: <StatusBadge type="status" value="Pending" />
 *        <StatusBadge type="priority" value="High" />
 */
function StatusBadge({ type = "status", value }) {
  if (!value) return null;

  const slug = value.toLowerCase().replace(/\s+/g, "-");

  return (
    <span className={`${type}-badge ${slug}`}>
      {value}
    </span>
  );
}

export default StatusBadge;
