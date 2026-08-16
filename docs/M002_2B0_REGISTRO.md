# M002.2B.0 — Microteste de Linguagem Visual

**Status:** pronto para avaliação jogável  
**Escopo:** parede norte + uma janela + lareira + piso + uma pilha de lenha + Aprendiz.

## Regra principal

Este microteste é **desenhado do zero em código/Canvas**.

Nenhum pixel da referência ilustrada da Casa do Avô é carregado, filtrado, reduzido, recortado, pixelizado ou reutilizado. A referência serve somente como conceito para:

- ambiente medieval aconchegante;
- madeira + pedra;
- parede com altura visual;
- janela integrada à parede;
- lareira como ponto focal;
- sensação simples de profundidade.

## Objetivo

Encontrar um ponto visual entre dois extremos já testados:

1. mapa técnico/geometrizado simples demais;
2. ilustração rica demais usada praticamente como cenário.

O alvo é uma arte de gameplay própria, com clusters de pixel maiores, paleta controlada, baixo microdetalhe e espaço visual suficiente para o Aprendiz.

## Como executar

Use:

`INICIAR_MICROTESTE_M002_2B0.bat`

O launcher usa o mesmo servidor HTTP local já introduzido no M002.2A.1.

## Controles

- WASD / setas / analógico: mover;
- C: colisão e footprint;
- R: voltar ao spawn;
- F: tela cheia.

## Critério de avaliação

Não avaliar a Casa inteira. Avaliar somente:

1. parede parece realmente uma parede?
2. janela parece embutida no plano vertical?
3. lareira tem volume suficiente sem parecer ilustração?
4. piso é legível e não compete com o personagem?
5. o Aprendiz convive melhor com esse nível de detalhe?
6. a linguagem parece repetível para construir a Casa depois?

Nenhuma expansão da Casa deve acontecer antes desta avaliação.
