import { describe, it, expect, beforeEach } from 'vitest';
import { appointmentService } from './appointmentService';

// 2026-11-23 = segunda-feira
const rascunho = {
  serviceId: 'corte',
  barberId: 'carlos',
  date: '2026-11-23',
  time: '10:00',
  clientName: '  João Pereira  ',
  clientPhone: ' (11) 91234-5678 ',
  notes: '  prefere degradê  ',
};

describe('appointmentService', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('create — confirmar agendamento (US-010)', () => {
    it('cria o agendamento confirmado, com dados do serviço e barbeiro', () => {
      const r = appointmentService.create(rascunho);
      expect(r.success).toBe(true);
      expect(r.appointment).toMatchObject({
        serviceName: 'Corte de Cabelo',
        durationMin: 30,
        price: 45,
        barberName: 'Carlos Mendes',
        status: 'confirmed',
      });
      expect(r.appointment.id).toMatch(/^appt_/);
    });

    it('remove espaços extras de nome, telefone e observações', () => {
      const { appointment } = appointmentService.create(rascunho);
      expect(appointment.clientName).toBe('João Pereira');
      expect(appointment.clientPhone).toBe('(11) 91234-5678');
      expect(appointment.notes).toBe('prefere degradê');
    });

    it('persiste o agendamento', () => {
      appointmentService.create(rascunho);
      expect(appointmentService.getAll()).toHaveLength(1);
    });

    it('recusa serviço ou profissional inexistente', () => {
      const r1 = appointmentService.create({ ...rascunho, serviceId: 'x' });
      const r2 = appointmentService.create({ ...rascunho, barberId: 'x' });
      expect(r1.success).toBe(false);
      expect(r2.success).toBe(false);
      expect(appointmentService.getAll()).toHaveLength(0);
    });
  });

  describe('create — choque de horários (US-008)', () => {
    it('bloqueia um segundo agendamento no mesmo horário e mesmo barbeiro', () => {
      appointmentService.create(rascunho);
      const r = appointmentService.create({ ...rascunho, clientName: 'Outro Cliente' });
      expect(r.success).toBe(false);
      expect(r.error).toMatch(/reservado/i);
      expect(appointmentService.getAll()).toHaveLength(1);
    });

    it('bloqueia horário que invade o fim de outro agendamento', () => {
      appointmentService.create(rascunho); // 10:00–10:30
      const r = appointmentService.create({ ...rascunho, time: '10:15' });
      expect(r.success).toBe(false);
    });

    it('permite horário colado (começa quando o outro termina)', () => {
      appointmentService.create(rascunho);
      const r = appointmentService.create({ ...rascunho, time: '10:30' });
      expect(r.success).toBe(true);
    });

    it('permite o mesmo horário com outro barbeiro', () => {
      appointmentService.create(rascunho);
      const r = appointmentService.create({ ...rascunho, barberId: 'bruno' });
      expect(r.success).toBe(true);
    });

    it('libera o horário depois que o agendamento é cancelado', () => {
      const { appointment } = appointmentService.create(rascunho);
      appointmentService.updateStatus(appointment.id, 'cancelled');
      const r = appointmentService.create({ ...rascunho, clientName: 'Novo Cliente' });
      expect(r.success).toBe(true);
    });
  });

  describe('updateStatus / getById / remove', () => {
    it('atualiza o status de um agendamento existente', () => {
      const { appointment } = appointmentService.create(rascunho);
      expect(appointmentService.updateStatus(appointment.id, 'completed').success).toBe(true);
      expect(appointmentService.getById(appointment.id).status).toBe('completed');
    });

    it('updateStatus falha para id inexistente', () => {
      const r = appointmentService.updateStatus('nao-existe', 'completed');
      expect(r.success).toBe(false);
    });

    it('getById devolve null quando não encontra', () => {
      expect(appointmentService.getById('nao-existe')).toBeNull();
    });

    it('remove apaga só o agendamento indicado', () => {
      const a = appointmentService.create(rascunho).appointment;
      const b = appointmentService.create({ ...rascunho, time: '14:00' }).appointment;
      appointmentService.remove(a.id);
      const restantes = appointmentService.getAll();
      expect(restantes).toHaveLength(1);
      expect(restantes[0].id).toBe(b.id);
    });
  });

  describe('seedIfEmpty', () => {
    it('semeia exemplos quando não há nada', () => {
      appointmentService.seedIfEmpty();
      expect(appointmentService.getAll().length).toBeGreaterThan(0);
    });

    it('não sobrescreve dados existentes', () => {
      appointmentService.create(rascunho);
      appointmentService.seedIfEmpty();
      expect(appointmentService.getAll()).toHaveLength(1);
    });
  });
});
