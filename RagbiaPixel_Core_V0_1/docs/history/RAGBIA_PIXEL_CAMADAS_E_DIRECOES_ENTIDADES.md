# RAGBIA PIXEL — REGISTRO DE DIREÇÃO VISUAL DE ENTIDADES E CAMADAS

**Projeto:** Ragbia Pixel  
**Marco de origem:** M001.3C — Colisão com Entidades  
**Status:** decisão registrada para implementação futura  
**Data:** 15/08/2026

---

## 1. Contexto

Após a validação da colisão física entre o personagem e os inimigos no M001.3C, foram identificadas duas necessidades visuais que devem ser tratadas futuramente.

Essas pendências não bloqueiam a aprovação funcional da colisão atual, mas devem ser consideradas parte da arquitetura visual do projeto.

---

## 2. Direções visuais dos inimigos

Os inimigos e demais entidades móveis deverão futuramente adotar uma lógica visual equivalente à utilizada pelos personagens controláveis.

Cada entidade deverá possuir quatro estados/direções visuais:

- Norte;
- Sul;
- Leste;
- Oeste.

O objetivo é evitar que inimigos permaneçam como sprites visualmente neutros ou sem orientação espacial.

A direção exibida deve acompanhar o estado/movimento da entidade e, futuramente, poderá também ser influenciada por sistemas de targeting, combate e IA.

---

## 3. Ordenação dinâmica de profundidade entre entidades

A sobreposição gráfica entre personagem e inimigos não deve usar uma camada fixa por tipo de entidade.

A regra oficial desejada é:

> **Quem estiver mais ao sul / mais abaixo na tela deve ser desenhado na frente.**

Portanto:

- inimigo ao norte do personagem + personagem ao sul → o personagem aparece na frente;
- inimigo ao sul do personagem → o inimigo aparece na frente;
- se ambos mudarem de posição, a ordem visual deve ser recalculada dinamicamente.

Tecnicamente, a ordenação deverá considerar principalmente a posição vertical dos pés/footprint da entidade no eixo Y, e não o topo ou o centro completo do sprite.

---

## 4. Problema atual registrado

No estado atual do protótipo, a sobreposição entre personagem e inimigos pode ficar incorreta.

Exemplo:

- inimigo está ao norte;
- personagem está ao sul;
- mesmo assim o inimigo pode ser desenhado sobre o personagem.

Esse comportamento é provisório e deverá ser corrigido com depth sorting dinâmico.

---

## 5. Integração futura com o cenário

O mesmo princípio deverá futuramente ser compatibilizado com elementos do mapa que possuem altura visual.

Exemplos:

- copas de árvores;
- paredes;
- telhados;
- estruturas altas;
- objetos que o personagem pode passar pela frente ou por trás.

Já existe uma pendência específica referente às copas das árvores: atualmente o personagem pode aparecer na frente da copa mesmo quando deveria estar parcialmente oculto.

A solução futura deverá combinar:

1. posição Y das entidades;
2. ponto de ancoragem/footprint;
3. camadas de cenário;
4. áreas de oclusão quando necessário.

---

## 6. Estado atual

### Aprovado

- colisão jogador ↔ inimigo;
- footprint físico independente do tamanho total do sprite;
- possibilidade de contornar inimigos;
- Soft Target;
- Engage;
- FOV;
- Attack Range.

### Pendências futuras registradas

- quatro direções visuais para inimigos;
- depth sorting dinâmico personagem ↔ inimigos;
- depth sorting/oclusão com elementos do cenário;
- tratamento específico das copas das árvores.

---

## 7. Regra de desenvolvimento

Essas melhorias não devem ser implementadas antecipadamente apenas por acabamento visual.

A prioridade continua sendo:

> **incremental → testável → validado → fechado → próximo sistema.**

A implementação deve ocorrer quando o próximo sistema visual ou de IA realmente exigir essa camada de profundidade e orientação.

---

**Fim do registro.**
