import { toISODate } from '../../utils/dateUtils';
import { APPOINTMENT_STATUS } from '../../utils/constants';
import './StatsCards.css';

export default function StatsCards({ appointments }) {
  const todayISO = toISODate(new Date());

  const todayCount = appointments.filter((a) => a.date === todayISO && a.status !== APPOINTMENT_STATUS.CANCELLED).length;
  const pendingCount = appointments.filter((a) => a.status === APPOINTMENT_STATUS.PENDING).length;
  const completedCount = appointments.filter((a) => a.status === APPOINTMENT_STATUS.COMPLETED).length;
  const revenue = appointments
    .filter((a) => a.status === APPOINTMENT_STATUS.COMPLETED)
    .reduce((sum, a) => sum + (a.price || 0), 0);

  const cards = [
    { label: 'Hoje', value: todayCount, icon: '📅' },
    { label: 'Pendentes', value: pendingCount, icon: '⏳' },
    { label: 'Concluídos', value: completedCount, icon: '✅' },
    { label: 'Faturamento (concluídos)', value: `R$ ${revenue.toFixed(2).replace('.', ',')}`, icon: '💰' },
  ];

  return (
    <div className="stats-grid">
      {cards.map((c) => (
        <div key={c.label} className="stat-card">
          <span className="stat-card__icon">{c.icon}</span>
          <div>
            <div className="stat-card__value">{c.value}</div>
            <div className="stat-card__label">{c.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
