import { BARBERS } from '../../utils/constants';
import './BarberSelector.css';

function initials(name) {
  return name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase();
}

export default function BarberSelector({ selectedId, onSelect }) {
  return (
    <div className="barber-grid">
      {BARBERS.map((barber) => (
        <button
          key={barber.id}
          type="button"
          className={`barber-card ${selectedId === barber.id ? 'is-selected' : ''}`}
          onClick={() => onSelect(barber.id)}
        >
          <span className="barber-card__avatar">{initials(barber.name)}</span>
          <span className="barber-card__info">
            <span className="barber-card__name">{barber.name}</span>
            <span className="barber-card__specialty">{barber.specialty}</span>
          </span>
        </button>
      ))}
    </div>
  );
}
