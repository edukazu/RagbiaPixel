# RAGBIA PIXEL — M001.1 MAPA BETA 01

**Data:** 15/08/2026  
**Tecnologia:** Phaser 4.2.1  
**Base:** Ragbia Pixel FULL HD V15.3  
**Pré-condição:** S001 aprovado para movimento e ataques.

## 1. Objetivo

O M001.1 é o primeiro passo para transformar o protótipo em um ambiente real de jogo.

Neste marco, a V15.3 deixa de existir apenas dentro de um campo de laboratório e passa a navegar em um mundo maior que a tela, com câmera.

A meta não é validar colisão nem targeting ainda.

## 2. Escopo implementado

- mundo lógico de 4608 × 2688;
- viewport de referência 1920 × 1080;
- câmera com acompanhamento suave e limites do mundo;
- composição visual de mapa beta totalmente gerada por código;
- estrada principal e ramal;
- clareiras;
- rio;
- ponte visual;
- construções;
- vegetação;
- cercas;
- pedras;
- ruína visual;
- Slimes posicionados no mundo apenas como referências de escala;
- Guerreiro e Arqueiro preservados do S001;
- quatro direções e três fases de caminhada;
- ataques preservados;
- gamepad preservado.

## 3. Regra de produção do mapa

Nenhum editor visual externo é necessário.

O mapa está separado em:

- **camada visual / composição:** `map-beta.js`;
- **runtime:** `game.js`.

A arte deste marco é de validação espacial. Ela pode ser posteriormente substituída por um mapa ilustrado/pixelado produzido a partir de referência visual sem alterar coordenadas, câmera ou sistemas lógicos.

## 4. Deliberadamente não implementado

- colisão de objetos;
- collision mask;
- targeting;
- soft target;
- hard target;
- seleção automática;
- linha de visão;
- dano/IA como sistema real;
- transições de mapa.

## 5. Critério de aprovação

Avaliar somente:

1. o tamanho do mundo parece adequado para começar um mapa real;
2. a câmera acompanha o jogador de maneira confortável;
3. a leitura do personagem continua boa em cenário maior;
4. movimentação e ataques continuam com a sensação aprovada no S001;
5. a composição visual é suficiente para avançarmos ao teste de colisão, mesmo não sendo arte final.

## 6. Próximo passo se aprovado

**M001.2 — Colisão V0**

Adicionar apenas um conjunto pequeno e explícito de obstáculos:

- limite físico de uma construção;
- troncos de algumas árvores;
- margem de água;
- trecho de cerca;
- pedra.

A colisão será definida por código/dados, separada da ilustração visual.

Depois da validação de M001.2, seguir para entidades e targeting V0.
