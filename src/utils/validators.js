/**
 * Validações de formulário — centralizadas para não espalhar regras de
 * "o que é um dado válido" por vários componentes (DRY).
 */

export function isValidName(name) {
  return typeof name === 'string' && name.trim().length >= 3;
}

/** Aceita telefones BR com ou sem máscara: (11) 91234-5678, 11912345678, etc. */
export function isValidPhone(phone) {
  const digits = (phone || '').replace(/\D/g, '');
  return digits.length === 10 || digits.length === 11;
}

export function formatPhoneMask(value) {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 2) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

/**
 * Valida os dados finais de um agendamento antes de persistir.
 * Retorna um objeto { valid, errors } — nunca lança exceção, pra UI
 * decidir como exibir cada erro de campo.
 */
export function validateBookingDraft(draft) {
  const errors = {};

  if (!draft.serviceId) errors.serviceId = 'Selecione um serviço.';
  if (!draft.barberId) errors.barberId = 'Selecione um profissional.';
  if (!draft.date) errors.date = 'Selecione uma data.';
  if (!draft.time) errors.time = 'Selecione um horário.';
  if (!isValidName(draft.clientName)) {
    errors.clientName = 'Informe seu nome completo (mín. 3 caracteres).';
  }
  if (!isValidPhone(draft.clientPhone)) {
    errors.clientPhone = 'Informe um telefone válido com DDD.';
  }

  return { valid: Object.keys(errors).length === 0, errors };
}
