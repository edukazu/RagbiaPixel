# RAGBIA PIXEL — ESTADO ATUAL DO PROJETO E ROADMAP

**Nome provisório do projeto:** Ragbia Pixel  
**Data do checkpoint:** 15/08/2026  
**Baseline visual/original:** `Ragbia Pixel FULL HD V15.3`  
**Base visual de segurança:** `V12.1`  
**Runtime atual de desenvolvimento:** Phaser 4.2.1 + JavaScript  
**Último marco trabalhado:** `M001.11 — Estados Visuais e Leitura da IA V0`  
**Estado geral:** núcleo jogável de movimentação, targeting, combate e IA V0 funcional; apresentação, conteúdo e sistemas de RPG ainda em estágio inicial.

---

# 1. Objetivo deste documento

Este documento consolida o estado atual do **Ragbia Pixel** depois da transição do protótipo V15.3 para o primeiro núcleo real de jogo em Phaser.

Ele serve para:

- registrar o que já foi validado;
- registrar como os sistemas foram implementados;
- evitar reabrir decisões já testadas;
- diferenciar valores de laboratório de decisões definitivas;
- listar pendências conhecidas;
- posicionar o projeto no roadmap geral;
- permitir continuação segura em outro chat ou ciclo de desenvolvimento.

A regra permanece:

> **incremental → testável → validado → fechado → próximo sistema.**

---

# 2. Origem do projeto atual

O projeto parte oficialmente de:

> **Ragbia Pixel FULL HD V15.3**

A V15.3 fechou a direção visual e de animação que tornou o projeto viável:

- pixel art dentro do gameplay;
- personagens compactos;
- quatro direções visuais reais;
- caminhada econômica com três fases;
- Guerreiro e Arqueiro como classes de laboratório;
- armas não permanentes no sprite base;
- ataque desacoplado do corpo;
- efeitos responsáveis por parte importante da sensação de combate;
- projéteis independentes depois de liberados;
- suporte a teclado e gamepad.

A V12.1 continua sendo a referência visual de segurança para:

- corpo;
- proporções;
- quatro direções;
- caminhada;
- consistência visual dos personagens.

A V15.3 continua preservada como referência e não deve ser substituída por versões intermediárias do laboratório atual.

---

# 3. Decisão tecnológica

## 3.1. Regra code-first

Foi definida uma regra importante para o desenvolvimento:

> **Não depender de ferramentas externas que exijam ajustes manuais do usuário.**

O fluxo deve usar:

- código;
- scripts;
- ferramentas que possam ser operadas diretamente;
- arquivos que possam ser gerados/modificados programaticamente.

Evitar como dependência normal:

- editor visual de mapas;
- editor manual de colisões;
- composição obrigatória por drag-and-drop;
- etapas em que o usuário precise corrigir manualmente uma cena para que o build funcione.

---

## 3.2. Phaser

Foi realizado um laboratório de transporte da V15.3 para Phaser.

O teste validou:

- movimentação;
- ataques;
- sprites;
- gamepad;
- câmera;
- mundo maior que a tela.

Com isso, **Phaser 4** foi aprovado como runtime do projeto no estágio atual.

Versão utilizada/fixada no laboratório:

> **Phaser 4.2.1**

O projeto continua em JavaScript.

---

# 4. Filosofia dos mapas

A direção de mapas foi refinada durante o M001.

O mapa atual é um **Mapa Beta técnico**, suficiente para desenvolvimento de sistemas, mas **não representa a qualidade artística final desejada**.

A pipeline futura aprovada é:

> **referência visual de alta qualidade → mapa ilustrado-base → tratamento/tradução pixelada → camada visual jogável**

Isso significa que:

- não pretendemos construir o mundo final exclusivamente como tilemap tradicional;
- referências ilustradas de alta qualidade serão usadas para composição;
- o resultado jogável continuará coerente com pixel art;
- a arte visual e a lógica física do mapa permanecem separadas.

Foram fornecidas referências visuais de:

- campo/exterior;
- interior de casa.

Essas referências representam melhor a meta de riqueza visual futura do que o mapa beta atual.

---

# 5. Mapa Beta 01 atual

O Mapa Beta 01 cumpriu seu objetivo técnico.

## Dimensões

- mundo: **4608 × 2688 px**
- desenho lógico pixelado: **1152 × 672**
- escala: **4× nearest-neighbor**
- resolução de apresentação de referência: **1920 × 1080**

O mapa já permite:

- câmera seguindo o personagem;
- navegação em mundo maior que a tela;
- colisões;
- posicionamento de entidades;
- targeting;
- combate;
- IA;
- testes de leash/reset.

O mapa atual foi aprovado como:

> **cenário beta provisório para desenvolvimento de sistemas**

Não deve ser confundido com arte final.

---

