import { useState } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import StatusBadge from '../common/StatusBadge';
import { APPOINTMENT_STATUS } from '../../utils/constants';
import { formatDateFull } from '../../utils/dateUtils';
import { useAppointments } from '../../context/AppointmentContext';
import { useToast } from '../../context/ToastContext';
import './AppointmentDetailsModal.css';

export default function AppointmentDetailsModal({ appointment, onClose }) {
  const { updateStatus, removeAppointment } = useAppointments();
  const { show } = useToast();
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  if (!appointment) return null;

  const handleStatusChange = (status) => {
    const result = updateStatus(appointment.id, status);
    if (result.success) {
      show('Status atualizado.', 'success');
      onClose();
    } else {
      show(result.error || 'Não foi possível atualizar.', 'error');
    }
  };

  const handleDelete = () => {
    removeAppointment(appointment.id);
    show('Agendamento removido.', 'success');
    onClose();
  };

  return (
    <Modal open={!!appointment} title="Detalhes do agendamento" onClose={onClose}>
      <div className="appt-details">
        <div className="appt-details__row">
          <StatusBadge status={appointment.status} />
        </div>

        <dl className="appt-details__list">
          <div><dt>Cliente</dt><dd>{appointment.clientName}</dd></div>
          <div><dt>Telefone</dt><dd>{appointment.clientPhone}</dd></div>
          <div><dt>Serviço</dt><dd>{appointment.serviceName}</dd></div>
          <div><dt>Profissional</dt><dd>{appointment.barberName}</dd></div>
          <div><dt>Data</dt><dd>{formatDateFull(appointment.date)}</dd></div>
          <div><dt>Horário</dt><dd>{appointment.time} ({appointment.durationMin} min)</dd></div>
          <div><dt>Valor</dt><dd>R$ {appointment.price.toFixed(2).replace('.', ',')}</dd></div>
          {appointment.notes && (
            <div><dt>Observações</dt><dd>{appointment.notes}</dd></div>
          )}
        </dl>

        <div className="appt-details__actions">
          <span className="appt-details__actions-label">Alterar status:</span>
          <div className="appt-details__status-buttons">
            {Object.values(APPOINTMENT_STATUS).map((status) => (
              <button
                key={status}
                type="button"
                className={`status-pill ${appointment.status === status ? 'is-active' : ''}`}
                onClick={() => handleStatusChange(status)}
                disabled={appointment.status === status}
              >
                {status === APPOINTMENT_STATUS.PENDING && 'Pendente'}
                {status === APPOINTMENT_STATUS.CONFIRMED && 'Confirmado'}
                {status === APPOINTMENT_STATUS.COMPLETED && 'Concluído'}
                {status === APPOINTMENT_STATUS.CANCELLED && 'Cancelado'}
              </button>
            ))}
          </div>
        </div>

        <div className="appt-details__danger-zone">
          {!confirmingDelete ? (
            <Button variant="ghost" size="sm" onClick={() => setConfirmingDelete(true)}>
              Remover agendamento
            </Button>
          ) : (
            <div className="appt-details__confirm">
              <span>Remover permanentemente?</span>
              <Button variant="danger" size="sm" onClick={handleDelete}>Sim, remover</Button>
              <Button variant="ghost" size="sm" onClick={() => setConfirmingDelete(false)}>Cancelar</Button>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
