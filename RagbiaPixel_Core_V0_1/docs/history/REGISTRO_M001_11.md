# RAGBIA PIXEL — M001.11 — ESTADOS VISUAIS E LEITURA DA IA V0

**Status:** pronto para validação  
**Base:** M001.10 — Passivo Reativo V0 aprovado

## Objetivo

Tornar os estados autoritativos da IA imediatamente legíveis sem alterar comportamento, balanceamento ou regras de combate.

## Estados visuais

### IDLE
- Passivo: barra discreta verde/cinza.
- Agressivo: barra discreta azul.
- Nenhum alerta superior.

### AGGRO / CHASE
- Barra vermelha pulsante.
- Alerta pixelado vermelho acima da entidade.
- O FOV continua servindo somente para aquisição espontânea do agressivo; sair do FOV não encerra aggro.

### ATTACK
- Barra/alerta laranja.
- O telegraph vermelho/laranja crescente do M001.5A continua sendo a leitura principal do golpe.

### RESET
- Barra roxa.
- Seta roxa aponta em direção ao spawn original.
- O inimigo continua invulnerável e não-targetável durante o retorno, conforme regra já aprovada.

## Regras preservadas

- agressivo detecta por FOV;
- passivo só entra em aggro ao receber dano;
- `visionRange`, `attackRange` e `resetRange` permanecem independentes;
- sair do FOV não reseta aggro;
- leash é medido a partir do spawn;
- reset recupera recursos, desabilita dano/targeting e retorna ao spawn;
- passivo provocado volta a ser passivo após reset;
- nenhuma alteração em targeting, Engage, dash, perseguição do player, colisão ou dano.

## Natureza dos indicadores

Os indicadores são **de laboratório**. Não representam HUD ou efeitos finais do jogo. O objetivo é validar leitura de estado antes de evoluir comportamento/arte dos inimigos.

## Critério de validação

Durante o teste deve ser possível reconhecer, sem depender exclusivamente do HUD textual, quando um inimigo está:

1. parado/IDLE;
2. em aggro e perseguindo;
3. em estado de ataque;
4. resetando e retornando ao spawn.
