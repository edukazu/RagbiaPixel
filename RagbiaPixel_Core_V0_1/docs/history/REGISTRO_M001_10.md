# RAGBIA PIXEL — M001.10 / PASSIVO REATIVO V0

**Status:** pronto para validação

## Regra implementada
- Agressivo: continua adquirindo jogador espontaneamente pelo FOV.
- Passivo: NÃO adquire jogador espontaneamente pelo FOV.
- Passivo que recebe dano e sobrevive: entra em `aggro=true` imediatamente, independentemente do FOV.
- Depois de provocado, usa exatamente o mesmo fluxo de um agressivo: `CHASE → ATTACK → LEASH/RESET`.
- Sair do FOV não remove aggro.
- Ao resetar: interrompe combate, fica invulnerável/não-targetável, restaura recursos imediatamente, retorna ao spawn.
- Ao concluir reset: mantém `behavior=passive`, limpa aggro e volta a `IDLE`.

## Escala de laboratório
O `SLIME-02` foi definido como passivo-teste com `HP 2 / ATK 0,5`, para sobreviver ao primeiro golpe do Player (`ATK 1`). Demais Slimes preservam os valores anteriores.

## Não implementado
Aggro compartilhado, threat table, assistência de grupo, pathfinding e regras especiais de Boss/VIP continuam fora deste marco.
