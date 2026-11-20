import { describe, it, expect } from 'vitest';
import {
  barberWorksOn,
  hasConflict,
  getAvailableSlots,
} from './availabilityService';

// Datas fixas para os testes não dependerem do dia em que rodam.
// 2026-11-22 = domingo | 2026-11-23 = segunda | 2026-11-24 = terça
const DOMINGO = '2026-11-22';
const SEGUNDA = '2026-11-23';

const agendamentoCarlos = {
  id: 'a1',
  barberId: 'carlos',
  date: SEGUNDA,
  time: '10:00',
  durationMin: 30, // ocupa 10:00–10:30
  status: 'confirmed',
};

describe('barberWorksOn', () => {
  it('Carlos atende de segunda a sábado, mas não aos domingos', () => {
    expect(barberWorksOn('carlos', SEGUNDA)).toBe(true);
    expect(barberWorksOn('carlos', DOMINGO)).toBe(false);
  });

  it('Rafael não atende às segundas', () => {
    expect(barberWorksOn('rafael', SEGUNDA)).toBe(false);
  });

  it('barbeiro inexistente nunca atende', () => {
    expect(barberWorksOn('fantasma', SEGUNDA)).toBe(false);
  });
});

describe('hasConflict — impedir choque de horários (US-008)', () => {
  const base = { barberId: 'carlos', date: SEGUNDA, durationMin: 30 };

  it('detecta choque quando o novo horário é exatamente o mesmo', () => {
    expect(
      hasConflict({ ...base, time: '10:00', existingAppointments: [agendamentoCarlos] }),
    ).toBe(true);
  });

  it('detecta choque quando o novo horário começa no meio de outro', () => {
    expect(
      hasConflict({ ...base, time: '10:15', existingAppointments: [agendamentoCarlos] }),
    ).toBe(true);
  });

  it('detecta choque quando um serviço longo invade o próximo agendamento', () => {
    expect(
      hasConflict({
        ...base,
        time: '09:30',
        durationMin: 50, // 09:30–10:20 invade o das 10:00
        existingAppointments: [agendamentoCarlos],
      }),
    ).toBe(true);
  });

  it('NÃO há choque quando um começa exatamente quando o outro termina', () => {
    expect(
      hasConflict({ ...base, time: '10:30', existingAppointments: [agendamentoCarlos] }),
    ).toBe(false);
    expect(
      hasConflict({ ...base, time: '09:30', existingAppointments: [agendamentoCarlos] }),
    ).toBe(false);
  });

  it('NÃO há choque com barbeiro diferente', () => {
    expect(
      hasConflict({
        ...base,
        barberId: 'bruno',
        time: '10:00',
        existingAppointments: [agendamentoCarlos],
      }),
    ).toBe(false);
  });

  it('NÃO há choque em outro dia', () => {
    expect(
      hasConflict({
        ...base,
        date: '2026-11-24',
        time: '10:00',
        existingAppointments: [agendamentoCarlos],
      }),
    ).toBe(false);
  });

  it('agendamento cancelado libera o horário', () => {
    const cancelado = { ...agendamentoCarlos, status: 'cancelled' };
    expect(
      hasConflict({ ...base, time: '10:00', existingAppointments: [cancelado] }),
    ).toBe(false);
  });

  it('ignoreId permite remarcar sem colidir consigo mesmo', () => {
    expect(
      hasConflict({
        ...base,
        time: '10:00',
        ignoreId: 'a1',
        existingAppointments: [agendamentoCarlos],
      }),
    ).toBe(false);
  });

  it('sem agendamentos existentes nunca há choque', () => {
    expect(hasConflict({ ...base, time: '10:00', existingAppointments: [] })).toBe(false);
  });
});

describe('getAvailableSlots — horários livres (US-009)', () => {
  it('Carlos numa segunda, serviço de 30 min: 18 horários, de 09:00 a 17:30', () => {
    const slots = getAvailableSlots({
      barberId: 'carlos',
      date: SEGUNDA,
      durationMin: 30,
      existingAppointments: [],
    });
    expect(slots).toHaveLength(18);
    expect(slots[0]).toBe('09:00');
    expect(slots[slots.length - 1]).toBe('17:30');
  });

  it('serviço precisa terminar antes do fechamento (50 min: último início às 17:00)', () => {
    const slots = getAvailableSlots({
      barberId: 'carlos',
      date: SEGUNDA,
      durationMin: 50,
      existingAppointments: [],
    });
    expect(slots[slots.length - 1]).toBe('17:00');
    expect(slots).not.toContain('17:30');
  });

  it('remove horários ocupados e os que invadiriam o agendamento existente', () => {
    const slots = getAvailableSlots({
      barberId: 'carlos',
      date: SEGUNDA,
      durationMin: 30,
      existingAppointments: [agendamentoCarlos], // 10:00–10:30
    });
    expect(slots).not.toContain('10:00');
    expect(slots).toContain('09:30');
    expect(slots).toContain('10:30');
  });

  it('serviço longo também perde o horário anterior ao ocupado', () => {
    const slots = getAvailableSlots({
      barberId: 'carlos',
      date: SEGUNDA,
      durationMin: 50,
      existingAppointments: [agendamentoCarlos],
    });
    expect(slots).not.toContain('09:30'); // 09:30–10:20 invadiria as 10:00
    expect(slots).toContain('09:00'); // 09:00–09:50 cabe
  });

  it('retorna lista vazia quando o barbeiro não trabalha no dia', () => {
    expect(
      getAvailableSlots({
        barberId: 'carlos',
        date: DOMINGO,
        durationMin: 30,
        existingAppointments: [],
      }),
    ).toEqual([]);
  });

  it('retorna lista vazia para barbeiro inexistente', () => {
    expect(
      getAvailableSlots({
        barberId: 'fantasma',
        date: SEGUNDA,
        durationMin: 30,
        existingAppointments: [],
      }),
    ).toEqual([]);
  });

  it('horários de agendamento cancelado voltam a ficar livres', () => {
    const slots = getAvailableSlots({
      barberId: 'carlos',
      date: SEGUNDA,
      durationMin: 30,
      existingAppointments: [{ ...agendamentoCarlos, status: 'cancelled' }],
    });
    expect(slots).toContain('10:00');
  });
});