# 6. Separação entre arte e lógica

Uma decisão arquitetural importante foi fechada:

> **A arte do mapa não é a colisão do mapa.**

A camada visual pode ser substituída ou redesenhada sem obrigar a reescrever a lógica do mundo.

Exemplo conceitual:

```text
CAMADA VISUAL
mapa pixelado / mapa ilustrado tratado

CAMADA LÓGICA
colisões
spawns
entidades
triggers
FOV
leash
interações
```

Essa separação será fundamental quando a pipeline de mapas ilustrados for aprofundada.

---

# 7. Linha do tempo do M001

## S001 — Gate Phaser

Objetivo:

- transportar uma fatia pequena da V15.3;
- comparar movimento e ataques;
- decidir se Phaser era viável.

Resultado:

> **APROVADO**

---

## M001.1 — Mapa Beta + Câmera

### M001.1A

Validação de:

- mundo maior;
- escala;
- câmera seguindo o personagem.

Resultado:

> escala e câmera aprovadas.

### M001.1B — Paridade Visual

Restaurados/validados:

- Guerreiro;
- Arqueiro;
- Slimes;
- quatro direções;
- caminhada;
- espada;
- arco;
- flecha;
- movimentação;
- ataques.

Resultado:

> paridade funcional suficiente aprovada.

### M001.1C — Tratamento Visual do Mapa

Mapa passou a usar pixelização coerente em malha lógica ampliada 4×.

Resultado:

> Mapa Beta 01 aprovado como cenário provisório.

---

## M001.2 — Colisão V0

Foi criada uma camada lógica de colisão independente da arte.

Validado:

- limites do mundo;
- casas;
- cercas;
- troncos;
- água;
- ponte;
- rochas maiores;
- ruínas.

Regras refinadas depois do teste:

- **pedrinhas decorativas não bloqueiam**;
- **plaquinhas decorativas não bloqueiam**;
- rochas relevantes/maiores bloqueiam;
- cercas bloqueiam;
- casas bloqueiam;
- troncos bloqueiam.

O jogador usa um pequeno footprint na região dos pés.

Movimento usa resolução por eixo/micropassos, permitindo deslizar por obstáculos.

Resultado:

> **APROVADO**

---

## M001.3 — Entidades + Targeting

### M001.3 — Targeting V0

Introduziu:

- entidades lógicas;
- inimigos targetáveis;
- seleção;
- ciclo;
- limpeza de alvo.

Resultado:

> seleção e ciclo naturais em teclado e gamepad.

### M001.3A — Soft Target + Engage

Primeiro sistema de targeting próprio do Ragbia.

Regras:

#### Soft Target

`Tab / RB`

- trabalha com os **2 inimigos válidos mais próximos**.

#### Targeting amplo

`Shift+Tab / LB+RB`

- percorre todos os inimigos válidos dentro do campo de visão da classe.

#### Engage

`Espaço / RT`

- sem alvo: tenta adquirir Soft Target;
- com alvo: engaja;
- segurado: mantém auto-ataque;
- solto: interrompe novas repetições, mas mantém o alvo.

#### Ataque sem alvo

> **não é permitido.**

#### Facing lock

Enquanto houver alvo:

- personagem mantém a direção visual voltada para o alvo;
- movimento continua livre;
- é possível strafe/recuo mantendo o inimigo encarado.

#### Indicador

- anel vermelho;
- abaixo/atrás do sprite inimigo;
- sem losango superior.

Resultado:

> **APROVADO**

---

## M001.3B — FOV + Attack Range

Foi fechada uma separação estrutural:

> **enxergar/selecionar ≠ estar ao alcance para atacar**

Valores atuais de laboratório:

### Guerreiro

- FOV/vision range: **500 px**
- attack range: **130 px**

### Arqueiro

- FOV/vision range: **650 px**
- attack range: **520 px**

Soft Target também passou a respeitar o FOV.

Resultado:

> **APROVADO**

---

## M001.3C — Colisão com Entidades

Inimigos vivos passaram a ocupar espaço físico.

### Player

- collision radius: **20 px**
- collision offset Y: **28 px**

### Slime

- collision radius: **30 px**
- collision offset Y: **22 px**

Regras:

- jogador não atravessa inimigo vivo;
- footprint é menor que o sprite;
- é possível contornar/deslizar pela entidade;
- inimigo morto deixa de bloquear.

Resultado:

> **APROVADO**

---

# 8. Pendências visuais de profundidade

Durante os testes de colisão com entidades foram registradas pendências futuras.

## 8.1. Direções dos inimigos

Inimigos deverão futuramente possuir estados visuais direcionais equivalentes à lógica do personagem:

- Norte;
- Sul;
- Leste;
- Oeste.

A animação visual dos inimigos ainda não está no mesmo nível direcional dos personagens.

