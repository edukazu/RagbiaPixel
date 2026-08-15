# RAGBIA PIXEL — M001.4A — FEEDBACK DE COMBATE + MORTE V0

**Base:** M001.4 aprovado funcionalmente  
**Status:** build para validação  
**Data:** 15/08/2026

## Objetivo

Adicionar o mínimo de feedback visual necessário para que um acerto e uma morte deixem de parecer simples remoções lógicas de entidade.

## Escala de laboratório preservada

- Personagem: HP 1 / ATK 1.
- Inimigo: HP 1 / ATK 0,5.
- O ataque do inimigo continua apenas como dado e não é executado.

## Alterações do M001.4A

1. Número de dano passa para amarelo.
2. Acerto gera flash curto no sprite do inimigo.
3. Acerto gera burst pixelado curto e micro-shake de câmera.
4. Morte não oculta mais o sprite instantaneamente: usa squash + fade de 0,42 s.
5. A morte lógica continua imediata: `alive=false`, `targetable=false`, `solid=false`.
6. O alvo é limpo quando o inimigo morre.
7. Respawn de laboratório ocorre após 3 s no ponto original.
8. Respawn restaura HP 1, targetable, solidez e sprite.

## Critério de aprovação

Selecionar -> Engage -> hit claramente perceptível -> `-1` amarelo -> morte visual curta -> espaço livre -> após 3 s o Slime reaparece no spawn original com HP 1 e pode ser selecionado novamente.

## Fora do escopo

- IA/ataque inimigo;
- dano no jogador;
- perseguição;
- morte final com frames próprios;
- respawn definitivo do jogo;
- loot/XP;
- depth sorting final.
