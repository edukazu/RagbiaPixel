# RAGBIA PIXEL — M001.9 / IA DE MOVIMENTO INIMIGO V0

**Status:** pronto para validação jogável  
**Base:** M001.8 — Continuidade do Engage aprovada  
**Escopo:** agressividade/passividade + percepção + perseguição + leash/reset  

---

## 1. Objetivo

Introduzir a primeira IA de movimento inimiga sem pathfinding complexo e sem alterar os sistemas já aprovados de targeting, Engage, perseguição do jogador, dash, dano, morte, respawn e telegraph.

O marco precisa provar quatro conceitos independentes:

1. inimigo passivo;
2. inimigo agressivo;
3. FOV/percepção do inimigo;
4. reset/leash medido a partir do ponto original de spawn.

---

## 2. Perfis do laboratório

Os Slimes foram alternados para permitir comparação direta no mesmo mapa:

- `slime-01`, `slime-03`, `slime-05`, `slime-07` → **agressivos**;
- `slime-02`, `slime-04`, `slime-06`, `slime-08` → **passivos**.

No M001.9, o comportamento passivo significa apenas:

> não percebe, não persegue e não inicia ataque automaticamente.

Retaliação de inimigo passivo após receber dano ainda **não foi definida** e fica fora deste marco.

---

## 3. Parâmetros provisórios

Valores exclusivamente de laboratório:

- `visionRange`: **420 px**;
- `attackRange`: **150 px** — preservado do telegraph aprovado;
- `resetRange`: **700 px**;
- velocidade de perseguição inimiga: **165 px/s**;
- velocidade de retorno no reset: **240 px/s**;
- distância de conclusão do retorno: **10 px**.

Esses números não representam balanceamento final.

---

## 4. FOV e aggro

O FOV serve **somente para adquirir o jogador inicialmente**.

Regra fundamental:

> sair do FOV do inimigo NÃO reseta a perseguição.

Depois que um agressivo percebe o jogador, ele mantém `aggro` e continua perseguindo enquanto a lógica de leash permitir.

No V0, o FOV é radial. Direção/cone de visão pode ser estudado quando os inimigos receberem as quatro direções visuais registradas para o projeto.

---

## 5. Attack Range

Ao entrar no `attackRange`, o inimigo deixa de avançar e utiliza o ataque já aprovado:

- área máxima: 150 px;
- wind-up: 1,00 s;
- telegraph vermelho/laranja crescente;
- dano: 0,5;
- Player HP: 1.

Se o jogador sair da área durante o wind-up, o ataque pode errar normalmente.

---

## 6. Leash / Reset Range

O `resetRange` é um raio centrado no **ponto original de spawn do inimigo**.

Ele é independente de:

- FOV;
- posição atual do jogador;
- FOV do personagem;
- attackRange.

Quando um inimigo em perseguição atinge o limite do leash:

1. cancela aggro;
2. interrompe ataque em andamento;
3. entra em estado `reset`;
4. torna-se invulnerável (`damageable=false`);
5. deixa temporariamente de ser targetável;
6. recupera imediatamente HP/recursos;
7. retorna ao spawn de origem;
8. ao chegar, volta a `idle`, targetável e vulnerável.

Durante o retorno ele continua sólido.

---

## 7. Inimigos sem reset

A arquitetura já possui `resetEnabled=false`.

Isso permitirá posteriormente perfis como:

- inimigo VIP que continua perseguindo enquanto o jogador permanecer no mapa;
- Boss de arena;
- eventos especiais;
- outros inimigos cuja lógica não usa leash convencional.

Nenhum Slime normal do laboratório usa essa exceção no M001.9; todos os Slimes agressivos padrão possuem leash.

---

## 8. Colisão e navegação

A perseguição inimiga usa footprint físico e respeita:

- limites do mapa;
- casas;
- árvores/troncos;
- cercas;
- água;
- rochas físicas;
- outras entidades sólidas.

Não existe pathfinding neste marco.

Portanto, um inimigo pode ficar bloqueado por geometria ou outro inimigo durante o chase. Isso é comportamento aceitável para IA V0 e será avaliado antes de qualquer solução de navegação mais complexa.

Durante o estado de reset, outras entidades são ignoradas na resolução de movimento para evitar que um grupo bloqueie o retorno, mas obstáculos estruturais do mapa continuam sendo respeitados.

---

## 9. Debug

Com `C`:

- footprint físico continua visível;
- FOV aparece como círculo azul/cinza;
- leash aparece como círculo roxo centrado no spawn;
- pequeno marcador acima da entidade comunica o estado geral.

O HUD do alvo também informa:

- `AGRESSIVO` ou `PASSIVO`;
- estado atual (`IDLE`, `CHASE`, `ATTACK`, `RESET`).

---

## 10. Fora do escopo

Não implementado agora:

- pathfinding;
- obstacle avoidance inteligente;
- quatro direções visuais dos inimigos;
- depth sorting definitivo;
- retaliação de inimigo passivo;
- grupos/assistência entre inimigos;
- visão direcional em cone;
- audição;
- patrol;
- Boss/VIP real;
- balanceamento final.

---

## 11. Critérios de validação

Testar principalmente:

1. aproximar-se de um Slime agressivo e confirmar aquisição + chase;
2. afastar-se para fora do FOV depois do aggro e confirmar que ele **não reseta por isso**;
3. puxar o agressivo até o limite de 700 px do spawn e confirmar reset;
4. confirmar invulnerabilidade/remoção de target durante retorno;
5. confirmar retorno ao spawn com HP completo;
6. aproximar-se de um Slime passivo e confirmar que ele não inicia perseguição/ataque;
7. usar `C` para comparar FOV e leash visualmente.

---

**Regra central do M001.9:**

> **FOV detecta. Attack Range permite atacar. Leash/Reset Range encerra a perseguição. São três sistemas independentes.**
