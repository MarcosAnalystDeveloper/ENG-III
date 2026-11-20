import { useMemo } from 'react';
import { getAvailableSlots } from '../services/availabilityService';
import { SERVICES } from '../utils/constants';
import { useAppointments } from '../context/AppointmentContext';

/**
 * useAvailableSlots
 * -------------------
 * Deriva a grade de horários livres a partir do serviço, barbeiro e data
 * escolhidos, recalculando sempre que os agendamentos existentes mudam
 * (ex.: outro cliente acabou de reservar o mesmo horário).
 */
export function useAvailableSlots({ serviceId, barberId, date }) {
  const { appointments } = useAppointments();

  return useMemo(() => {
    if (!serviceId || !barberId || !date) return [];
    const service = SERVICES.find((s) => s.id === serviceId);
    if (!service) return [];

    return getAvailableSlots({
      barberId,
      date,
      durationMin: service.durationMin,
      existingAppointments: appointments,
    });
  }, [serviceId, barberId, date, appointments]);
}
