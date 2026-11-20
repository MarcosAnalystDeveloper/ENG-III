/**
 * storageService
 * ----------------
 * Única camada que fala diretamente com o localStorage.
 *
 * Por que isolar isso? Se um dia o app ganhar uma API real, só este
 * arquivo muda — components, hooks e pages continuam chamando
 * appointmentService, que não sabe (nem precisa saber) onde os dados
 * vivem. É a mesma ideia de "arquitetura mínima em camadas" da Aula 09
 * (Frontend → API → Banco), só que aqui a "API/Banco" é o browser.
 */

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw);
  } catch (err) {
    console.error(`[storageService] falha ao ler "${key}":`, err);
    return fallback;
  }
}

function write(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (err) {
    console.error(`[storageService] falha ao gravar "${key}":`, err);
    return false;
  }
}

function remove(key) {
  try {
    localStorage.removeItem(key);
  } catch (err) {
    console.error(`[storageService] falha ao remover "${key}":`, err);
  }
}

export const storageService = { read, write, remove };
