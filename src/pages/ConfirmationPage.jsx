import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import Button from '../components/common/Button';
import { formatDateFull } from '../utils/dateUtils';
import './ConfirmationPage.css';

export default function ConfirmationPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const appointment = state?.appointment;

  // Acesso direto à rota sem um agendamento no state — redireciona.
  if (!appointment) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="container confirmation-page">
      <div className="confirmation-card">
        <div className="confirmation-card__icon">✅</div>
        <h1>Agendamento confirmado!</h1>
        <p className="confirmation-card__subtitle">
          Enviamos os detalhes para o número informado. Chegue com 5 minutos de antecedência.
        </p>

        <dl className="confirmation-card__list">
          <div><dt>Cliente</dt><dd>{appointment.clientName}</dd></div>
          <div><dt>Serviço</dt><dd>{appointment.serviceName}</dd></div>
          <div><dt>Profissional</dt><dd>{appointment.barberName}</dd></div>
          <div><dt>Data</dt><dd>{formatDateFull(appointment.date)}</dd></div>
          <div><dt>Horário</dt><dd>{appointment.time}</dd></div>
          <div><dt>Valor</dt><dd>R$ {appointment.price.toFixed(2).replace('.', ',')}</dd></div>
        </dl>

        <div className="confirmation-card__actions">
          <Button onClick={() => navigate('/')}>Fazer novo agendamento</Button>
        </div>
      </div>
    </div>
  );
}
