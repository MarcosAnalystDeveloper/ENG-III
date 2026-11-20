import { describe, it, expect } from 'vitest';
import {
  toISODate,
  fromISODate,
  isSameDay,
  isPastDay,
  nextDays,
  formatShortDate,
  formatDateFull,
  timeToMinutes,
  minutesToTime,
  rangesOverlap,
} from './dateUtils';

describe('dateUtils — conversão de datas', () => {
  it('toISODate formata com zero à esquerda', () => {
    expect(toISODate(new Date(2026, 0, 5))).toBe('2026-01-05');
  });

  it('fromISODate e toISODate são inversas (sem erro de fuso)', () => {
    expect(toISODate(fromISODate('2026-11-23'))).toBe('2026-11-23');
  });

  it('isSameDay compara só o dia, ignorando a hora', () => {
    expect(isSameDay(new Date(2026, 10, 23, 8, 0), new Date(2026, 10, 23, 22, 30))).toBe(true);
    expect(isSameDay(new Date(2026, 10, 23), new Date(2026, 10, 24))).toBe(false);
  });

  it('isPastDay identifica ontem como passado e hoje como não passado', () => {
    const hoje = new Date();
    const ontem = new Date();
    ontem.setDate(hoje.getDate() - 1);
    expect(isPastDay(toISODate(ontem))).toBe(true);
    expect(isPastDay(toISODate(hoje))).toBe(false);
  });

  it('nextDays retorna N dias consecutivos começando hoje', () => {
    const dias = nextDays(3);
    expect(dias).toHaveLength(3);
    expect(isSameDay(dias[0], new Date())).toBe(true);
    const diff = (dias[1] - dias[0]) / (24 * 60 * 60 * 1000);
    expect(Math.round(diff)).toBe(1);
  });
});

describe('dateUtils — formatação', () => {
  it('formatShortDate usa dia da semana e dd/mm', () => {
    // 23/11/2026 é segunda-feira
    expect(formatShortDate('2026-11-23')).toBe('seg, 23/11');
  });

  it('formatDateFull escreve o dia por extenso', () => {
    expect(formatDateFull('2026-11-23')).toBe('segunda-feira, 23 de nov de 2026');
  });
});

describe('dateUtils — horas e intervalos', () => {
  it('timeToMinutes converte HH:MM em minutos', () => {
    expect(timeToMinutes('00:00')).toBe(0);
    expect(timeToMinutes('09:30')).toBe(570);
    expect(timeToMinutes('18:00')).toBe(1080);
  });

  it('minutesToTime converte minutos em HH:MM com zeros', () => {
    expect(minutesToTime(570)).toBe('09:30');
    expect(minutesToTime(0)).toBe('00:00');
  });

  it('timeToMinutes e minutesToTime são inversas', () => {
    expect(minutesToTime(timeToMinutes('14:05'))).toBe('14:05');
  });

  it('rangesOverlap detecta sobreposição parcial e total', () => {
    expect(rangesOverlap(600, 630, 615, 645)).toBe(true); // parcial
    expect(rangesOverlap(600, 660, 610, 620)).toBe(true); // um dentro do outro
  });

  it('rangesOverlap NÃO considera sobreposição quando um termina onde o outro começa', () => {
    expect(rangesOverlap(600, 630, 630, 660)).toBe(false);
    expect(rangesOverlap(630, 660, 600, 630)).toBe(false);
  });

  it('rangesOverlap retorna false para intervalos distantes', () => {
    expect(rangesOverlap(600, 630, 700, 730)).toBe(false);
  });
});
