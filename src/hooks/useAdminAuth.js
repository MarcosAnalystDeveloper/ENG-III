import { useCallback, useState } from 'react';
import { storageService } from '../services/storageService';
import { STORAGE_KEYS, ADMIN_CREDENTIALS } from '../utils/constants';

/**
 * useAdminAuth
 * --------------
 * Autenticação propositalmente simples (sessão booleana no localStorage).
 * O enunciado pede gestão de dados locais, não um sistema de auth real
 * com hashing/backend — isso fica fora do escopo do MVP (Aula 06).
 */
export function useAdminAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => storageService.read(STORAGE_KEYS.ADMIN_SESSION, false) === true
  );

  const login = useCallback((username, password) => {
    const ok =
      username.trim() === ADMIN_CREDENTIALS.username &&
      password === ADMIN_CREDENTIALS.password;

    if (ok) {
      storageService.write(STORAGE_KEYS.ADMIN_SESSION, true);
      setIsAuthenticated(true);
    }
    return ok;
  }, []);

  const logout = useCallback(() => {
    storageService.remove(STORAGE_KEYS.ADMIN_SESSION);
    setIsAuthenticated(false);
  }, []);

  return { isAuthenticated, login, logout };
}
