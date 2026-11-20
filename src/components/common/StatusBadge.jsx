import { APPOINTMENT_STATUS, STATUS_LABELS } from '../../utils/constants';
import './StatusBadge.css';

const STATUS_CLASS = {
  [APPOINTMENT_STATUS.PENDING]: 'status--pending',
  [APPOINTMENT_STATUS.CONFIRMED]: 'status--confirmed',
  [APPOINTMENT_STATUS.COMPLETED]: 'status--completed',
  [APPOINTMENT_STATUS.CANCELLED]: 'status--cancelled',
};

export default function StatusBadge({ status }) {
  return (
    <span className={`status-badge ${STATUS_CLASS[status] || ''}`}>
      {STATUS_LABELS[status] || status}
    </span>
  );
}
