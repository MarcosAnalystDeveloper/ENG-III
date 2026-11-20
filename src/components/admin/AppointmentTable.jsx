import StatusBadge from '../common/StatusBadge';
import EmptyState from '../common/EmptyState';
import { formatShortDate } from '../../utils/dateUtils';
import './AppointmentTable.css';

export default function AppointmentTable({ appointments, onRowClick }) {
  if (appointments.length === 0) {
    return (
      <EmptyState
        icon="🔍"
        title="Nenhum agendamento encontrado"
        description="Ajuste os filtros acima ou aguarde novos agendamentos chegarem."
      />
    );
  }

  // Ordena por data + horário, mais próximos primeiro.
  const sorted = [...appointments].sort((a, b) => {
    const keyA = `${a.date}T${a.time}`;
    const keyB = `${b.date}T${b.time}`;
    return keyA.localeCompare(keyB);
  });

  return (
    <div className="table-wrap">
      <table className="appt-table">
        <thead>
          <tr>
            <th>Cliente</th>
            <th>Serviço</th>
            <th>Profissional</th>
            <th>Data</th>
            <th>Horário</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((appt) => (
            <tr key={appt.id} onClick={() => onRowClick(appt)}>
              <td>
                <div className="cell-client">
                  <span className="cell-client__name">{appt.clientName}</span>
                  <span className="cell-client__phone">{appt.clientPhone}</span>
                </div>
              </td>
              <td>{appt.serviceName}</td>
              <td>{appt.barberName}</td>
              <td className="cell-nowrap">{formatShortDate(appt.date)}</td>
              <td className="cell-nowrap">{appt.time}</td>
              <td><StatusBadge status={appt.status} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