---

## 8.2. Depth sorting por eixo Y

A ordem visual entre entidades deverá ser dinâmica.

Regra:

> **quem está mais ao sul/mais abaixo na tela aparece na frente.**

Exemplo:

- inimigo ao norte;
- personagem ao sul;

Resultado correto:

> personagem aparece na frente do inimigo.

O inverso vale quando o inimigo estiver mais ao sul.

A referência correta deverá considerar principalmente a região dos pés/footprint, não o topo do sprite.

---

## 8.3. Cenário

O mesmo sistema deverá ser compatível com:

- copas de árvores;
- paredes;
- telhados;
- objetos altos;
- outras oclusões.

Pendência já observada:

> atualmente o personagem pode aparecer na frente da copa de uma árvore quando deveria ficar parcialmente oculto.

---

# 9. M001.4 — Combate V0

Foi criada a menor escala numérica possível para validar lógica.

## Escala base

### Player

- HP: **1**
- ATK: **1**

### Slime padrão

- HP: **1**
- ATK: **0,5**

Esses valores são **de laboratório**, não balanceamento.

---

## Dano

### Guerreiro

Dano acontece no instante real de impacto do golpe melee.

### Arqueiro

Dano acontece somente quando:

> **a flecha/projétil realmente alcança o inimigo.**

---

## Morte lógica

Quando HP chega a zero:

- `alive = false`;
- deixa de ser targetável;
- deixa de ser sólido;
- alvo deixa de ser válido.

Resultado:

> **APROVADO**

---

# 10. M001.4A — Morte, Respawn e Feedback

Foram adicionados:

- número de dano amarelo;
- animação simples de morte;
- squash/fade;
- remoção imediata da colisão lógica;
- respawn de laboratório após **3 segundos**.

Resultado:

- morte aprovada;
- dano aprovado;
- liberação de colisão aprovada;
- respawn aprovado.

---

# 11. M001.4B — Impacto de Ataque V1

O feedback inicial era pouco perceptível e foi reforçado.

## Guerreiro

- hit-stop: **72 ms**
- flash forte;
- burst pixelado;
- knock visual até **18 px**
- shake de câmera mais perceptível.

## Arqueiro

- hit-stop: **46 ms**
- flash mais curto;
- burst menor;
- knock visual até **11 px**
- shake menor.

O knock atual é:

> **somente visual**

Não altera:

- posição lógica;
- colisão;
- targeting.

Resultado:

> **IMPACTO APROVADO**

---

# 12. M001.5 — Ataque Inimigo V0

Primeiro dano vindo do inimigo.

Escala:

- Player HP 1;
- Slime ATK 0,5.

Portanto:

> dois golpes completos derrotam o Player.

O ataque inicial foi funcional, mas a leitura foi refinada no marco seguinte.

---

# 13. M001.5A — Telegraph Inimigo V1

Baseline atual do ataque de laboratório do Slime:

- attack range: **150 px**
- wind-up: **1,00 s**
- cooldown: **1,60 s**
- dano: **0,5**

O telegraph:

- começa pequeno;
- área vermelho/laranja cresce progressivamente;
- alcança o raio completo exatamente no instante do golpe;
- sair da área antes do hit evita dano.

O comportamento foi aprovado como excelente baseline de teste.

Importante:

> ainda não representa balanceamento final.

Quando a esquiva estiver sendo balanceada por classe, a velocidade desse ataque poderá ser reavaliada.

---

# 14. M001.6 — Dash / Esquiva V0

A esquiva foi aprovada.

## Controle

- teclado: **Shift**
- gamepad: **B**

## Baseline de laboratório

- cargas: **1**
- cooldown: **1,5 s**
- distância: **140 px**
- duração: **180 ms**
- i-frame: **120 ms**

Guerreiro e Arqueiro usam os mesmos valores somente no laboratório.

A arquitetura deve permitir futuramente:

- número diferente de cargas;
- cooldown diferente;
- distância diferente;
- i-frame diferente;
- comportamento específico por classe.

---

## Direção da esquiva

O dash usa:

> **intenção de movimento**

e não o facing lock do alvo.

Durante o dash:

- direção visual assume a direção da esquiva;
- Soft Target continua selecionado;
- Engage não é cancelado;
- novo ataque não inicia;
- ao terminar, facing lock retorna ao alvo.

---

## Colisão

Dash não atravessa:

- casas;
- árvores;
- pedras físicas;
- cercas;
- água;
- inimigos.

---

## Flip visual

A animação reutiliza os sprites existentes.

### Leste/Oeste

Flip por compressão horizontal:

`scaleX: 1 → 0 → -1 → 0 → 1`

Leitura:

> giro de moeda ao redor do eixo vertical.

### Norte/Sul

Flip por compressão vertical:

