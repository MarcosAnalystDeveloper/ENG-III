/**
 * Funções puras de data/hora. Sem estado, sem efeitos colaterais —
 * fáceis de testar isoladamente (Aula 02: testes unitários, Jest).
 */

const WEEKDAY_LABELS = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'];
const MONTH_LABELS = [
  'jan', 'fev', 'mar', 'abr', 'mai', 'jun',
  'jul', 'ago', 'set', 'out', 'nov', 'dez',
];

/** Formata um objeto Date para 'YYYY-MM-DD' (chave estável p/ comparação/armazenamento). */
export function toISODate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** Cria um Date local (sem fuso UTC) a partir de 'YYYY-MM-DD'. */
export function fromISODate(isoDate) {
  const [y, m, d] = isoDate.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function isSameDay(dateA, dateB) {
  return toISODate(dateA) === toISODate(dateB);
}

export function isPastDay(isoDate) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return fromISODate(isoDate) < today;
}

/** Retorna um array de N dias corridos a partir de hoje (inclusive). */
export function nextDays(count) {
  const days = [];
  const base = new Date();
  base.setHours(0, 0, 0, 0);
  for (let i = 0; i < count; i++) {
    const d = new Date(base);
    d.setDate(base.getDate() + i);
    days.push(d);
  }
  return days;
}

export function formatDateLabel(date) {
  const weekday = WEEKDAY_LABELS[date.getDay()];
  const day = date.getDate();
  const month = MONTH_LABELS[date.getMonth()];
  return { weekday, day, month };
}

/** Formato compacto para tabelas, ex.: "seg, 24/11". */
export function formatShortDate(isoDate) {
  const date = fromISODate(isoDate);
  const weekday = WEEKDAY_LABELS[date.getDay()];
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  return `${weekday}, ${dd}/${mm}`;
}

export function formatDateFull(isoDate) {
  const date = fromISODate(isoDate);
  const weekday = [
    'domingo', 'segunda-feira', 'terça-feira', 'quarta-feira',
    'quinta-feira', 'sexta-feira', 'sábado',
  ][date.getDay()];
  const day = date.getDate();
  const month = MONTH_LABELS[date.getMonth()];
  const year = date.getFullYear();
  return `${weekday}, ${day} de ${month} de ${year}`;
}

/** Converte "HH:MM" em minutos desde a meia-noite. */
export function timeToMinutes(hhmm) {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
}

/** Converte minutos desde a meia-noite em "HH:MM". */
export function minutesToTime(totalMinutes) {
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

/** Verifica se dois intervalos [startA, endA) e [startB, endB) (em minutos) se sobrepõem. */
export function rangesOverlap(startA, endA, startB, endB) {
  return startA < endB && startB < endA;
}
