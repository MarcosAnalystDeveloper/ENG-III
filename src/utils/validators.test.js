import { describe, it, expect } from 'vitest';
import {
  isValidName,
  isValidPhone,
  formatPhoneMask,
  validateBookingDraft,
} from './validators';

describe('validators — nome', () => {
  it('aceita nome com 3 ou mais caracteres', () => {
    expect(isValidName('Ana')).toBe(true);
    expect(isValidName('João Pereira')).toBe(true);
  });

  it('rejeita nome curto, vazio, só espaços ou não-string', () => {
    expect(isValidName('Al')).toBe(false);
    expect(isValidName('')).toBe(false);
    expect(isValidName('    ')).toBe(false);
    expect(isValidName(undefined)).toBe(false);
    expect(isValidName(123)).toBe(false);
  });
});

describe('validators — telefone', () => {
  it('aceita celular (11 dígitos) e fixo (10 dígitos), com ou sem máscara', () => {
    expect(isValidPhone('(11) 91234-5678')).toBe(true);
    expect(isValidPhone('11912345678')).toBe(true);
    expect(isValidPhone('(11) 3123-4567')).toBe(true);
  });

  it('rejeita telefones com poucos ou muitos dígitos e valores vazios', () => {
    expect(isValidPhone('1234')).toBe(false);
    expect(isValidPhone('119123456789')).toBe(false);
    expect(isValidPhone('')).toBe(false);
    expect(isValidPhone(undefined)).toBe(false);
  });

  it('formatPhoneMask aplica a máscara progressivamente', () => {
    expect(formatPhoneMask('1')).toBe('1');
    expect(formatPhoneMask('11912')).toBe('(11) 912');
    expect(formatPhoneMask('1131234567')).toBe('(11) 3123-4567');
    expect(formatPhoneMask('11912345678')).toBe('(11) 91234-5678');
  });

  it('formatPhoneMask ignora letras e corta além de 11 dígitos', () => {
    expect(formatPhoneMask('abc11912345678999')).toBe('(11) 91234-5678');
  });
});

describe('validators — rascunho de agendamento', () => {
  const valido = {
    serviceId: 'corte',
    barberId: 'carlos',
    date: '2026-11-23',
    time: '09:00',
    clientName: 'João Pereira',
    clientPhone: '(11) 91234-5678',
  };

  it('considera válido um rascunho completo', () => {
    expect(validateBookingDraft(valido)).toEqual({ valid: true, errors: {} });
  });

  it('retorna um erro por campo ausente ou inválido', () => {
    const { valid, errors } = validateBookingDraft({
      serviceId: '',
      barberId: '',
      date: '',
      time: '',
      clientName: 'Jo',
      clientPhone: '123',
    });
    expect(valid).toBe(false);
    expect(Object.keys(errors).sort()).toEqual(
      ['barberId', 'clientName', 'clientPhone', 'date', 'serviceId', 'time'],
    );
  });

  it('aponta só o campo com problema', () => {
    const { valid, errors } = validateBookingDraft({ ...valido, clientPhone: '999' });
    expect(valid).toBe(false);
    expect(Object.keys(errors)).toEqual(['clientPhone']);
  });
});