`scaleY: 1 → 0 → -1 → 0 → 1`

A transformação não muda hitbox ou posição lógica.

Também existem:

- afterimage;
- poeira curta.

Resultado:

> **APROVADO**

---

# 15. M001.7 — Perseguição durante Engage

Quando:

- Engage está segurado;
- existe alvo;
- alvo está fora do attackRange;

o personagem passa a persegui-lo automaticamente.

Ao entrar no alcance:

- chase para;
- ataque começa.

Sem pathfinding.

Portanto:

> obstáculos podem bloquear a perseguição.

Esse bloqueio é considerado normal neste estágio.

---

# 16. M001.7A — Manual Override

Foi corrigida a prioridade de movimento.

Regra oficial atual:

> **Dash > movimento manual > perseguição automática**

Enquanto Engage estiver segurado:

- input manual assume imediatamente;
- Soft Target não é perdido;
- Engage não é cancelado;
- facing lock continua no alvo;
- ao soltar a direção manual, chase reassume automaticamente.

Isso permite:

> CHASE → obstáculo → jogador contorna manualmente → solta direção → CHASE continua.

Resultado:

> **APROVADO**

---

# 17. M001.8 — Continuidade do Engage

Enquanto `Espaço/RT` continuar segurado:

1. alvo atual morre;
2. alvo é invalidado;
3. sistema procura novo Soft Target válido;
4. novo alvo é selecionado;
5. chase continua se necessário;
6. ataque continua ao entrar no alcance.

A continuidade usa a mesma regra:

> até os 2 inimigos válidos mais próximos dentro do FOV.

Se não houver novo alvo naquele instante:

- Engage pode ficar aguardando;
- quando surgir alvo válido no FOV, pode readquirir.

### Cancelamento

`Esc / LT`

- limpa alvo;
- cancela ataque;
- cancela perseguição;
- cancela continuidade;
- não readquire imediatamente enquanto o mesmo Engage físico continuar segurado.

Resultado:

> **APROVADO**

---

# 18. M001.9 — IA de Movimento Inimigo V0

Foram introduzidos:

- inimigos agressivos;
- inimigos passivos;
- FOV inimigo;
- perseguição inimiga;
- attack range;
- leash/reset.

---

## 18.1. Conceitos independentes

A regra central é:

> **FOV detecta. Attack Range permite atacar. Leash encerra a perseguição.**

São sistemas separados.

---

## 18.2. Valores atuais de laboratório

- enemy vision range: **420 px**
- enemy attack range: **150 px**
- reset/leash range: **700 px**
- chase speed: **165 px/s**
- reset return speed: **240 px/s**

Não são valores finais.

---

## 18.3. Agressivo

Inimigo agressivo:

1. detecta jogador pelo FOV;
2. entra em aggro;
3. persegue;
4. entra em attack range;
5. usa telegraph;
6. ataca.

Regra importante:

> **sair do FOV depois do aggro NÃO causa reset.**

---

## 18.4. Leash / Reset

O leash é medido a partir:

> **do ponto original de spawn do inimigo.**

Ao atingir o limite:

1. cancela aggro;
2. cancela ataque;
3. entra em RESET;
4. fica invulnerável;
5. deixa de ser targetável;
6. recupera HP/recursos imediatamente;
7. retorna ao spawn;
8. ao chegar volta ao estado normal.

O retorno continua respeitando obstáculos estruturais do cenário.

---

## 18.5. Inimigos sem reset

A arquitetura prevê:

`resetEnabled = false`

Uso futuro:

- VIP;
- Boss de arena;
- eventos especiais;
- inimigo que persegue até o jogador sair do mapa;
- outros comportamentos especiais.

---

## 18.6. FIX1 — distância física

Foi corrigida uma inconsistência:

- chase usava centro do sprite;
- ataque usava footprints.

Agora ambos usam:

> **footprint → footprint**

Isso garante que o inimigo realmente alcance o attackRange antes de parar.

Resultado:

> **APROVADO**

---

# 19. M001.10 — Passivo Reativo V0

Regra aprovada:

> **Passivo não inicia combate sozinho. Ao receber dano e sobreviver, funciona como agressivo até resetar.**

Fluxo:

```text
PASSIVO / IDLE
    ↓ recebe dano
AGGRO
    ↓
CHASE
    ↓
ATTACK
    ↓
LEASH
    ↓
RESET
    ↓
retorna ao spawn
    ↓
PASSIVO / IDLE
```

Ser atacado gera aggro:

> independentemente do FOV.

Depois de provocado:

- sair do FOV não encerra aggro;
- usa o mesmo attackRange;
- usa o mesmo leash;
- usa o mesmo reset.

Ao resetar:

- recupera recursos;
- volta ao spawn;
- volta a ser passivo.

### Slime de teste

`SLIME-02`

