# Definition of Done (DoD) — TimeSlot Barber

Uma história do Jira só vai para **Concluído** quando **todos** os itens abaixo
forem verdadeiros. Os itens marcados com 🤖 são verificados automaticamente
pelo pipeline de CI (`.github/workflows/ci.yml`); os demais dependem de uma
pessoa da squad.

## Código
- [ ] 🤖 `npm run lint` roda sem erros (ESLint)
- [ ] 🤖 `npm run build` gera o build de produção sem erros
- [ ] Sem `console.log` de depuração e sem código comentado
- [ ] Nomes, estrutura de pastas e camadas respeitados (componentes → hooks → services → utils)

## Testes
- [ ] 🤖 `npm test` passa (Vitest)
- [ ] Toda regra de negócio nova ou alterada em `services/` ou `utils/` tem teste unitário
- [ ] Caso de erro (entrada inválida, horário ocupado etc.) também é testado, não só o caminho feliz
- [ ] Fluxo conferido manualmente no navegador (cliente em `/`, dono em `/admin`)

## Revisão
- [ ] Pull Request aberto para a `main`, com a história do Jira citada
- [ ] 🤖 CI verde no Pull Request
- [ ] Pelo menos **1 aprovação de outro integrante** (o autor não aprova o próprio PR)
- [ ] Comentários da revisão respondidos ou resolvidos antes do merge

## Produto
- [ ] Todos os critérios de aceite da história (Dado/Quando/Então) foram atendidos
- [ ] O Product Owner viu o resultado funcionando (demo ou staging)

## Entrega
- [ ] 🤖 Merge na `main` publica automaticamente em staging (`.github/workflows/deploy.yml`)
- [ ] Funcionalidade conferida na URL de staging depois do deploy
- [ ] README ou documentação atualizados, se a mudança afeta como usar ou rodar
- [ ] Item do Jira movido para Concluído, com o link do PR

## Como o CI protege a `main`
Recomenda-se ativar, em *Settings → Branches → Add branch ruleset* (ou *Branch
protection rule*) para `main`:
- exigir Pull Request antes do merge;
- exigir 1 aprovação;
- exigir que o check **Lint, testes e build** passe.
