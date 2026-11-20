import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { appointmentService } from '../services/appointmentService';

/**
 * AppointmentContext
 * ---------------------
 * Fonte única de verdade dos agendamentos em memória, sincronizada com o
 * localStorage via appointmentService. Tanto o fluxo do cliente (criar)
 * quanto o painel admin (listar/alterar/remover) consomem este mesmo
 * estado, então uma ação em um lugar reflete no outro sem recarregar a
 * página.
 */

const AppointmentContext = createContext(null);

export function AppointmentProvider({ children }) {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(() => {
    setAppointments(appointmentService.getAll());
  }, []);

  useEffect(() => {
    appointmentService.seedIfEmpty();
    refresh();
    setLoading(false);
  }, [refresh]);

  const createAppointment = useCallback((draft) => {
    const result = appointmentService.create(draft);
    if (result.success) refresh();
    return result;
  }, [refresh]);

  const updateStatus = useCallback((id, status) => {
    const result = appointmentService.updateStatus(id, status);
    if (result.success) refresh();
    return result;
  }, [refresh]);

  const removeAppointment = useCallback((id) => {
    const result = appointmentService.remove(id);
    if (result.success) refresh();
    return result;
  }, [refresh]);

  const value = {
    appointments,
    loading,
    createAppointment,
    updateStatus,
    removeAppointment,
    refresh,
  };

  return (
    <AppointmentContext.Provider value={value}>
      {children}
    </AppointmentContext.Provider>
  );
}

export function useAppointments() {
  const ctx = useContext(AppointmentContext);
  if (!ctx) throw new Error('useAppointments precisa estar dentro de <AppointmentProvider>');
  return ctx;
}