- HP: **2**
- ATK: **0,5**

O HP 2 existe apenas para permitir observar a reação ao primeiro golpe.

Resultado:

> **APROVADO**

---

# 20. M001.11 — Estados Visuais da IA V0

Foi criada uma camada visual para tornar os estados internos da IA legíveis durante desenvolvimento:

- IDLE;
- AGGRO/CHASE;
- ATTACK;
- RESET.

Ela foi útil para validar comportamento.

## REGRA IMPORTANTE

> **Essa camada é SOMENTE de laboratório/debug.**

Na versão final:

- o jogador não deve saber antecipadamente se o inimigo é passivo ou agressivo;
- FOV não deve ser revelado;
- leash não deve ser revelado;
- estados internos não devem ser exibidos como metadados;
- descobrir o comportamento do inimigo faz parte da experiência.

Podem existir na apresentação final apenas feedbacks diegéticos/visuais que representem ações percebidas, como:

- telegraph de ataque;
- reação ao dano;
- animação de reset/retorno, se fizer sentido.

Nunca:

> `PASSIVO`, `AGRESSIVO`, `FOV`, `LEASH`, `RESET` como informação técnica antecipada ao jogador.

Portanto:

**M001.11 deve ser tratado como overlay/debug de desenvolvimento, não como direção de HUD.**

---

# 21. Controles atuais de laboratório

## Movimento

### Teclado

- WASD / Setas

### Gamepad

- Analógico esquerdo / D-pad

---

## Soft Target

- `Tab`
- `RB`

Alterna entre os dois inimigos válidos mais próximos dentro do FOV da classe.

---

## Targeting amplo

- `Shift + Tab`
- `LB + RB`

Percorre todos os alvos válidos dentro do campo de visão da classe.

---

## Engage

- `Espaço`
- `RT`

Seleciona alvo se necessário, persegue e mantém auto-ataque enquanto segurado.

---

## Cancelamento

- `Esc`
- `LT`

Observação:

Em navegador/fullscreen, `Esc` também pode ser capturado pelo próprio navegador para sair de tela cheia. Fora de fullscreen funciona como esperado.

---

## Dash

- `Shift`
- `B`

Existe uma pequena lógica de distinção para não conflitar com `Shift+Tab`.

---

## Troca de classe de laboratório

Permanece apenas como ferramenta de teste entre Guerreiro e Arqueiro.

Não representa sistema final de troca de classe durante gameplay.

---

# 22. Estado atual do combate

Hoje já é possível executar o ciclo:

```text
movimentar
↓
detectar/selecionar inimigo
↓
Soft Target
↓
Engage
↓
perseguição automática
↓
override manual se necessário
↓
entrar no attackRange
↓
ataque
↓
impacto
↓
dano
↓
morte
↓
remoção de colisão
↓
continuidade automática para outro alvo
```

Do lado inimigo:

```text
IDLE
↓
detecção por FOV ou provocação
↓
AGGRO
↓
CHASE
↓
ATTACK RANGE
↓
TELEGRAPH
↓
ATAQUE
↓
DANO NO PLAYER
```

e:

```text
CHASE
↓
LEASH
↓
RESET
↓
invulnerável
↓
recupera recursos
↓
retorna ao spawn
↓
IDLE
```

Esse é o núcleo funcional mais importante construído até agora.

---

# 23. Sistemas atualmente aprovados

## Visual/base

- pixel art em gameplay;
- quatro direções dos personagens;
- três fases simples de caminhada;
- Guerreiro;
- Arqueiro;
- armas temporárias;
- projétil independente;
- mapa beta pixelado provisório;
- câmera.

## Controle

- teclado;
- gamepad;
- Soft Target;
- targeting amplo;
- facing lock;
- Engage;
- Dash;
- manual override;
- perseguição;
- continuidade de alvo.

## Física

- colisão com cenário;
- footprints;
- colisão com inimigos vivos;
- liberação da colisão na morte;
- Dash respeitando colisões.

## Combate

- HP;
- ATK;
- attackRange;
- dano melee;
- projétil causando dano no contato;
- feedback amarelo;
- impacto V1;
- morte;
- respawn;
- ataque inimigo;
- telegraph;
- i-frame.

## IA

- passivo;
- agressivo;
- reação do passivo após dano;
- FOV;
- aggro persistente fora do FOV;
- chase;
- attack range;
- leash;
- reset;
- invulnerabilidade durante reset;
- recuperação de recursos;
- retorno ao spawn;
- suporte estrutural a inimigo sem reset.

---

# 24. Valores de laboratório atuais

## Player geral

- HP: **1**
- ATK: **1**

## Guerreiro

- vision range: **500 px**
- attack range: **130 px**

## Arqueiro

- vision range: **650 px**
- attack range: **520 px**

## Dash

