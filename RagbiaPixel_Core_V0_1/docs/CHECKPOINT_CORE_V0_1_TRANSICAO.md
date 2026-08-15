# RAGBIA PIXEL — CHECKPOINT DE TRANSIÇÃO — CORE V0.1

**Data:** 15/08/2026  
**Baseline funcional atual:** **Ragbia Pixel CORE V0.1**  
**Fechamento:** **M001.12 — Consolidação / Auditoria do Núcleo V0**  
**Runtime:** Phaser 4.2.1 + JavaScript  
**Baseline original preservada:** Ragbia Pixel FULL HD V15.3  
**Base visual de segurança:** V12.1

---

# 1. Como iniciar em outro chat

Enviar:

1. `RagbiaPixel_Core_V0_1.zip`
2. este arquivo `RAGBIA_PIXEL_CHECKPOINT_CORE_V0_1_TRANSICAO.md`

Informar:

> **“Este CORE V0.1 é a baseline funcional atual do Ragbia Pixel. A V15.3 permanece como referência visual/original dentro do pacote. Não reabrir decisões já fechadas; continuar a partir deste checkpoint.”**

O ZIP já contém V15.3, histórico M001 e referências visuais; não é necessário transportar todos os patches intermediários.

---

# 2. Identidade atual do projeto

Ragbia Pixel é um action-RPG 2D em pixel art com:

- desenvolvimento incremental;
- baixo custo de animação;
- gamepad como prioridade;
- targeting próprio;
- combate legível;
- mapas futuros derivados de referências/ilustrações de alta qualidade;
- fluxo code-first sem dependência normal de editores manuais.

O projeto já possui fundação jogável, mas ainda não possui RPG completo, conteúdo real ou apresentação final.

---

# 3. Regras visuais já fechadas

- pixel art no gameplay;
- personagens compactos;
- quatro direções visuais reais;
- três fases simples de caminhada;
- não fabricar direções por rotação/inclinação artificial;
- armas não precisam permanecer no sprite;
- Guerreiro: espada temporária + slash;
- Arqueiro: arco temporário + flecha independente após disparo;
- efeitos carregam parte importante da sensação;
- simplicidade de animação é uma vantagem.

**V15.3** permanece como referência original.  
**V12.1** permanece como segurança visual.

---

# 4. Tecnologia

Baseline atual:

- Phaser 4.2.1;
- JavaScript;
- Canvas 2D;
- referência FULL HD 1920×1080;
- mundo maior com câmera.

Regra:

> usar código/scripts ou ferramentas operáveis diretamente; não tornar editor visual manual uma dependência.

---

# 5. Mapa

Mapa Beta atual:

- mundo 4608×2688;
- arte lógica 1152×672;
- escala 4× nearest-neighbor;
- suficiente para colisão, targeting, combate e IA;
- NÃO é arte final.

Pipeline futura:

> **referência visual → mapa ilustrado-base → tratamento/pixelização → camada visual jogável**

As referências de campo e interior estão no ZIP em `reference/art_direction/`.

---

# 6. Colisão

Funcionam:

- limites;
- casas;
- cercas;
- troncos;
- água;
- ponte;
- ruínas/rochas relevantes;
- inimigos vivos.

Regras:

- pedrinhas decorativas não bloqueiam;
- plaquinhas decorativas não bloqueiam;
- rochas maiores podem bloquear;
- copas não são hitbox.

Footprints atuais:

- Player: raio 20, offset Y 28;
- Slime: raio 30, offset Y 22.

Morto deixa de bloquear.

---

# 7. Targeting do Ragbia

## Soft Target — `Tab / RB`

Alterna entre:

> **os 2 inimigos válidos mais próximos dentro do FOV da classe.**

## Targeting amplo — `Shift+Tab / LB+RB`

Alterna entre todos os inimigos válidos dentro do FOV da classe.

Valores atuais de laboratório:

- Guerreiro FOV 500;
- Arqueiro FOV 650.

Indicador:

- anel vermelho;
- abaixo/atrás do inimigo;
- sem losango.

Com alvo selecionado, facing lock mantém o personagem olhando para ele.

---

# 8. Engage — `Espaço / RT`

