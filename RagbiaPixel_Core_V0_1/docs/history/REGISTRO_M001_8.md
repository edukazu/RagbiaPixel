# RAGBIA PIXEL — M001.8 / CONTINUIDADE DO ENGAGE

**Status:** build para validação  
**Base:** M001.7A — Manual Override da Perseguição  
**Escopo:** continuidade automática de alvo enquanto Engage permanece segurado

---

## 1. Objetivo

Fechar o ciclo ofensivo contínuo do Engage.

Enquanto `Espaço/RT` permanecer segurado, a morte do alvo atual não deve encerrar automaticamente a ação. O sistema procura um novo alvo válido usando a mesma política de **Soft Target** já aprovada e continua o fluxo de perseguição + ataque.

---

## 2. Regra implementada

1. jogador mantém `Espaço/RT` segurado;
2. alvo atual morre;
3. o alvo morto é invalidado imediatamente;
4. o sistema consulta o pool de Soft Target atual;
5. escolhe o próximo inimigo válido/próximo dentro do FOV;
6. se estiver fora do `attackRange`, a perseguição M001.7A assume;
7. ao entrar no alcance, o auto-ataque continua;
8. se estiver dentro do alcance, o próximo ataque começa respeitando a cadência normal.

A troca automática usa **somente o Soft Target** (`Tab/RB`): até os 2 inimigos válidos mais próximos dentro do campo de visão da classe.

---

## 3. Sem sucessor imediato

Se o alvo morrer e não houver outro inimigo válido dentro do Soft Target/FOV naquele instante:

- não é criado alvo artificial;
- Engage permanece em estado de continuidade pendente enquanto o botão continuar segurado;
- ao surgir/entrar um alvo válido no Soft Target, ele pode ser adquirido automaticamente;
- soltar `Espaço/RT` cancela esse estado pendente.

Isso permite testar a continuidade também com o respawn de laboratório.

---

## 4. Cancelamento explícito

`Esc/LT` continua tendo prioridade como cancelamento explícito.

Ao limpar o alvo manualmente:

- alvo é removido;
- ataque é cancelado;
- perseguição é cancelada;
- continuidade pendente é cancelada;
- manter fisicamente `RT/Espaço` pressionado NÃO readquire outro alvo até haver um novo comando de Engage depois do release.

---

## 5. Regras preservadas

Continuam intactos:

- Soft Target `Tab/RB`;
- ciclo amplo `Shift+Tab / LB+RB`;
- FOV por classe;
- `attackRange` separado do FOV;
- Engage;
- facing lock;
- colisão com cenário e entidades;
- ataque/dano/morte/respawn;
- telegraph inimigo;
- Dash/Esquiva;
- hierarquia `Dash > movimento manual > perseguição automática`;
- bloqueios físicos sem pathfinding.

---

## 6. O que testar

### Teste A — sequência normal

1. selecione um Slime;
2. segure `Espaço/RT`;
3. mate o alvo;
4. confirme que outro Soft Target válido é selecionado automaticamente;
5. confirme que o personagem persegue e ataca o novo alvo sem soltar Engage.

### Teste B — release

1. mate um alvo mantendo Engage;
2. após a troca automática, solte `Espaço/RT`;
3. ataque e perseguição devem parar;
4. o novo Soft Target deve permanecer selecionado.

### Teste C — cancelamento

1. mantenha Engage;
2. pressione `Esc/LT`;
3. alvo deve ser limpo e não deve ser readquirido automaticamente enquanto o mesmo Engage físico continuar pressionado.

### Teste D — sem alvo disponível

1. mate o único alvo válido no FOV;
2. mantenha Engage pressionado;
3. sistema deve ficar sem alvo, aguardando;
4. quando um alvo válido voltar ao Soft Target/FOV, deve ser adquirido automaticamente.

---

## 7. Fora do escopo

Ainda não há:

- pathfinding;
- desvio automático de obstáculos;
- prioridades táticas além do Soft Target;
- seleção por ameaça;
- IA de movimentação inimiga;
- política definitiva por classe para continuidade.

---

**Princípio do marco:** morte do alvo não quebra o Engage enquanto o jogador continua segurando o comando.
