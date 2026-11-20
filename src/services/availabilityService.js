import { BARBERS, SLOT_STEP_MIN } from '../utils/constants';
import {
  fromISODate,
  timeToMinutes,
  minutesToTime,
  rangesOverlap,
} from '../utils/dateUtils';

/**
 * availabilityService
 * ----------------------
 * Resolve a pergunta central do fluxo do cliente (Aula 04/05): "quais
 * horários esse barbeiro tem livres, nesse dia, pra esse serviço?".
 *
 * Regra de negócio crítica herdada da Aula 08 (quebra em tasks):
 * "Teste manual: choque de horário não deve ser permitido" — é a função
 * hasConflict() abaixo que garante isso.
 */

/** Gera todos os horários possíveis (grade) dentro da janela de trabalho do barbeiro. */
function generateDaySlots(barber) {
  const slots = [];
  for (
    let minutes = barber.startHour * 60;
    minutes < barber.endHour * 60;
    minutes += SLOT_STEP_MIN
  ) {
    slots.push(minutesToTime(minutes));
  }
  return slots;
}

/** O barbeiro atende neste dia da semana? */
export function barberWorksOn(barberId, isoDate) {
  const barber = BARBERS.find((b) => b.id === barberId);
  if (!barber) return false;
  const weekday = fromISODate(isoDate).getDay();
  return barber.workingDays.includes(weekday);
}

/** Verifica se um novo horário colide com algum agendamento ativo já existente. */
export function hasConflict({ barberId, date, time, durationMin, existingAppointments, ignoreId }) {
  const newStart = timeToMinutes(time);
  const newEnd = newStart + durationMin;

  return existingAppointments.some((appt) => {
    if (appt.id === ignoreId) return false;
    if (appt.barberId !== barberId || appt.date !== date) return false;
    if (appt.status === 'cancelled') return false;

    const apptStart = timeToMinutes(appt.time);
    const apptEnd = apptStart + appt.durationMin;
    return rangesOverlap(newStart, newEnd, apptStart, apptEnd);
  });
}

/**
 * Retorna os horários livres de um barbeiro, num dia, para um serviço
 * de duração `durationMin`, considerando os agendamentos já existentes.
 */
export function getAvailableSlots({ barberId, date, durationMin, existingAppointments }) {
  const barber = BARBERS.find((b) => b.id === barberId);
  if (!barber) return [];
  if (!barberWorksOn(barberId, date)) return [];

  const allSlots = generateDaySlots(barber);
  const closingMinutes = barber.endHour * 60;

  return allSlots.filter((time) => {
    const start = timeToMinutes(time);
    const end = start + durationMin;

    // o serviço precisa terminar antes do fechamento
    if (end > closingMinutes) return false;

    return !hasConflict({
      barberId,
      date,
      time,
      durationMin,
      existingAppointments,
    });
  });
}
