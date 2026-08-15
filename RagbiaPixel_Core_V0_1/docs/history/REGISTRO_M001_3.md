# RAGBIA PIXEL — M001.3 / ENTIDADES + TARGETING V0

**Status:** aguardando validação prática  
**Base:** M001.2 — Colisão V0 aprovada funcionalmente  
**Tecnologia:** Phaser 4.2.1 / JavaScript / Canvas 2D

---

## 1. Objetivo

Transformar os inimigos do cenário de simples imagens animadas em **entidades lógicas mínimas** e provar a primeira infraestrutura de seleção de alvo sem antecipar combate automático ou políticas definitivas.

O marco deve responder somente:

> O jogo consegue reconhecer inimigos válidos, selecionar um deles, ciclar entre candidatos e comunicar claramente o alvo atual?

---

## 2. Preservado do M001.2

Não alterar como objetivo deste marco:

- escala 4608 × 2688;
- câmera;
- Guerreiro e Arqueiro;
- 4 direções;
- 3 fases de caminhada;
- ataques;
- espada, arco e flecha;
- mapa beta pixelado provisório;
- colisão de casas;
- colisão de cercas;
- colisão de troncos;
- colisão de água/limites/ruínas.

---

## 3. Refinamento de colisão aplicado

Decisão validada após o M001.2:

- pedrinhas decorativas deixam de gerar hitbox;
- plaquinhas decorativas continuam sem hitbox;
- apenas rochas maiores/relevantes bloqueiam;
- casas, cercas e troncos continuam bloqueando.

A pendência de **ordenação visual entre personagem e copa das árvores** permanece fora do escopo.

---

## 4. Entidades V0

Novo módulo:

`phaser_map_beta/entities-v0.js`

Cada Slime recebe:

- `id` estável;
- `kind`;
- `faction`;
- `alive`;
- `targetable`;
- `x/y`;
- `radius`;
- referência opcional `view`.

O modelo é propositalmente pequeno para permitir expansão futura sem atrelar regra de gameplay ao sprite Phaser.

---

## 5. Targeting V0

Novo módulo:

`phaser_map_beta/targeting-v0.js`

### Regra provisória

Um candidato é válido quando:

1. é entidade inimiga;
2. está viva;
3. está marcada como `targetable`;
4. está visível no viewport atual da câmera.

A lista é ordenada por distância ao jogador.

### Controles

- `TAB` / `RB`: ciclo para frente;
- `Shift+TAB` / `LB`: ciclo reverso;
- `Esc` / `LT`: limpa o alvo.

A troca de classe do laboratório passa para:

- `Q/E` no teclado;
- `Y` no gamepad.

Essa mudança libera `LB/RB` para o teste real de targeting em gamepad.

---

## 6. Feedback visual

O alvo atual recebe:

- elipse pulsante nos pés;
- segundo contorno externo;
- losango acima do sprite;
- identificação e distância no HUD.

O feedback é técnico/provisório e não representa a interface final do jogo.

---

## 7. Deliberadamente fora do M001.3

Não implementar ainda:

- perseguição;
- auto-ataque;
- rotação automática do personagem para o alvo;
- line-of-sight;
- oclusão por paredes/árvores;
- seleção por mouse;
- seleção por direção do analógico;
- limite definitivo de distância;
- dano/morte alterando a lista em gameplay;
- prioridades por classe;
- hard target/soft target definitivo;
- HUD final.

---

## 8. Critério de aprovação

O M001.3 pode ser fechado se:

- os Slimes aparecem normalmente;
- TAB/RB escolhe um alvo previsível;
- ciclos seguinte/anterior funcionam;
- Esc/LT limpa;
- marcador é legível;
- navegação e combate básico anteriores não sofrem regressão;
- a implementação é suficiente para evoluir o targeting incrementalmente.

---

## 9. Próximo estágio possível

Somente após validação prática definir o próximo recorte. Possíveis caminhos, sem antecipar decisão:

- refinamento da política de targeting;
- integração ataque ↔ alvo;
- comportamento/IA mínima das entidades;
- profundidade/oclusão visual do mapa.

---

## 10. FIX1 — compatibilidade do marcador com Phaser 4.2.1

Durante a primeira validação prática, `TAB/RB` chegava a selecionar logicamente o alvo, porém o runtime falhava ao desenhar o losango de soft target com `new Phaser.Geom.Point(...)`.

Correção aplicada:

- `Graphics.fillPoints` passa a receber objetos simples `{x, y}`;
- o mesmo padrão foi aplicado ao debug de colisão;
- removida a criação intermediária desnecessária de `Phaser.Geom.Polygon` no debug;
- diagnóstico passa a diferenciar erro de boot de erro ocorrido durante o jogo.

**Status após FIX1:** aguardando novo teste prático de `TAB/RB`, `Shift+TAB/LB` e `Esc/LT`.
