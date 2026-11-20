import './EmptyState.css';

export default function EmptyState({ icon = '📭', title, description }) {
  return (
    <div className="empty-state">
      <div className="empty-state__icon">{icon}</div>
      <h4>{title}</h4>
      {description && <p>{description}</p>}
    </div>
  );
}