- charges: **1**
- cooldown: **1,5 s**
- distance: **140 px**
- duration: **180 ms**
- i-frame: **120 ms**

## Slime padrão

- HP: **1**
- ATK: **0,5**

## Slime passivo de teste

- HP: **2**
- ATK: **0,5**

## Ataque Slime

- attack range: **150 px**
- wind-up: **1,00 s**
- cooldown: **1,60 s**

## IA Slime agressivo

- vision range: **420 px**
- reset range: **700 px**
- chase speed: **165 px/s**
- reset return speed: **240 px/s**

## Respawn de laboratório

- inimigos: **3 s**
- Player: **3 s**

## Impacto

### Guerreiro

- hit-stop: **72 ms**
- knock visual máximo: **18 px**

### Arqueiro

- hit-stop: **46 ms**
- knock visual máximo: **11 px**

---

# 25. Valores NÃO são balanceamento

Todos os números anteriores são:

> **escala de laboratório**

O objetivo atual é:

- conseguir perceber erros;
- validar estados;
- testar relações;
- testar controle;
- comparar classes;
- provar arquitetura.

Não iniciar balanceamento detalhado ainda.

Exemplos de coisas propositalmente abertas:

- HP real de classes;
- dano final;
- velocidade de ataque;
- cooldowns definitivos;
- FOV definitivo;
- geometria definitiva do FOV;
- attack ranges;
- velocidade dos inimigos;
- leash;
- quantidade de cargas de esquiva;
- cooldown de esquiva por classe.

---

# 26. Pendências técnicas conhecidas

## 26.1. Pathfinding

Não existe.

Tanto Player em chase automático quanto inimigos podem:

- encontrar um obstáculo;
- ficar bloqueados.

Para o Player isso foi mitigado com:

> **Dash > movimento manual > chase**

O usuário pode contornar e deixar o chase reassumir.

Ainda não foi decidido se o jogo exigirá:

- pathfinding;
- steering local;
- obstacle avoidance;
- ou se o controle atual já será suficiente em muitos contextos.

---

## 26.2. Inimigos direcionais

Ainda precisam receber:

- Norte;
- Sul;
- Leste;
- Oeste;
- animação de caminhada correspondente.

---

## 26.3. Depth sorting

Ainda precisa ser implementado de forma definitiva entre:

- Player;
- inimigos;
- NPCs futuros;
- objetos do cenário.

---

## 26.4. Oclusão do mapa

Copas de árvores e outros objetos altos ainda precisam de regra adequada para:

- personagem passar na frente;
- personagem passar atrás;
- ocultação parcial.

---

## 26.5. Arte do mapa

O mapa atual é funcional, mas ainda há grande margem de qualidade.

A direção final deve usar:

> **mapas ilustrados de alta qualidade como base para tradução pixelada**

Não continuar polindo o mapa beta sem necessidade de gameplay.

---

## 26.6. Debug vs versão final

Devem permanecer exclusivos do desenvolvimento:

- FOV visível;
- leash visível;
- identificação passivo/agressivo;
- estado textual da IA;
- hitboxes;
- colliders;
- outros metadados internos.

A experiência final deve permitir que o jogador **descubra o comportamento** do inimigo.

---

# 27. Sistemas ainda não iniciados ou não fechados

Ainda não existe uma implementação real/final de:

- sistema geral de atributos;
- defesa;
- armadura;
- crítico;
- elementos;
- resistências;
- status;
- mana/recursos de classe;
- framework de habilidades;
- múltiplas habilidades por classe;
- equipamentos;
- inventário;
- loot;
- XP;
- níveis;
- progressão;
- NPCs reais;
- diálogos;
- quests;
- transições entre mapas;
- interiores reais;
- save/load;
- economia;
- lojas;
- UI final;
- menus;
- HUD final;
- conteúdo real;
- bosses reais;
- VIPs reais;
- grupos de inimigos;
- threat table;
- assistência/aggro social;
- patrol;
- audição;
- line-of-sight;
- pathfinding;
- conteúdo narrativo no runtime atual.

---

# 28. Roadmap oficial original

O documento-base V15.3 propôs a seguinte ordem geral:

1. estrutura do projeto;
2. runtime principal;
3. sistema de entidades;
4. player;
5. movimento;
6. gamepad;
7. colisões;
8. ataques;
9. hitboxes;
10. inimigos;
11. atributos;
12. vida/dano;
13. habilidades;
14. mapas;
15. transições entre mapas;
16. NPCs;
17. inventário/equipamentos;
18. progressão;
19. interface;
20. conteúdo.

Essa lista era uma direção macro, não um contrato rígido.

O desenvolvimento real avançou de forma incremental e acabou validando alguns sistemas futuros antes de outros porque eram necessários para provar o combate.

---

# 29. Onde estamos no roadmap

