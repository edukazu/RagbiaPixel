# RAGBIA PIXEL — M001.6 — DASH / ESQUIVA V0

**Status:** pronto para validação jogável  
**Base:** M001.5A — Telegraph Inimigo V1 aprovado

---

## 1. Objetivo

Adicionar a primeira esquiva ativa do Ragbia Pixel usando o menor sistema funcional possível, preservando o telegraph inimigo aprovado como referência de teste.

O objetivo não é balancear classes. O objetivo é responder:

> É natural reconhecer a ameaça, escolher uma direção e usar uma esquiva curta mantendo o Soft Target e o fluxo de Engage?

---

## 2. Perfil de laboratório

Guerreiro e Arqueiro começam iguais:

- `charges: 1`
- `cooldown: 1.50 s`
- `distance: 140 px`
- `duration: 0.18 s`
- `invulnerability: 0.12 s`

A arquitetura já usa perfis independentes por classe em `phaser_map_beta/dodge-v0.js`.

---

## 3. Entrada

### Teclado

- `Shift` — Dash/Esquiva.

Como `Shift+Tab` já pertence ao targeting amplo, existe uma janela curta de 100 ms antes do Shift isolado virar Dash. Se `Tab` entrar com Shift nesse intervalo, a esquiva é cancelada e o comando continua sendo `Shift+Tab`.

### Gamepad

- `B` — Dash/Esquiva.

---

## 4. Direção e Soft Target

O Dash segue a intenção de movimento, não o facing atual.

- direção pressionada → usa o vetor atual;
- sem direção → usa o último vetor válido de movimento;
- durante a esquiva → a direção visual passa temporariamente para a direção do Dash;
- fim da esquiva → se houver Soft Target, o facing lock reassume imediatamente o alvo.

O alvo não é limpo pela esquiva.

---

## 5. Engage e ataque

- uma animação ofensiva já em andamento é cancelada quando a esquiva começa;
- Engage não é cancelado;
- não começa ataque novo enquanto o Dash estiver ativo;
- se `Espaço/RT` continuar segurado ao terminar, o auto-ataque volta a funcionar normalmente quando as demais condições forem válidas.

---

## 6. Colisão

O Dash usa `RagbiaCollisionV0.move` e, portanto, respeita a mesma física aprovada:

- cenário;
- água;
- cercas;
- construções;
- troncos;
- rochas maiores;
- inimigos sólidos.

Não existe atravessamento de corpos neste marco.

---

## 7. I-frame

Os primeiros `0.12 s` do Dash possuem invulnerabilidade.

Se o ataque inimigo resolver durante essa janela, o dano é recusado e o HUD registra uma esquiva perfeita.

O i-frame não altera a área lógica do telegraph e não remove colisões físicas.

---

## 8. Flip visual aprovado para teste

A proposta visual reutiliza os quatro sprites direcionais já existentes.

### Leste / Oeste

O personagem assume o sprite Leste/Oeste correspondente à intenção e executa:

`scaleX = cos(progress × 2π)`

Leitura visual aproximada:

`1 → 0 → -1 → 0 → 1`

Isso simula um giro de moeda em torno do eixo vertical (Y).

### Norte / Sul

A mesma função é aplicada a `scaleY`, simulando giro em torno do eixo horizontal (X).

A transformação é visual apenas. A hitbox e a posição lógica permanecem estáveis.

---

## 9. Efeitos adicionais mínimos

- afterimage curto durante a trajetória;
- poeira pixelada no início do Dash.

Nenhum novo frame de animação foi criado.

---

## 10. Baseline inimigo preservado

O ataque do Slime não foi acelerado:

- alcance: `150 px`;
- wind-up: `1.00 s`;
- cooldown: `1.60 s`;
- ATK: `0.5`;
- telegraph expansivo até o instante exato do hit.

Isso permite comparar no mesmo teste:

1. sair andando cedo;
2. sair com Dash mais tarde;
3. usar o i-frame em timing apertado;
4. não reagir e receber dano.

---

## 11. Fora do escopo

- diferenças reais de esquiva entre classes;
- múltiplas cargas;
- stamina;
- upgrades;
- atravessar inimigos;
- cancelamentos avançados;
- IA de movimento;
- perseguição;
- balanceamento definitivo do telegraph.

---

## 12. Critérios de validação manual

1. Dash responde a `Shift` e `B`.
2. Direção acompanha a intenção de movimento.
3. Sem input, usa a última direção válida.
4. Não atravessa cenário ou inimigos.
5. Flip Leste/Oeste usa compressão horizontal.
6. Flip Norte/Sul usa compressão vertical.
7. Soft Target permanece selecionado.
8. Facing lock volta ao alvo depois do Dash.
9. Engage retoma depois do Dash se continuar segurado.
10. É possível escapar do telegraph andando e também usando Dash.
11. Um golpe resolvido dentro do i-frame não causa dano.
12. Cooldown impede spam de esquiva.

---

**Regra mantida:** incremental → testável → validado → fechado → próximo sistema.
