# RAGBIA PIXEL — M001.7A / MANUAL OVERRIDE DA PERSEGUIÇÃO

**Status:** pronto para validação prática  
**Base:** M001.7 — Perseguição V0 durante Engage  
**Escopo:** prioridade de movimento durante Engage

---

## 1. Objetivo

Corrigir o comportamento observado no M001.7 em que a perseguição automática assumia completamente o deslocamento enquanto `Espaço/RT` permanecia segurado.

A partir deste marco, a perseguição deve respeitar a intenção manual do jogador.

---

## 2. Hierarquia oficial de movimento

A prioridade passa a ser:

> **Dash > movimento manual > perseguição automática.**

### Dash

Enquanto a esquiva estiver ativa, ela continua sendo a prioridade máxima.

### Movimento manual

Se o jogador fornecer direção por WASD/setas ou analógico/D-pad, essa direção assume o deslocamento imediatamente, mesmo com Engage segurado e chase necessário.

### Perseguição automática

Só assume o deslocamento quando:

- Engage está segurado;
- há Soft Target válido;
- alvo está fora do `attackRange`;
- jogador não está fornecendo direção manual;
- Dash não está ativo.

---

## 3. Retomada automática

O movimento manual não cancela Engage nem remove o Soft Target.

Quando o jogador para de fornecer direção:

- se Engage continuar segurado;
- e o alvo continuar válido e fora do alcance;

então a perseguição reassume automaticamente no frame seguinte.

Não é necessário soltar e apertar novamente `Espaço/RT`.

---

## 4. Facing durante movimento manual

O Soft Target continua dominando a direção visual do personagem fora do Dash.

Isso permite testar naturalmente:

- strafe lateral mantendo o inimigo encarado;
- recuo mantendo o inimigo encarado;
- aproximação manual sem perder o facing lock.

Durante Dash, permanece a regra já aprovada do M001.6: a intenção da esquiva domina temporariamente a direção visual e o facing lock retorna ao terminar.

---

## 5. Obstáculos

Não foi adicionado pathfinding.

O chase continua sendo uma tentativa de movimento direto até o alvo e pode ficar bloqueado por colisões.

Isso continua aceitável neste estágio.

O M001.7A permite ao jogador resolver o bloqueio manualmente:

> **CHASE → bloqueio → movimento manual → contorno → solta direção → CHASE reassume.**

---

## 6. HUD de laboratório

Estados utilizados:

- `CHASE ON` — perseguição automática movendo o personagem;
- `CHASE BLOQUEADO` — tentativa automática impedida por colisão;
- `CHASE MANUAL` — chase seria necessário, mas o movimento manual possui prioridade;
- `CHASE OFF` — perseguição não necessária ou Engage inativo.

---

## 7. Sistemas preservados

Nenhuma regra aprovada foi alterada em:

- Soft Target;
- targeting amplo;
- FOV;
- attackRange;
- Engage;
- facing lock;
- Dash/i-frame;
- colisão de mapa;
- colisão com entidades;
- combate;
- telegraph inimigo;
- dano/morte/respawn;
- impacto de ataques.

---

## 8. Fora do escopo

Continuam fora deste marco:

- pathfinding;
- obstacle avoidance automático;
- steering;
- navegação em malha;
- IA de movimentação dos inimigos;
- balanceamento definitivo da perseguição.

---

## 9. Critério de aprovação

O gate passa se:

1. Engage sem input manual persegue normalmente;
2. qualquer input manual assume imediatamente;
3. Soft Target permanece selecionado;
4. facing lock permanece no alvo;
5. ao cessar o input manual, chase reassume sem novo comando;
6. jogador consegue contornar manualmente um obstáculo mantendo Engage;
7. Dash continua acima de manual/chase na prioridade.

---

**Regra resumida:**

> **Engage só dirige o personagem quando o jogador não estiver dirigindo.**
