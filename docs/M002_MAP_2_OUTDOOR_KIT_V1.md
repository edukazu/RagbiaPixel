# M002-MAP.2 — Outdoor Kit V1

**Status:** pronto para validação jogável  
**Branch:** `m002-map-pipeline`  
**Origem:** M002-MAP.1 aprovado.

## Objetivo

Provar que o mesmo mapa e a mesma gameplay podem receber uma camada visual diferente gerada a partir da representação semântica, sem redesenhar manualmente a composição.

## Arquitetura

`maps/semantic/map-beta-v0.js` descreve **o que existe e onde existe**.  
`maps/kits/outdoor-v1.js` descreve **o vocabulário visual disponível**.  
`phaser_map_beta/outdoor-kit-v1-renderer.js` sabe **como desenhar cada família visual**.  
`phaser_map_beta/map-beta-generated-v1.js` combina mapa semântico + kit e produz os mesmos 6 chunks do runtime.

## Regra principal

O mapa gerado NÃO recebe coordenadas próprias de casas, árvores, estrada, rio ou ponte. Essas coordenadas vêm do mapa semântico M002-MAP.1.

## Escopo visual V1

- grama com variação determinística;
- estrada e bordas;
- rio e marcas de fluxo;
- ponte de madeira;
- árvores com três perfis visuais;
- arbustos automáticos;
- pedras;
- casas rurais;
- cercas;
- campos;
- ruínas;
- flores e detalhes ambientes.

## Comparação A/B

O runtime inicia em **MAP V1**.

Pressione `V` para alternar instantaneamente:

- `MAP V1` — mapa gerado pelo Outdoor Kit V1;
- `MAP CORE` — camada visual original do CORE V0.1.

Nenhuma troca altera:

- colisão;
- coordenadas;
- player;
- Slimes;
- targeting;
- combate;
- IA;
- câmera.

## Critério de aprovação

O marco não exige arte final. Ele deve provar:

1. que a aparência pode ser substituída sem redesenhar a lógica;
2. que o mapa gerado reconhece a mesma composição;
3. que `V` permite comparação direta sem deslocar gameplay;
4. que o kit tem ganho visual suficiente para justificar evolução do pipeline.
