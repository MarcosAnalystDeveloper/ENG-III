import { SERVICES } from '../../utils/constants';
import './ServiceSelector.css';

export default function ServiceSelector({ selectedId, onSelect }) {
  return (
    <div className="service-grid">
      {SERVICES.map((service) => (
        <button
          key={service.id}
          type="button"
          className={`service-card ${selectedId === service.id ? 'is-selected' : ''}`}
          onClick={() => onSelect(service.id)}
        >
          <span className="service-card__name">{service.name}</span>
          <span className="service-card__meta">
            {service.durationMin} min · R$ {service.price.toFixed(2).replace('.', ',')}
          </span>
        </button>
      ))}
    </div>
  );
}
