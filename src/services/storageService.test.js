import { describe, it, expect, beforeEach, vi } from 'vitest';
import { storageService } from './storageService';

describe('storageService', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('read devolve o valor padrão quando a chave não existe', () => {
    expect(storageService.read('nada', [])).toEqual([]);
  });

  it('write grava e read recupera objetos', () => {
    expect(storageService.write('k', { a: 1 })).toBe(true);
    expect(storageService.read('k', null)).toEqual({ a: 1 });
  });

  it('read devolve o padrão (sem lançar erro) quando o JSON está corrompido', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    localStorage.setItem('k', '{quebrado');
    expect(storageService.read('k', 'padrao')).toBe('padrao');
  });

  it('remove apaga a chave', () => {
    storageService.write('k', 1);
    storageService.remove('k');
    expect(storageService.read('k', 'vazio')).toBe('vazio');
  });

  it('write retorna false quando o armazenamento falha', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('quota excedida');
    });
    expect(storageService.write('k', 1)).toBe(false);
  });
});