- sem alvo: tenta adquirir Soft Target;
- alvo fora do attackRange: persegue;
- dentro do alcance: auto-ataca;
- manter: continua atacando;
- soltar: para ataque/perseguição, mas mantém alvo;
- sem alvo: ataque não executa.

Cancelamento:

- `Esc / LT`.

Em fullscreen do navegador, Esc pode ser capturado primeiro para sair da tela cheia.

---

# 9. Vision Range e Attack Range

São independentes.

### Guerreiro
- visionRange 500
- attackRange 130

### Arqueiro
- visionRange 650
- attackRange 520

Alvo pode estar selecionado e ainda estar fora do alcance do ataque.

---

# 10. Perseguição do Player

Engage persegue em linha direta quando necessário.

Não há pathfinding.

Hierarquia oficial:

> **Dash > movimento manual > perseguição automática**

Se o chase travar, o jogador pode contornar manualmente mantendo Engage; ao cessar o input, o chase reassume.

---

# 11. Continuidade do Engage

Mantendo `Espaço/RT`:

- alvo morre;
- procura novo Soft Target;
- seleciona;
- persegue se necessário;
- continua atacando.

Sem sucessor imediato, pode aguardar um alvo válido.

`Esc/LT` cancela a continuidade e impede reacquisition imediata durante o mesmo press físico.

---

# 12. Combate V0

Valores de laboratório:

### Player
- HP 1
- ATK 1

### Slime padrão
- HP 1
- ATK 0,5

### Slime passivo de teste
- HP 2
- ATK 0,5

Não são balanceamento.

Guerreiro causa dano no impacto melee.  
Arqueiro causa dano quando a flecha realmente chega ao alvo.

Feedback aprovado:

- dano amarelo;
- flash;
- partículas;
- hit-stop;
- shake;
- knock visual.

Impacto V1:

- Guerreiro: hit-stop 72 ms, knock visual até 18 px;
- Arqueiro: hit-stop 46 ms, knock visual até 11 px.

Knock atual é somente visual.

---

# 13. Morte e respawn

Inimigo em HP 0:

- morre logicamente;
- deixa de ser targetável;
- deixa de ser sólido;
- squash/fade;
- respawn de laboratório em 3 s.

Player:

- dois hits de 0,5 matam;
- respawn de laboratório em 3 s.

---

# 14. Ataque inimigo

Baseline de teste:

- range 150;
- wind-up 1,00 s;
- cooldown 1,60 s;
- dano 0,5.

Telegraph vermelho/laranja cresce progressivamente até o raio real no instante do golpe.

É possível sair andando no limite.

Não acelerar ainda; reavaliar junto do balanceamento futuro de esquiva por classe.

---

# 15. Dash / Esquiva

Controle:

- Shift;
- B.

Baseline:

- 1 carga;
- cooldown 1,5 s;
- 140 px;
- 180 ms;
- i-frame 120 ms.

Dash usa intenção de movimento, não facing lock.

Durante Dash:

- alvo e Engage permanecem;
- facing lock é suspenso;
- novo ataque não inicia;
- ao terminar, facing retorna.

Não atravessa cenário ou inimigos.

Flip aprovado:

- Leste/Oeste: `scaleX 1 → 0 → -1 → 0 → 1`;
- Norte/Sul: `scaleY 1 → 0 → -1 → 0 → 1`.

Com afterimage e poeira.

No futuro cada classe pode ter cargas/cooldown próprios.

---

# 16. IA inimiga

## Agressivo

- detecta pelo FOV;
- entra em aggro;
- persegue;
- ataca no alcance.

## Passivo

- não inicia combate;
- ao receber dano e sobreviver, entra em aggro;
- funciona como agressivo até reset;
- depois volta a passivo.

Dano provoca independentemente do FOV.

---

# 17. FOV, Attack Range e Leash

São conceitos independentes.

Valores atuais:

- enemy FOV 420;
- attackRange 150;
- leash/resetRange 700;
- chase 165 px/s;
- retorno 240 px/s.

Regra:

> **sair do FOV depois do aggro não reseta.**

Reset é medido pelo inimigo em relação ao seu spawn original.

---

# 18. Reset

Ao atingir leash:

1. para ataque/perseguição;
2. fica invulnerável;
3. deixa de ser targetável;
4. recupera recursos imediatamente;
5. volta ao spawn;
6. retorna ao estado normal.

