# M002-MAP.1 — Auditoria e Representação Semântica do Mapa Beta

**Branch:** `m002-map-pipeline`  
**Origem:** `core-v0.1`  
**Regra deste marco:** **zero mudança visual e zero mudança de gameplay.**

## Objetivo

Retirar do código implícito a descrição do Mapa Beta 01 e registrá-la como dados semânticos que possam futuramente alimentar:

- um Ragbia Map Builder;
- exportação para Tiled;
- troca de kit visual;
- regeneração determinística;
- colisão/objetos/spawns derivados da mesma fonte.

## Fonte canônica nova do laboratório

`maps/semantic/map-beta-v0.js`

Ela descreve, em unidades da malha lógica do mapa:

- dimensões e escala;
- seeds determinísticas;
- estrada e ramal;
- rio e ponte;
- assentamentos;
- casas, cercas e campos;
- ruínas;
- árvores estáticas e clusters;
- pontos de flores;
- footprint lógico de colisões;
- spawn do jogador;
- 8 spawns de Slime;
- regras de região.

## Arquivo exportado

`maps/generated/map-beta-v0.json`

Pode ser regenerado com:

`node tools/export_map_beta_semantic.js`

Neste marco, o runtime **ainda não consome** este JSON. Isso é deliberado: primeiro validamos paridade sem alterar o CORE.

## Auditoria visual

Execute:

`INICIAR_M002_MAP_1_AUDITORIA.bat`

O preview desenha o Mapa Beta original e sobrepõe a interpretação semântica:

- amarelo: estrada;
- azul: rio;
- laranja: casas;
- verde: árvores estáticas;
- branco: spawn do jogador;
- rosa: spawns dos Slimes;
- roxo: ruínas.

`C` liga/desliga o overlay.

## Critério de aprovação

M002-MAP.1 fecha quando:

1. a auditoria visual corresponde ao Mapa Beta existente;
2. a suíte de testes continua passando;
3. nenhum comportamento ou pixel do runtime principal foi alterado;
4. a representação semântica é suficiente para iniciar o Builder/Tiled no próximo marco.

## Próximo marco se aprovado

`M002-MAP.2 — Outdoor Kit V1 + primeiro gerador visual`

A partir dele a intenção é manter a mesma geometria e gameplay e trocar somente o vocabulário visual do mapa.
