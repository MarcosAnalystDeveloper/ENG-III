/**
 * Constantes de domínio da barbearia.
 *
 * Mantidas separadas de componentes e serviços para que a "regra de negócio
 * de dados" (o que existe, não o que o app faz com isso) fique num único
 * lugar — mesma ideia de Product Backlog vs. implementação (Aula 02/03).
 */

export const APP_NAME = 'TimeSlot Barber';

// Chaves usadas no localStorage (camada de persistência simulando o backend,
// conforme pedido no enunciado — ver services/storageService.js)
export const STORAGE_KEYS = {
  APPOINTMENTS: 'timeslot:appointments',
  ADMIN_SESSION: 'timeslot:admin-session',
};

export const APPOINTMENT_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

export const STATUS_LABELS = {
  [APPOINTMENT_STATUS.PENDING]: 'Pendente',
  [APPOINTMENT_STATUS.CONFIRMED]: 'Confirmado',
  [APPOINTMENT_STATUS.COMPLETED]: 'Concluído',
  [APPOINTMENT_STATUS.CANCELLED]: 'Cancelado',
};

// Serviços oferecidos pela barbearia (equivalente ao "catálogo" do MVP —
// Lean Canvas / bloco "Solução", Aula 05)
export const SERVICES = [
  { id: 'corte', name: 'Corte de Cabelo', durationMin: 30, price: 45 },
  { id: 'barba', name: 'Barba', durationMin: 20, price: 30 },
  { id: 'combo', name: 'Corte + Barba', durationMin: 50, price: 65 },
  { id: 'sobrancelha', name: 'Sobrancelha (Navalha)', durationMin: 10, price: 15 },
  { id: 'infantil', name: 'Corte Infantil', durationMin: 25, price: 35 },
];

// Barbeiros — cada um com dias e janela de trabalho.
// workingDays: 0 = domingo ... 6 = sábado
export const BARBERS = [
  {
    id: 'carlos',
    name: 'Carlos Mendes',
    specialty: 'Cortes clássicos e navalha',
    workingDays: [1, 2, 3, 4, 5, 6],
    startHour: 9,
    endHour: 18,
  },
  {
    id: 'rafael',
    name: 'Rafael Souza',
    specialty: 'Degradê e barboterapia',
    workingDays: [2, 3, 4, 5, 6],
    startHour: 10,
    endHour: 18,
  },
  {
    id: 'bruno',
    name: 'Bruno Lima',
    specialty: 'Cortes infantis e cuidado capilar',
    workingDays: [1, 2, 3, 4, 5],
    startHour: 8,
    endHour: 18,
  },
];

export const SLOT_STEP_MIN = 30; // granularidade da grade de horários
export const BOOKING_HORIZON_DAYS = 21; // até quantos dias à frente dá pra agendar

// Autenticação simplificada do painel administrativo.
// Deliberadamente simples: o enunciado pede gestão de dados locais /
// simulação de backend, não um sistema de auth real.
export const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'barbearia123',
};
