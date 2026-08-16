# M002.2A.1 — Laboratório Visual: Pixelado Melhorado

**Status:** pronto para avaliação manual  
**Origem:** M002.2 funcional / visual não aprovado  
**Objetivo:** testar o teto visual do cenário pixelado antes do laboratório ilustrado híbrido.

## Hipótese testada

Manter a lógica 2D do CORE e elevar a apresentação por um pipeline de:

> referência ilustrada → redução/pixelização controlada → camada jogável → colisões separadas → depth/oclusão simples

A arte usada neste laboratório deriva diretamente da referência visual da Casa do Avô e foi reduzida para grade lógica 960×540, depois ampliada por nearest-neighbor para 1920×1080. Isso preserva riqueza de composição/material sem retornar à construção por primitivas geométricas do M002.2.

## O que mudou

- janelas passam a estar visualmente integradas às paredes;
- paredes, piso e mobiliário têm planos e materiais mais legíveis;
- cenário usa uma base pixelada de maior detalhe;
- Aprendiz continua sendo sprite independente e jogável;
- colisões continuam totalmente separadas da arte;
- player usa depth pelo footprint (`depth = player.y`);
- três recortes da própria arte funcionam como oclusores experimentais:
  - mesa central;
  - mesa/escrivaninha esquerda;
  - suporte de armas;
- `C` mostra colisores, zona do suporte e thresholds de depth;
- não há interação de classe ainda.

## Critérios de avaliação

1. ganho visual em relação ao M002.2;
2. coerência entre cenário e sprite do Aprendiz;
3. leitura de profundidade;
4. qualidade das janelas/paredes/materiais;
5. legibilidade de navegação e colisão;
6. viabilidade deste pipeline para Vila e mapas futuros.

## Fora do escopo

- interação com o suporte;
- escolha Espada/Arco;
- Guerreiro/Arqueiro Aprendiz;
- Status/Inventário finais;
- Vila;
- arte final definitiva.

## Decisão após teste

O M002.2A.1 não deve ser tratado automaticamente como direção aprovada. Após avaliação manual, seguir para:

- refinamento pixelado, se o teto visual for convincente; ou
- `M002.2A.2 — Ilustrado Híbrido`, para comparação direta.
