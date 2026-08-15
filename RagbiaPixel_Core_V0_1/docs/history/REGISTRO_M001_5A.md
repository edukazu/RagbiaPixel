# RAGBIA PIXEL — M001.5A TELEGRAPH INIMIGO V1

**Status:** build para validação  
**Base:** M001.5 — Combate Inimigo V0 (funcionalmente validado)

## Objetivo

Tornar o ataque inimigo mais lento, maior e claramente reagível antes de qualquer tentativa de balanceamento.

## Escala preservada

- Player: `HP 1 / ATK 1`.
- Inimigo: `HP 1 / ATK 0,5`.

## Parâmetros de laboratório V1

- `attackRange`: **150 px**;
- `attackWindup`: **1,00 s**;
- `attackCooldown`: **1,60 s**;
- resolução do hit: **100% do wind-up**.

## Telegraph expansivo

A indicação vermelho/laranja no chão começa menor e cresce progressivamente. A borda da área alcança o raio lógico total de ataque exatamente no instante em que o golpe é resolvido.

O jogador pode escapar da área antes desse instante; nesse caso o ataque erra.

A expansão da área é um sistema de **legibilidade de ameaça**, não balanceamento final.

## Dash / esquiva — decisão futura registrada

O Player deverá possuir um sistema de dash/esquiva. Cada classe/personagem poderá definir:

- quantidade de cargas;
- cooldown;
- futuramente outros parâmetros próprios se necessários.

O dash não é implementado no M001.5A. Primeiro valida-se se o telegraph cria uma janela visual de reação útil.

## Fora do escopo

Perseguição, IA de movimento, pathfinding, balanceamento definitivo, direção visual dos inimigos, depth sorting definitivo, skills, defesa, loot e progressão.

## Critério de aprovação

O ataque deve ser percebido com antecedência; sua área deve crescer de forma evidente até o momento exato do golpe; e sair da área antes da resolução deve evitar o dano.