## 1. Estrutura do projeto

**PARCIAL**

Existe uma arquitetura de laboratório organizada e modularizada progressivamente.

Ainda falta consolidar tudo em uma base única limpa de produção/repositório, removendo o histórico de builds intermediários do caminho principal.

---

## 2. Runtime principal

**APROVADO V0**

Phaser 4 aprovado.

---

## 3. Sistema de entidades

**APROVADO V0**

Entidades possuem:

- estado;
- colisão;
- targetability;
- vida;
- comportamento;
- spawn;
- IA básica.

---

## 4. Player

**APROVADO V0**

---

## 5. Movimento

**APROVADO**

Inclui:

- quatro direções;
- caminhada;
- facing lock;
- movimento manual;
- chase;
- dash.

---

## 6. Gamepad

**APROVADO V0**

Usado desde os testes iniciais e integrado ao targeting/combate.

---

## 7. Colisões

**APROVADO V0**

Cenário + entidades.

Ainda haverá refinamentos.

---

## 8. Ataques

**APROVADO V0**

Melee + ranged.

---

## 9. Hitboxes / Ranges

**APROVADO V0 / PARCIAL**

Existem:

- footprints;
- attack ranges;
- telegraph;
- projétil;
- contato.

Ainda não existe um framework amplo para todos os formatos futuros de skill/hitbox.

---

## 10. Inimigos

**APROVADO V0**

Já existem:

- passivo;
- agressivo;
- FOV;
- chase;
- ataque;
- leash;
- reset;
- reação a dano.

---

## 11. Atributos

**INICIADO APENAS COMO ESCALA MÍNIMA**

Hoje existem parâmetros como:

- HP;
- ATK;
- ranges;
- velocidades;
- cooldowns.

Não existe ainda o sistema real de atributos do RPG.

---

## 12. Vida / Dano

**APROVADO V0**

Inclui:

- HP;
- dano;
- morte;
- respawn;
- feedback;
- invulnerabilidade de reset;
- i-frame.

---

## 13. Habilidades

**INICIADO**

Dash/Esquiva é a primeira mecânica equivalente a uma habilidade/mobilidade.

Ainda não existe framework real de skills.

---

## 14. Mapas

**BETA TÉCNICO APROVADO**

Mapa real/final ainda não iniciado.

Pipeline ilustrado → pixelado ainda precisa ser formalizada e testada com conteúdo real.

---

## 15. Transições entre mapas

**NÃO INICIADO**

---

## 16. NPCs

**NÃO INICIADO**

---

## 17. Inventário / Equipamentos

**NÃO INICIADO**

---

## 18. Progressão

**NÃO INICIADO**

---

## 19. Interface

**SOMENTE LABORATÓRIO / DEBUG**

Não existe UI final.

---

## 20. Conteúdo

**NÃO INICIADO**

O mapa, Slimes, Guerreiro e Arqueiro atuais são conteúdo de laboratório.

---

# 30. Interpretação do estágio atual

O projeto já deixou de ser apenas:

> **prova visual**

e também já deixou de ser apenas:

> **prova de tecnologia**

Hoje existe um **núcleo jogável de action-RPG** com:

- mundo;
- movimento;
- gamepad;
- targeting próprio;
- Engage;
- perseguição;
- dash;
- colisões;
- combate;
- inimigos;
- IA básica;
- telegraphs;
- morte/reset/respawn.

Porém ainda estamos antes do estágio de:

> **RPG completo / conteúdo real**

A maior parte do trabalho realizado até aqui pertence à:

# FUNDAÇÃO DE GAMEPLAY

---

# 31. Situação do ciclo M001

O M001 começou com o objetivo de:

> ampliar o protótipo V15.3 para um Mapa Beta e iniciar colisão + targeting.

Durante a validação incremental, ele naturalmente cresceu e fechou também:

- combate;
- ataque inimigo;
- esquiva;
- perseguição;
- continuidade;
- IA básica;
- passivos/agressivos;
- leash/reset.

Portanto, o M001 hoje representa na prática:

> **Primeiro Núcleo Jogável / Foundation Combat Slice**

Ele já cumpriu muito mais do que o escopo inicial.

---

# 32. Recomendação de checkpoint

Antes de continuar adicionando muitos sistemas novos, é recomendável considerar um marco de consolidação.

Sugestão:

> **M001.12 — Consolidação / Auditoria do Núcleo V0**

Objetivos possíveis:

1. unificar o build aprovado atual;
2. remover código morto/intermediário;
3. conferir regressões;
4. registrar controles definitivos de laboratório;
5. confirmar todos os estados;
6. garantir que debug possa ser ligado/desligado;
7. separar claramente parâmetros de laboratório;
8. revisar arquitetura dos módulos;
9. congelar um ZIP/base oficial pós-V15.3;
10. decidir o início do próximo ciclo.

