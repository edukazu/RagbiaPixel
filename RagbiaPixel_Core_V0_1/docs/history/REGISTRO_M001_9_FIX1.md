# RAGBIA PIXEL — M001.9 FIX1 — DISTÂNCIA DE ATAQUE DA IA

**Marco:** M001.9 — IA de Movimento Inimigo V0  
**Tipo:** correção funcional  
**Status:** aguardando validação do usuário

## Problema observado

Inimigos agressivos podiam perseguir o personagem e parar sem iniciar o ataque, especialmente ao aproximarem-se pelo norte.

## Causa

Havia duas referências espaciais diferentes:

1. IA de perseguição: centro do sprite -> centro do sprite;
2. ataque real: footprint/pés -> footprint/pés.

Como Player e Slime possuem offsets verticais de footprint diferentes, a IA podia considerar que havia alcançado `attackRange = 150` enquanto o ataque real ainda estava alguns pixels fora do alcance.

## Correção

A transição de `CHASE` para `ATTACK` e a direção final de aproximação passam a usar a mesma referência de footprint usada pela validação do ataque.

A separação conceitual permanece:

- FOV detecta;
- Attack Range determina ataque;
- Leash determina reset pelo spawn.

Nenhum valor de balanceamento foi alterado.