Existe suporte a:

`resetEnabled = false`

para futuros VIPs, Bosses de arena e outros casos sem leash convencional.

---

# 19. Debug

**CORE V0.1 abre com debug desligado.**

`C` alterna diagnóstico.

Somente debug mostra:

- FOV;
- leash;
- colisores;
- footprints;
- PASSIVO/AGRESSIVO;
- IDLE/CHASE/ATTACK/RESET;
- coordenadas e eventos internos.

Regra final:

> o jogador não deve saber antecipadamente se o inimigo é passivo ou agressivo.

Descobrir comportamento faz parte da experiência.

---

# 20. Pendências visuais

### Inimigos
Precisam futuramente de quatro direções reais:
- Norte;
- Sul;
- Leste;
- Oeste.

### Depth sorting

> quem está mais ao sul/abaixo aparece na frente.

Usar referência dos pés/footprint.

### Oclusão do cenário

Aplicar a copas, paredes, telhados e objetos altos.

Problema conhecido:
o personagem pode aparecer na frente da copa quando deveria estar atrás.

---

# 21. Pathfinding

Não existe.

Player e inimigos podem travar em obstáculos durante perseguição.

Isso é aceitável por enquanto.

Não implementar pathfinding sem confirmar necessidade; manual override e desenho de mapa podem resolver parte relevante da experiência.

---

# 22. Onde estamos no roadmap

## Validado V0

- runtime;
- entidades;
- player;
- movimento;
- gamepad;
- câmera;
- colisões;
- targeting;
- Engage;
- ataques;
- HP/dano;
- morte/respawn;
- impacto;
- telegraph;
- Dash;
- perseguição;
- continuidade;
- IA passiva/agressiva;
- FOV/leash/reset;
- mapa beta técnico.

## Apenas iniciado

- atributos: somente parâmetros mínimos;
- habilidades: Dash sem framework geral;
- interface: laboratório/debug.

## Ainda não iniciado como sistema real

- atributos de RPG;
- recursos de classe;
- skills;
- defesa/armadura;
- crítico;
- elementos/status;
- mapa real;
- transições;
- interiores;
- NPCs;
- quests;
- inventário;
- equipamentos;
- loot;
- XP/níveis;
- progressão;
- economia;
- save/load;
- UI/HUD final;
- conteúdo real;
- bosses/VIPs reais;
- grupos/threat;
- pathfinding.

---

# 23. M001 encerrado

O M001 começou como:

> mapa beta + colisão + targeting.

Terminou validando também:

- combate;
- feedback;
- morte/respawn;
- ataque inimigo;
- esquiva;
- perseguição;
- continuidade;
- IA.

A baseline resultante é:

> **CORE V0.1 — Foundation Combat Slice**

Não continuar a partir dos ZIPs intermediários.

---

# 24. Arquivos autoritativos

Dentro do CORE:

- `README.md`
- `VERSION.json`
- `docs/CHECKPOINT_CORE_V0_1_TRANSICAO.md`
- `docs/AUDITORIA_M001_12.md`
- `reference/RAGBIA_PIXEL_BASE_OFICIAL_V15_3.md`
- `reference/RagbiaPixel_V15_3_ORIGINAL.zip`
- `phaser_map_beta/`
- `tests/`

Histórico M001:

`docs/history/`

---

# 25. Próximo ciclo

Ainda não está fechado qual será o próximo grande bloco.

Três direções naturais:

### A — Sistemas de RPG
- atributos;
- recursos;
- framework de habilidades;
- classes.

### B — Mundo real
- primeiro mapa real;
- pipeline ilustrado → pixelado;
- transições;
- interiores;
- NPCs.

### C — Aprofundamento técnico/combate
- quatro direções inimigas;
- depth sorting;
- oclusão;
- steering/pathfinding se necessário;
- novas famílias de inimigo/ataque.

Escolher de forma incremental, priorizando o próximo teste que mais reduz risco.

---

# 26. Regra de continuidade

> **Não reabrir decisão aprovada sem problema concreto.**

> **Incremental → testável → validado → fechado → próximo sistema.**

---

**BASELINE ATUAL: RAGBIA PIXEL CORE V0.1**
