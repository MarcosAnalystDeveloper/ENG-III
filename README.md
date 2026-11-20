# 💈 TimeSlot Barber — Sistema de Agendamento para Barbearia

Projeto acadêmico da disciplina **Engenharia de Software III**. Implementa o
cenário do cliente fictício **TimeSlot**, apresentado na Aula 04: uma
barbearia de bairro que hoje agenda por WhatsApp/caderno e quer um sistema
simples de agendamento online.

## Stack

- **React 18** (Function Components + Hooks)
- **React Router 6** (roteamento client-side)
- **JavaScript ES6+**
- **CSS puro**, sem framework de UI — identidade visual própria (preto + dourado)
- **localStorage** como camada de persistência, simulando um backend

## Como rodar

```bash
npm install
npm run dev
```

Abre em `http://localhost:5173`.

- Fluxo do cliente: `/`
- Painel administrativo: `/admin` (login em `/admin/login`)
  - usuário: `admin`
  - senha: `barbearia123`

Na primeira execução, o app semeia 4 agendamentos de exemplo no
`localStorage`, para o painel administrativo não nascer vazio.

## Arquitetura e decisões de projeto

O projeto aplica, de forma deliberada, conceitos trabalhados ao longo da
disciplina — não só como referência teórica, mas como guia de decisão real:

### 1. Arquitetura em camadas (Aula 09 — Setup Técnico)

A Aula 09 define a stack mínima do projeto fio-condutor como
`Frontend → API REST → Banco`, evitando microserviços, filas ou cache
("YAGNI vale com força total num projeto de poucas semanas"). Aqui, sem um
backend real, a mesma ideia foi adaptada em camadas dentro do próprio
frontend:

```
components/pages (UI)
        ↓
   hooks / context (estado)
        ↓
  services/*Service.js (regras de negócio — a "API")
        ↓
  services/storageService.js (localStorage — o "banco")
```

Cada camada só conhece a camada imediatamente abaixo. Um componente nunca
chama `localStorage` diretamente; ele passa por `appointmentService`, que
por sua vez delega a persistência a `storageService`. Se um dia o projeto
ganhar uma API real, só `storageService` (e as chamadas dentro dos
`*Service.js`) precisam mudar — nada na UI.

### 2. Separação de responsabilidades / estrutura de pastas

```
src/
  components/
    common/     → Button, Modal, StatusBadge, Toast, EmptyState (genéricos, sem regra de negócio)
    booking/    → componentes específicos do fluxo de agendamento do cliente
    admin/      → componentes específicos do painel administrativo
    layout/     → Header, Footer
  pages/        → composição de componentes em telas completas + roteamento
  services/     → regra de negócio e persistência ("backend" simulado)
  context/      → estado global (AppointmentContext, ToastContext)
  hooks/        → lógica reutilizável (useAvailableSlots, useAdminAuth)
  utils/        → funções puras e constantes (sem estado, fáceis de testar)
  styles/       → variáveis de design e reset global
```

### 3. Regra de negócio central: evitar choque de horário

A Aula 08 (Sprint Planning) lista explicitamente, como task de teste do
MVP: *"Teste manual: choque de horário não deve ser permitido"*. Essa regra
foi implementada em `services/availabilityService.js`:

- `getAvailableSlots()` gera a grade de horários possíveis de um barbeiro
  num dia e filtra os que colidem com agendamentos já confirmados.
- `hasConflict()` é reaproveitada tanto para montar a grade (cliente) quanto
  para validar no momento de `create()` (evita condição de corrida entre
  duas abas/pessoas agendando ao mesmo tempo).

### 4. MVP e recorte de escopo (Aula 06 — Story Mapping)

A "espinha dorsal" do MVP implementada segue exatamente a jornada descrita
na Aula 06: **descobre o TimeSlot → escolhe horário → confirma agendamento
→ (recebe lembrete) → vai ao atendimento**. O lembrete por SMS/WhatsApp foi
deixado de fora do corte (ficaria "abaixo da linha", como backlog futuro),
pois depende de integração externa — fiel à discussão de Lean Canvas da
Aula 05 sobre o que ainda não estava definido no brief do cliente.

### 5. Qualidade e nomenclatura (Aula 02 e Aula 03)

- Funções de domínio (`dateUtils.js`, `validators.js`, `availabilityService.js`)
  são puras sempre que possível — sem estado, sem efeito colateral — para
  serem testáveis isoladamente com Jest, como no exemplo da Aula 02.
- Nomes e convenções seguem o vocabulário usado nas aulas (User Story,
  DoD, status de agendamento como "pronto"/"não pronto").
- Cada agendamento só é considerado "Concluído" por ação explícita no
  painel — reflete a ideia de Definition of Done da Aula 02: não é "acho
  que terminei", é um critério objetivo e auditável.

### 6. Por que localStorage em vez de um "banco falso" em memória

O enunciado pede explicitamente simulação de backend via `localStorage` ou
estado gerenciado. Optamos por `localStorage` porque:
- Persiste entre reloads (comportamento mais próximo de um sistema real).
- Permite demonstrar a camada de persistência isolada (`storageService`)
  como um artefato de arquitetura por si só, não só um `useState` solto.

## Funcionalidades implementadas

### Fluxo do cliente (`/`)
- Escolha de serviço (com duração e preço)
- Escolha de barbeiro (com especialidade e dias de trabalho)
- Escolha de data (respeitando os dias em que o barbeiro atende) e horário
  (grade dinâmica, sem conflitos)
- Formulário de dados do cliente com validação (nome, telefone com máscara)
- Tela de confirmação com resumo do agendamento

### Painel administrativo (`/admin`)
- Login simples (demo, sem backend de autenticação real)
- Cards de estatísticas (agendamentos hoje, pendentes, concluídos, faturamento)
- Listagem de agendamentos com filtros (data, barbeiro, status, busca por cliente)
- Modal de detalhes com troca de status (Pendente → Confirmado → Concluído /
  Cancelado) e remoção de agendamento

## Possíveis evoluções (fora do escopo deste MVP)

- Lembrete automático (e-mail/SMS/WhatsApp) — depende de integração externa
- Múltiplas unidades/filiais
- Autenticação real de administrador (hash de senha, múltiplos usuários)
- Substituir `storageService` por chamadas HTTP a uma API real, sem alterar
  o resto da aplicação (é exatamente o ponto de extensão que a arquitetura
  em camadas foi desenhada para permitir)
