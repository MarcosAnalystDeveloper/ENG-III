import { SERVICES, BARBERS } from '../../utils/constants';
import { formatDateFull } from '../../utils/dateUtils';
import './BookingSummary.css';

export default function BookingSummary({ draft }) {
  const service = SERVICES.find((s) => s.id === draft.serviceId);
  const barber = BARBERS.find((b) => b.id === draft.barberId);

  return (
    <aside className="booking-summary">
      <h4>Resumo do agendamento</h4>

      <dl>
        <div className="summary-row">
          <dt>Serviço</dt>
          <dd>{service ? service.name : '—'}</dd>
        </div>
        <div className="summary-row">
          <dt>Profissional</dt>
          <dd>{barber ? barber.name : '—'}</dd>
        </div>
        <div className="summary-row">
          <dt>Data</dt>
          <dd>{draft.date ? formatDateFull(draft.date) : '—'}</dd>
        </div>
        <div className="summary-row">
          <dt>Horário</dt>
          <dd>{draft.time || '—'}</dd>
        </div>
        {service && (
          <div className="summary-row summary-row--total">
            <dt>Total</dt>
            <dd>R$ {service.price.toFixed(2).replace('.', ',')}</dd>
          </div>
        )}
      </dl>
    </aside>
  );
}