Essa recomendação **não é ainda uma decisão fechada**. Serve como proposta para evitar que uma sequência longa de patches se transforme em dívida técnica antes do próximo grande bloco.

---

# 33. Possível início do próximo grande ciclo

Depois de consolidar o núcleo, há três direções naturais.

## Opção A — Sistemas de RPG

- atributos;
- recursos;
- classes;
- habilidades;
- defesa;
- status.

## Opção B — Mundo real

- primeiro mapa real;
- pipeline ilustrado → pixelado;
- transições;
- interiores;
- NPCs.

## Opção C — IA/combate mais profundo

- inimigos direcionais;
- depth sorting;
- pathfinding/steering;
- novas famílias de ataque;
- comportamento em grupo;
- novos inimigos.

A escolha deve continuar seguindo a filosofia:

> implementar apenas o próximo sistema que produz uma validação útil do jogo.

---

# 34. Pendências de design já registradas para o futuro

- inimigos com quatro direções;
- depth sorting por Y;
- oclusão de copas;
- dash com cargas/cooldown próprios por classe;
- FOV específico por classe/personagem;
- FOV inimigo potencialmente direcional no futuro;
- inimigos sem reset;
- VIP;
- Boss de arena;
- mapas ilustrados de alta qualidade como base;
- UI sem revelar comportamento interno do inimigo;
- preservar descoberta de agressividade/passividade como parte da experiência;
- possível revisão da velocidade do ataque inimigo quando a esquiva for balanceada.

---

# 35. Princípios que NÃO devem ser reabertos sem motivo

## Arte

- pixel art no gameplay;
- mapas finais derivados de direção ilustrada/pixelada;
- quatro direções reais;
- animação econômica;
- assets próprios.

## Armas

- não precisam permanecer desenhadas no sprite base;
- podem ser temporárias.

## Combate

- efeito vende impacto;
- arma vende trajetória;
- projétil ranged torna-se independente;
- ataques exigem alvo na arquitetura atual de combate;
- Soft Target é parte da identidade do controle;
- Engage é segurado;
- soltar Engage não limpa o alvo.

## Controle

- gamepad é prioridade real;
- facing lock no alvo;
- Dash usa intenção de movimento;
- hierarquia:
  **Dash > manual > chase**

## Desenvolvimento

- code-first;
- sem dependência de editor manual;
- incremental;
- build jogável após mudanças relevantes;
- testar antes de expandir.

---

# 36. Baseline conceitual atual

A arquitetura funcional atual pode ser resumida assim:

```text
MAPA VISUAL
    ↓
CAMADA LÓGICA DE COLISÃO
    ↓
PLAYER + ENTIDADES
    ↓
SOFT TARGET
    ↓
ENGAGE
    ↓
CHASE / MANUAL OVERRIDE / DASH
    ↓
ATTACK RANGE
    ↓
ATAQUE
    ↓
IMPACTO / DANO
    ↓
MORTE / RESPAWN / CONTINUIDADE

INIMIGO
    ↓
PASSIVO ou AGRESSIVO
    ↓
FOV / PROVOCAÇÃO
    ↓
AGGRO
    ↓
CHASE
    ↓
ATTACK RANGE
    ↓
TELEGRAPH
    ↓
ATAQUE
    ↓
LEASH
    ↓
RESET
    ↓
SPAWN
```

---

# 37. Estado final deste checkpoint

## BASE ORIGINAL

> **Ragbia Pixel FULL HD V15.3**

## BASE VISUAL DE SEGURANÇA

> **V12.1**

## TECNOLOGIA ATUAL

> **Phaser 4.2.1 + JavaScript**

## MAPA

> **Mapa Beta 01 aprovado para desenvolvimento, não final**

## GAMEPLAY

> **núcleo de movimento + targeting + combate + IA V0 funcional**

## ÚLTIMO MARCO

> **M001.11 — Estados Visuais e Leitura da IA V0**

com a ressalva:

> **indicadores internos da IA são debug-only e não fazem parte da experiência final.**

## POSIÇÃO NO ROADMAP

> **Fundação de gameplay avançada; ainda antes dos sistemas completos de RPG, conteúdo real, NPCs, progressão e UI final.**

---

# 38. Instrução para continuidade

Ao continuar o projeto:

1. não reabrir decisões já validadas sem um problema concreto;
2. preservar V15.3 como referência;
3. usar o build atual como evolução funcional;
4. diferenciar claramente debug de experiência final;
5. não tratar valores atuais como balanceamento;
6. manter code-first;
7. continuar com marcos pequenos e jogáveis;
8. preferir consolidar antes de expandir demais o próximo ciclo.

---

**FIM DO CHECKPOINT — RAGBIA PIXEL / 15-08-2026**
