# RAGBIA PIXEL — REGISTRO M001.7 / PERSEGUIÇÃO V0 DURANTE ENGAGE

**Base:** M001.6 — Dash/Esquiva V0 aprovado  
**Status:** pronto para validação  
**Escopo:** perseguição ofensiva mínima durante Engage

---

## 1. Objetivo

Adicionar o menor comportamento funcional de perseguição necessário para conectar Soft Target + Engage + Attack Range.

A regra implementada é:

> Enquanto Engage estiver segurado, um alvo válido fora do alcance de ataque é perseguido automaticamente até entrar no `attackRange`.

Ao entrar no alcance, a perseguição cessa e o auto-ataque contínuo já aprovado passa a operar normalmente.

---

## 2. Regras implementadas

- `Espaço/RT` continua sendo Engage.
- Se não houver alvo, Engage tenta adquirir um Soft Target pela regra `Tab/RB`.
- Com alvo válido fora do `attackRange`, Chase V0 é ativado.
- O personagem caminha diretamente em direção ao alvo.
- Ao entrar no `attackRange`, Chase V0 é desligado e o ataque pode iniciar.
- Soltar Engage interrompe a perseguição imediatamente.
- Soltar Engage **não limpa o Soft Target**.
- Morte/invalidação explícita do alvo encerra a perseguição.
- Dash suspende a perseguição durante sua duração e ela pode retomar ao terminar, se Engage continuar segurado.

---

## 3. Perfil provisório

Guerreiro e Arqueiro usam neste laboratório:

- velocidade de perseguição: **300 px/s**;
- margem interna ao alcance: **8 px**.

A margem evita ficar oscilando exatamente na borda matemática do `attackRange`.

Esses valores não são balanceamento final.

---

## 4. Colisão e navegação

A perseguição reutiliza a camada de colisão já aprovada.

O personagem não atravessa cenário nem inimigos sólidos durante Chase.

Não há pathfinding. O sistema apenas recalcula a direção direta ao alvo a cada frame e usa a resolução de colisão existente. Obstáculos complexos podem bloquear a perseguição.

Esse comportamento é intencional para o V0.

---

## 5. Relação com Targeting

A Perseguição V0 não altera as regras aprovadas de aquisição:

- `Tab/RB`: 2 alvos válidos mais próximos dentro do FOV;
- `Shift+Tab/LB+RB`: todos os inimigos válidos dentro do campo de visão;
- alvo selecionado persiste enquanto continuar válido;
- facing lock continua apontando para o alvo.

A perseguição pode continuar com um alvo selecionado que posteriormente saia do FOV, porque persistência do Soft Target e aquisição são conceitos separados no baseline atual.

---

## 6. HUD de laboratório

O HUD agora informa:

- `CHASE ON`;
- `CHASE OFF`;
- `CHASE BLOQUEADO`.

---

## 7. Fora do escopo

Não implementar neste marco:

- pathfinding;
- line-of-sight;
- IA/movimento inimigo;
- auto troca de alvo após morte;
- velocidades diferentes por classe;
- navegação inteligente ao redor de obstáculos.

---

## 8. Critério de aprovação

O M001.7 pode ser fechado se:

1. Engage persegue alvo fora do attackRange;
2. para ao alcançar o range;
3. inicia auto-ataque normalmente;
4. soltar Engage interrompe chase sem limpar alvo;
5. Dash suspende e depois permite retomar chase;
6. colisões continuam respeitadas.
