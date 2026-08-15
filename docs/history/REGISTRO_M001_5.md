# RAGBIA PIXEL — M001.5 COMBATE INIMIGO V0

**Status:** build para validação
**Base:** M001.4B — Impacto de Ataque V1 (aprovado)

## Objetivo

Ativar o menor ciclo possível de dano inimigo sem adicionar IA de movimento.

## Escala de laboratório

- Player: `HP 1 / ATK 1`.
- Inimigo: `HP 1 / ATK 0,5`.

Assim, exatamente dois ataques inimigos completos derrotam o Player.

## Regras implementadas

1. Slimes permanecem imóveis.
2. Cada Slime possui alcance de ataque V0 de 96 px.
3. Ao entrar no alcance, inicia wind-up de 0,38 s.
4. O hit acontece durante o wind-up; se o Player tiver saído do alcance, o ataque erra.
5. Cooldown provisório entre ataques: 1,20 s.
6. Dano recebido continua usando feedback numérico amarelo.
7. Player morto perde alvo, cancela ataque/Engage e não se move.
8. Player reaparece no ponto inicial após 3 s com HP 1.
9. Não há perseguição automática nem pathfinding.

## Preservado

- Soft Target / Field Target;
- FOV e Attack Range;
- Engage;
- facing lock;
- colisão com cenário e entidades;
- impacto V1 aprovado;
- morte/respawn dos Slimes.

## Fora do escopo

Line-of-sight, IA de movimento, perseguição, direção visual dos inimigos, depth sorting definitivo, skills, defesa, loot e progressão.

## Critério de aprovação

O Player deve conseguir perceber o ataque inimigo, sofrer `0,5` por hit, morrer no segundo acerto e reaparecer corretamente, enquanto os Slimes permanecem imóveis.
