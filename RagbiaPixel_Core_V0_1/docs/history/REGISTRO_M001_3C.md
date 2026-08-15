# RAGBIA PIXEL — M001.3C — COLISÃO COM ENTIDADES

## Objetivo

Fechar a colisão dinâmica mínima que faltou ao M001.3B antes de iniciar Combate V0.

## Regra implementada

Inimigos sólidos ocupam espaço físico no mundo. O jogador não pode atravessar um Slime vivo e sólido.

A colisão não usa o tamanho total do sprite. Cada entidade possui um footprint circular inferior independente da arte:

- `solid: true`
- `collisionRadius: 30`
- `collisionOffsetY: 22`

O jogador preserva o footprint já validado:

- raio: 20 px
- offset vertical dos pés: 28 px

## Resolução de movimento

A movimentação continua usando micropassos e resolução separada por eixo. Isso permite contornar e deslizar ao redor de inimigos, em vez de travar toda a movimentação ao primeiro contato.

## Debug

A tecla `C` continua exibindo colisões do cenário e agora também mostra os footprints físicos dos inimigos.

## Mantido sem alteração

- mapa e câmera;
- sprites e animações;
- colisões de cenário;
- Soft Target;
- ciclo amplo por FOV;
- Engage;
- facing lock;
- separação entre FOV/targetRange e attackRange.

## Fora deste gate

Colisão inimigo ↔ inimigo, IA, perseguição, dano real, morte, projétil ↔ entidade e knockback físico permanecem fora. Esses sistemas só entram nos marcos próprios.
