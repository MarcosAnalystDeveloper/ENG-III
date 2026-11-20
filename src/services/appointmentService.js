import { storageService } from './storageService';
import { STORAGE_KEYS, APPOINTMENT_STATUS, SERVICES, BARBERS } from '../utils/constants';
import { hasConflict } from './availabilityService';

/**
 * appointmentService
 * ---------------------
 * "Fachada" de domínio para agendamentos — o equivalente, nesta simulação
 * sem backend, à API REST desenhada na Aula 09 (Frontend → API → Banco).
 * Componentes e hooks nunca tocam o storageService diretamente; sempre
 * passam por aqui. Isso mantém a regra de negócio (ex.: não permitir
 * choque de horário) num único lugar, testável isoladamente.
 */

function generateId() {
  return `appt_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function getAll() {
  return storageService.read(STORAGE_KEYS.APPOINTMENTS, []);
}

function saveAll(appointments) {
  storageService.write(STORAGE_KEYS.APPOINTMENTS, appointments);
}

function getById(id) {
  return getAll().find((a) => a.id === id) || null;
}

/**
 * Cria um novo agendamento.
 * Retorna { success, appointment? , error? } — nunca lança exceção,
 * para a camada de UI decidir como mostrar o erro.
 */
function create(draft) {
  const service = SERVICES.find((s) => s.id === draft.serviceId);
  const barber = BARBERS.find((b) => b.id === draft.barberId);

  if (!service || !barber) {
    return { success: false, error: 'Serviço ou profissional inválido.' };
  }

  const existing = getAll();
  const conflict = hasConflict({
    barberId: draft.barberId,
    date: draft.date,
    time: draft.time,
    durationMin: service.durationMin,
    existingAppointments: existing,
  });

  if (conflict) {
    return {
      success: false,
      error: 'Esse horário acabou de ser reservado por outra pessoa. Escolha outro.',
    };
  }

  const appointment = {
    id: generateId(),
    serviceId: service.id,
    serviceName: service.name,
    price: service.price,
    durationMin: service.durationMin,
    barberId: barber.id,
    barberName: barber.name,
    date: draft.date,
    time: draft.time,
    clientName: draft.clientName.trim(),
    clientPhone: draft.clientPhone.trim(),
    notes: (draft.notes || '').trim(),
    status: APPOINTMENT_STATUS.CONFIRMED,
    createdAt: new Date().toISOString(),
  };

  saveAll([...existing, appointment]);
  return { success: true, appointment };
}

function updateStatus(id, status) {
  const all = getAll();
  const found = all.some((a) => a.id === id);
  if (!found) return { success: false, error: 'Agendamento não encontrado.' };

  const updated = all.map((a) => (a.id === id ? { ...a, status } : a));
  saveAll(updated);
  return { success: true };
}

function remove(id) {
  const all = getAll();
  saveAll(all.filter((a) => a.id !== id));
  return { success: true };
}

/** Semeia alguns agendamentos de exemplo na primeira execução, pra o dashboard não nascer vazio. */
function seedIfEmpty() {
  const existing = getAll();
  if (existing.length > 0) return;

  const today = new Date();
  const iso = (d) => {
    const dt = new Date(today);
    dt.setDate(today.getDate() + d);
    const y = dt.getFullYear();
    const m = String(dt.getMonth() + 1).padStart(2, '0');
    const day = String(dt.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  const seed = [
    {
      id: generateId(),
      serviceId: 'combo',
      serviceName: 'Corte + Barba',
      price: 65,
      durationMin: 50,
      barberId: 'carlos',
      barberName: 'Carlos Mendes',
      date: iso(0),
      time: '10:00',
      clientName: 'João Pereira',
      clientPhone: '(11) 91234-5678',
      notes: '',
      status: APPOINTMENT_STATUS.CONFIRMED,
      createdAt: new Date().toISOString(),
    },
    {
      id: generateId(),
      serviceId: 'corte',
      serviceName: 'Corte de Cabelo',
      price: 45,
      durationMin: 30,
      barberId: 'rafael',
      barberName: 'Rafael Souza',
      date: iso(0),
      time: '14:30',
      clientName: 'Marcos Silva',
      clientPhone: '(11) 99876-5432',
      notes: 'Prefere degradê baixo',
      status: APPOINTMENT_STATUS.PENDING,
      createdAt: new Date().toISOString(),
    },
    {
      id: generateId(),
      serviceId: 'barba',
      serviceName: 'Barba',
      price: 30,
      durationMin: 20,
      barberId: 'carlos',
      barberName: 'Carlos Mendes',
      date: iso(-1),
      time: '11:00',
      clientName: 'Eduardo Alves',
      clientPhone: '(11) 93333-2222',
      notes: '',
      status: APPOINTMENT_STATUS.COMPLETED,
      createdAt: new Date().toISOString(),
    },
    {
      id: generateId(),
      serviceId: 'infantil',
      serviceName: 'Corte Infantil',
      price: 35,
      durationMin: 25,
      barberId: 'bruno',
      barberName: 'Bruno Lima',
      date: iso(2),
      time: '09:30',
      clientName: 'Família Costa (filho)',
      clientPhone: '(11) 95555-4444',
      notes: '',
      status: APPOINTMENT_STATUS.CONFIRMED,
      createdAt: new Date().toISOString(),
    },
  ];

  saveAll(seed);
}

export const appointmentService = {
  getAll,
  getById,
  create,
  updateStatus,
  remove,
  seedIfEmpty,
};
