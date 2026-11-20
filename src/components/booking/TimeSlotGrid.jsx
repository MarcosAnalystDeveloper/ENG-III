import EmptyState from '../common/EmptyState';
import './TimeSlotGrid.css';

export default function TimeSlotGrid({ slots, selectedTime, onSelect }) {
  if (slots.length === 0) {
    return (
      <EmptyState
        icon="🕑"
        title="Sem horários livres nesse dia"
        description="Tente outra data ou outro profissional."
      />
    );
  }

  return (
    <div className="slot-grid">
      {slots.map((time) => (
        <button
          key={time}
          type="button"
          className={`slot-btn ${selectedTime === time ? 'is-selected' : ''}`}
          onClick={() => onSelect(time)}
        >
          {time}
        </button>
      ))}
    </div>
  );
}
