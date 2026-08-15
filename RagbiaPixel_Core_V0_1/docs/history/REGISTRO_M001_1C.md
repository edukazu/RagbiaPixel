# RAGBIA PIXEL — REGISTRO M001.1C

## Marco

**M001.1C — Tratamento Visual do Mapa Beta 01**

## Objetivo

Elevar o mapa técnico aprovado em escala/câmera para uma primeira linguagem visual pixelada coerente, sem adicionar sistemas de gameplay.

## Baseline preservada

O build deriva do **M001.1B FIX2**.

Não alterar neste marco:

- Player;
- sprites dos personagens;
- sprites dos Slimes;
- caminhada;
- controles;
- ataques;
- flecha;
- câmera;
- tamanho lógico do mundo.

## Decisão técnica

A camada visual passa a ser desenhada em **1152 x 672** e ampliada em fator **4** para o mundo **4608 x 2688**.

Cada pixel lógico do mapa corresponde a 4 x 4 pixels do runtime.

Motivos:

- pixelização coerente por construção;
- arte independente de editor externo;
- fácil geração e revisão por código;
- preservação de coordenadas do mundo;
- possibilidade futura de substituir essa camada por uma ilustração-base/pixelização sem reescrever gameplay;
- chunks finais continuam em 1536 x 1344.

## Elementos tratados

### Terreno

- múltiplas massas de verde;
- microtextura determinística;
- regiões secas discretas;
- agrupamentos de flores.

### Estrada

- borda irregular;
- duas faixas tonais;
- marcas de uso;
- pedras e transições de grama;
- ramal para núcleo rural.

### Água

- margens separadas;
- água profunda/intermediária;
- highlights em segmentos pixelados;
- pedras de margem.

### Estruturas

- ponte de madeira;
- casas em linguagem pixelada;
- cercas;
- campos cultivados;
- ruína no norte.

### Vegetação

- árvores em blocos sobrepostos;
- sombra no solo;
- troncos legíveis;
- variações de copa;
- bosques e clusters em vez de distribuição uniforme.

## Regra importante

O M001.1C **não é o mapa final do jogo**.

Ele é um laboratório visual já suficientemente tratado para avaliarmos se a tecnologia de mapa por código consegue sustentar o estilo desejado.

A direção futura continua sendo:

**referência visual -> mapa ilustrado-base -> tratamento/pixelização -> camada visual do mundo**.

Este marco não exige editor de mapas manual.

## Fora do escopo

- colisão;
- hitboxes de cenário;
- targeting;
- pathfinding;
- IA;
- NPCs;
- interiores;
- transições;
- conteúdo definitivo.

## Gate de aprovação

Se o tratamento visual for aprovado e escala/câmera continuarem estáveis:

**M001.1 é fechado.**

Próximo marco:

**M001.2 — Colisão V0**

Primeiro conjunto previsto:

- paredes/casas;
- troncos;
- água;
- cercas;
- pedras/ruína.

A implementação deverá continuar inteiramente por código/dados, sem editor manual.
