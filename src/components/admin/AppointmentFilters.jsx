import { APPOINTMENT_STATUS, STATUS_LABELS, BARBERS } from '../../utils/constants';
import './AppointmentFilters.css';

export default function AppointmentFilters({ filters, onChange }) {
  const update = (key, value) => onChange({ ...filters, [key]: value });

  return (
    <div className="filters-bar">
      <label className="filter-field">
        <span>Data</span>
        <input
          type="date"
          value={filters.date}
          onChange={(e) => update('date', e.target.value)}
        />
      </label>

      <label className="filter-field">
        <span>Profissional</span>
        <select value={filters.barberId} onChange={(e) => update('barberId', e.target.value)}>
          <option value="">Todos</option>
          {BARBERS.map((b) => (
            <option key={b.id} value={b.id}>{b.name}</option>
          ))}
        </select>
      </label>

      <label className="filter-field">
        <span>Status</span>
        <select value={filters.status} onChange={(e) => update('status', e.target.value)}>
          <option value="">Todos</option>
          {Object.values(APPOINTMENT_STATUS).map((s) => (
            <option key={s} value={s}>{STATUS_LABELS[s]}</option>
          ))}
        </select>
      </label>

      <label className="filter-field filter-field--grow">
        <span>Buscar cliente</span>
        <input
          type="text"
          placeholder="Nome ou telefone..."
          value={filters.search}
          onChange={(e) => update('search', e.target.value)}
        />
      </label>

      <button
        type="button"
        className="filters-clear"
        onClick={() => onChange({ date: '', barberId: '', status: '', search: '' })}
      >
        Limpar filtros
      </button>
    </div>
  );
}
