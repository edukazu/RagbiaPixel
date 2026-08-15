# RAGBIA PIXEL — REGISTRO M001.2

## Marco

**M001.2 — Colisão V0**

## Baseline

Deriva diretamente do **M001.1C aprovado**.

O M001.1 fica considerado fechado com:

- escala do mundo aprovada;
- câmera aprovada;
- sprites e movimentação aprovados;
- ataques e flecha aprovados;
- Mapa Beta 01 aprovado como cenário provisório;
- direção futura de mapas preservada: ilustração de alta qualidade -> tradução/pixelização para gameplay.

## Objetivo

Adicionar a menor camada de colisão necessária para transformar o Mapa Beta 01 em espaço navegável fisicamente coerente.

Não adicionar targeting neste mesmo marco.

## Decisão estrutural

A arte **não é a colisão**.

Arquivos separados:

- `map-beta.js` — camada visual;
- `collision-v0.js` — camada lógica de bloqueio;
- `game.js` — movimento consulta a camada lógica.

Essa decisão permite trocar ou refazer o mapa visual sem amarrar o gameplay aos pixels da imagem.

## Footprint do jogador

A colisão do Player usa um círculo pequeno na região dos pés:

- raio: 20 px de mundo;
- offset vertical: +28 px em relação à âncora do sprite.

A cabeça e a maior parte do corpo visual não participam da colisão.

## Movimento

O deslocamento é dividido em micropassos de no máximo aproximadamente 7 px.

Cada micropasso tenta:

1. eixo X;
2. eixo Y.

Se um eixo colide e o outro está livre, o eixo livre continua.

Resultado desejado:

**encostar em um obstáculo não congela o personagem; ele pode deslizar ao longo da borda.**

## Obstáculos V0

### Limites

O Player não pode sair do mundo 4608 x 2688.

### Construções

Quatro footprints simples:

- casa da clareira sul;
- três casas do núcleo beta.

Não existe porta/interior neste marco.

### Cercas

As cercas rurais recebem barras lógicas finas, permitindo contorno externo.

### Árvores

A colisão fica no tronco/base.

A copa não é usada como hitbox.

Os pontos principais e clusters determinísticos desenhados pelo mapa são reproduzidos na camada lógica para evitar paredes artificiais de copa.

### Pedras

Pedras determinísticas do cenário recebem colisores circulares pequenos.

### Ruínas

Somente os trechos estruturais de alvenaria bloqueiam.

### Rio e ponte

O rio possui duas regiões bloqueadoras:

- norte da ponte;
- sul da ponte.

A faixa da ponte permanece livre para travessia.

## Diagnóstico

Tecla **C** alterna a visualização dos colliders.

O HUD mostra o ID do último obstáculo que bloqueou o movimento.

Existe também preview estático:

`previews/MAPA_BETA_01_M001_2_COLISAO_DEBUG.png`

## Autoteste

`collision-v0.js` possui um autoteste executado na inicialização para verificar pelo menos:

- spawn livre;
- casa bloqueando;
- rio bloqueando;
- ponte passável;
- limite do mundo bloqueando.

Falha nesse conjunto interrompe o build com diagnóstico visível.

## Fora do escopo

- inimigos bloqueando o Player;
- colisão de flechas;
- colisão de ataques;
- hitbox ofensiva contra cenário;
- targeting;
- IA/pathfinding;
- interação contextual;
- portas;
- refinamento final de colisores.

## Gate de aprovação

O M001.2 pode ser fechado se a navegação parecer natural e as cinco famílias principais — construções, troncos, pedras/ruínas, cercas e água — bloquearem sem comprometer movimento/câmera/ataques já aprovados.

Próximo marco recomendado após aprovação:

**M001.3 — Entidades + Targeting V0**.
