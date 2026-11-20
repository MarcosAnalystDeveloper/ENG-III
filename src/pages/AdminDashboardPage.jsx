import { useMemo, useState } from 'react';
import { Navigate } from 'react-router-dom';
import StatsCards from '../components/admin/StatsCards';
import AppointmentFilters from '../components/admin/AppointmentFilters';
import AppointmentTable from '../components/admin/AppointmentTable';
import AppointmentDetailsModal from '../components/admin/AppointmentDetailsModal';
import Button from '../components/common/Button';
import { useAppointments } from '../context/AppointmentContext';
import { useAdminAuth } from '../hooks/useAdminAuth';
import './AdminDashboardPage.css';

const EMPTY_FILTERS = { date: '', barberId: '', status: '', search: '' };

export default function AdminDashboardPage() {
  const { isAuthenticated, logout } = useAdminAuth();
  const { appointments, loading } = useAppointments();

  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [selected, setSelected] = useState(null);

  const filtered = useMemo(() => {
    return appointments.filter((a) => {
      if (filters.date && a.date !== filters.date) return false;
      if (filters.barberId && a.barberId !== filters.barberId) return false;
      if (filters.status && a.status !== filters.status) return false;
      if (filters.search) {
        const q = filters.search.toLowerCase();
        const haystack = `${a.clientName} ${a.clientPhone}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [appointments, filters]);

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="container admin-dashboard">
      <div className="admin-dashboard__header">
        <div>
          <span className="eyebrow">Painel administrativo</span>
          <h1>Agendamentos</h1>
        </div>
        <Button variant="ghost" onClick={logout}>Sair</Button>
      </div>

      {loading ? (
        <p className="admin-dashboard__loading">Carregando agendamentos...</p>
      ) : (
        <>
          <StatsCards appointments={appointments} />
          <AppointmentFilters filters={filters} onChange={setFilters} />
          <AppointmentTable appointments={filtered} onRowClick={setSelected} />
        </>
      )}

      <AppointmentDetailsModal appointment={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
