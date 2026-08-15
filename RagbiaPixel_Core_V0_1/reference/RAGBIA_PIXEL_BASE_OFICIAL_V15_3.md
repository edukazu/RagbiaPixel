# RAGBIA PIXEL — BASE OFICIAL DE DESENVOLVIMENTO

**Documento de transição para novo chat**  
**Protótipo oficial:** `Ragbia Pixel FULL HD V15.3`  
**Status:** APROVADO COMO BASE OFICIAL PARA INÍCIO DO PROJETO  
**Data de fechamento:** 15/08/2026

---

# 1. Objetivo deste documento

Este arquivo registra o ponto exato em que o projeto **Ragbia Pixel** foi fechado como protótipo-base e está pronto para deixar de ser apenas um laboratório visual e passar a ser tratado como **base real de desenvolvimento do jogo**.

O objetivo é permitir a continuação em um novo chat sem precisar reconstruir todo o histórico de decisões, testes e correções.

A versão oficial de referência passa a ser:

> **Ragbia Pixel FULL HD V15.3**

A V15.3 deve ser considerada o **baseline oficial** do novo projeto pixelado.

---

# 2. Direção geral aprovada

O Ragbia Pixel nasce da tentativa de encontrar uma direção viável para um RPG com:

- identidade visual forte;
- movimentação simples;
- baixo custo de animação;
- combate legível;
- suporte a gamepad;
- possibilidade de crescimento para muitas classes, monstros, mapas e habilidades;
- desenvolvimento viável para uma equipe pequena / projeto solo assistido.

A conclusão dos testes foi que:

> **pixel art dentro do gameplay é o caminho aprovado.**

A prioridade passa a ser:

- sprites pequenos e legíveis;
- poucas fases de animação;
- efeitos bem usados;
- mapas pixelados simples e rápidos de produzir;
- ilustrações mais ricas reservadas para menus, retratos, lore, interfaces e outros elementos fora do gameplay.

---

# 3. Referências estudadas

Durante a fase de pesquisa foram analisados dois caminhos principais:

## 3.1. Realm of the Mad God / pixel action

Serviu como referência inicial para provar que:

- poucas animações podem funcionar;
- ataques podem ser bem representados por efeitos;
- sprites simples podem carregar gameplay complexo;
- o custo de produção cai muito quando não dependemos de animações ilustradas extensas.

## 3.2. Tibia / OTClient

A pesquisa sobre Tibia foi particularmente importante para movimentação.

A principal conclusão foi:

> Não tentar “inclinar” ou deformar um mesmo personagem para produzir todas as direções.

O padrão adotado passou a ser:

- Norte;
- Sul;
- Leste;
- Oeste;

como **quatro leituras visuais próprias**.

Também foi adotada a ideia de caminhada curta e econômica, com poucas fases.

O Tibia deve continuar sendo usado como **referência de estudo de legibilidade, proporção, movimentação e organização de assets**, mas os personagens, monstros e demais assets do Ragbia devem ser **originais**.

---

# 4. Evolução do protótipo

O protótipo passou por várias versões até encontrar a base correta.

As versões intermediárias serviram como laboratório e não devem ser tratadas como baseline.

Os principais marcos foram:

## V3

Primeira versão visual realmente forte do protótipo.

Características que funcionaram:

- Guerreiro visualmente legível;
- Arqueiro com identidade clara;
- mapa com boa textura pixelada;
- campo, estrada, vegetação e slimes;
- boa leitura em FULL HD.

## V4 / V5

Foram introduzidos efeitos importantes:

- hit-stop;
- screen shake;
- poeira de caminhada;
- partículas;
- impacto;
- slash;
- rastro de flecha.

A V5 consolidou visual + efeitos.

## V6–V11

Foram feitos vários testes tentando:

- animar espada junto ao corpo;
- alterar poses;
- criar perfis;
- inclinar sprites;
- adaptar lateralidade.

Esses testes mostraram um limite importante:

> tentar animar corpo + arma permanentemente no mesmo sprite começou a piorar a consistência visual.

Esse caminho foi abandonado.

## V12

Foi adotada uma abordagem mais próxima da lógica do Tibia:

- quatro direções reais;
- três fases simples de caminhada;
- mesmas proporções gerais entre direções;
- corpo compacto;
- braços e pernas mais econômicos.

Esse foi o ponto onde a movimentação ficou realmente sólida.

## V12.1

A V12.1 foi fechada como:

> **BASE VISUAL ESTÁVEL**

Ajustes principais:

- correções de detalhes do Arqueiro;
- boca na frontal;
- braços e mãos mais consistentes;
- melhor equivalência visual entre Guerreiro e Arqueiro.

A V12.1 continua sendo a referência visual pura do personagem.

## V14.x

Foi criada uma nova filosofia de ataque para o Guerreiro.

Em vez de:

- arma permanente na mão;
- animação do corpo;
- animação da arma dentro do sprite;

passamos para:

> **ataque desacoplado do sprite base.**

O corpo permanece estável.

A espada aparece apenas durante o ataque.

O efeito do golpe e a espada são elementos separados.

## V14.6

O ataque do Guerreiro ficou funcional e aprovado:

- espada temporária;
- slash separado;
- golpe ancorado ao personagem;
- efeito acompanha o personagem caso ele continue andando;
- espada acompanha o personagem;
- a animação não fica “presa” no mundo.

## V15.x

A mesma filosofia foi aplicada ao Arqueiro.

## V15.3

Versão final aprovada como:

> **BASE OFICIAL DO PROJETO RAGBIA PIXEL**

---

# 5. Baseline visual dos personagens

O projeto começa com duas classes de laboratório:

- Guerreiro;
- Arqueiro.

Eles não representam ainda o sistema completo de classes do jogo, mas servem como referência técnica.

---

# 6. Movimentação oficial

A movimentação aprovada segue estas regras:

## 6.1. Quatro direções reais

Cada personagem possui leitura própria para:

- Norte;
- Sul;
- Leste;
- Oeste.

Não usar:

- rotação automática;
- inclinação artificial;
- transformação de perspectiva;
- um único corpo reaproveitado para todas as direções.

## 6.2. Três fases simples de caminhada

A caminhada utiliza poucas fases.

O objetivo não é produzir uma animação extremamente suave.

O objetivo é produzir:

- leitura;
- ritmo;
- resposta;
- identidade visual.

A animação deve continuar barata o suficiente para permitir muitos personagens e monstros.

## 6.3. Membros compactos

Foi validado que proporções anatomicamente realistas demais ficam estranhas nesse estilo.

Portanto:

- braços não devem ficar longos demais;
- mãos devem permanecer próximas à cintura;
- pernas devem ser compactas;
- silhueta deve priorizar leitura em vez de anatomia realista.

---

# 7. Filosofia oficial para armas

Uma decisão estrutural importante foi aprovada:

> **armas não precisam ficar permanentemente desenhadas no sprite base.**

Isso evita:

- problemas de mão dominante;
- problemas de camadas;
- inconsistência entre direções;
- necessidade de redesenhar toda a movimentação por equipamento;
- aumento enorme no custo de produção.

As armas podem aparecer:

- apenas durante o ataque;
- em habilidades;
- em poses especiais;
- em efeitos temporários.

---

# 8. Ataque básico oficial do Guerreiro

O ataque do Guerreiro foi fechado como uma animação independente do corpo.

Estrutura:

1. corpo permanece usando o sprite base;
2. efeito de slash aparece;
3. sprite temporário da espada aparece;
4. espada percorre o arco;
5. espada desaparece;
6. efeito desaparece.

O ataque inteiro fica **ancorado ao personagem**.

Isso significa que:

> se o jogador continuar andando durante o golpe, espada e efeito acompanham o personagem.

---

# 9. Direções do ataque do Guerreiro

## Sul

Meia lua:

> esquerda da tela → direita da tela

Camada:

> na frente do personagem.

## Norte

Meia lua:

> direita da tela → esquerda da tela

Camada:

> o personagem é desenhado por cima do golpe.

Ou seja, espada e efeito passam **atrás da camada gráfica do personagem**.

Isso não representa necessariamente anatomia real; representa apenas a composição visual correta.

## Leste

Meia lua:

> baixo → cima

## Oeste

Meia lua:

> cima → baixo

---

# 10. Espada do Guerreiro

A espada:

- não existe permanentemente no personagem;
- aparece no início do ataque;
- percorre a meia lua;
- funciona visualmente como um ponteiro de relógio;
- desaparece ao final;
- possui velocidade suficiente para o movimento ser claramente percebido.

O slash e a espada são sistemas separados.

Regra:

> **efeito vende impacto; espada vende trajetória.**

---

# 11. Hitbox do Guerreiro

O ataque básico é também uma área de efeito frontal.

A meia lua não é apenas decorativa.

Ela representa aproximadamente a região válida do ataque.

Direção e hitbox devem permanecer coerentes.

Isso cria uma base útil para futuros sistemas como:

- espadas maiores;
- machados;
- lanças;
- ataques circulares;
- golpes especiais;
- habilidades em cone;
- habilidades em arco.

---

# 12. Ataque básico oficial do Arqueiro

O Arqueiro usa a mesma filosofia geral, adaptada para combate à distância.

Estrutura:

1. corpo continua usando sprite base;
2. arco temporário aparece;
3. arco permanece ancorado ao personagem;
4. corda é puxada;
5. flecha aparece encaixada;
6. flecha é solta;
7. projétil passa a existir independentemente;
8. arco desaparece ao final da animação.

---

# 13. Regra fundamental do Arqueiro

Antes do disparo:

> arco + flecha permanecem ancorados ao personagem.

Depois do disparo:

> a flecha se torna um projétil independente no mundo.

Essa diferença é fundamental.

---

# 14. Arco do Arqueiro

O arco foi aumentado para possuir boa leitura visual.

A versão final possui:

- pontas maiores;
- grip central;
- corda visível;
- puxada clara;
- tamanho suficiente para continuar visível mesmo na direção Norte.

A orientação deve respeitar a direção do ataque.

Especialmente:

- Leste deve puxar a corda para trás do disparo;
- Oeste deve fazer o equivalente invertido;
- Norte deve manter as extremidades do arco visíveis;
- Sul deve preservar leitura frontal.

---

# 15. Flecha do Arqueiro

A flecha foi aumentada e recebeu mais detalhes:

- haste;
- ponta;
- parte traseira;
- emplumação.

Antes da soltura, ela aparece encaixada no arco.

Depois:

- ganha velocidade própria;
- possui rastro;
- pode atingir slimes;
- gera impacto e dano.

---

# 16. Consistência visual do Arqueiro

Na V15.3 foi feito um ajuste final importante:

> os antebraços dos perfis Leste/Oeste seguem o mesmo padrão marrom já utilizado nas direções Norte/Sul.

Isso deve ser mantido.

A intenção é evitar que cada direção pareça um personagem diferente.

---

# 17. Efeitos aprovados

O protótipo já possui uma linguagem básica de feedback visual que deve ser preservada:

- hit-stop;
- screen shake;
- partículas de impacto;
- poeira;
- rastro;
- números de dano;
- flash de impacto;
- knockback simples.

Esses efeitos podem ser refinados depois.

Eles não precisam ser reescritos antes do início do projeto.

---

# 18. Mapa do protótipo

O campo de teste utiliza:

- gramado pixelado;
- estrada de terra;
- pedras;
- vegetação;
- pequenas flores;
- slimes.

Essa experiência mostrou uma vantagem importante:

> mapas pixelados produzidos diretamente são muito mais viáveis para o Ragbia do que depender de construção tradicional tile por tile extremamente detalhada.

O mapa do protótipo não é conteúdo final.

Ele serve como prova de direção.

---

# 19. Direção futura para mapas

A filosofia aprovada é:

- mapas pixelados;
- modularidade;
- variedade de textura;
- objetos simples;
- boa leitura;
- baixo custo de produção;
- evitar cenários que exijam ilustração complexa para cada tela.

Elementos mais ricos podem ser usados seletivamente.

---

# 20. Resolução e apresentação

O protótipo trabalha com:

> **FULL HD — 1920 × 1080**

A resolução interna deve continuar sendo considerada a referência inicial.

A interface ainda é de laboratório.

Ela não representa a UI final do jogo.

---

# 21. Controles já validados

## Teclado

- WASD / Setas — movimentação
- Espaço / J / X — ataque
- TAB / Q / E — trocar classe no laboratório
- F — tela cheia

## Gamepad

- Analógico esquerdo / D-pad — movimentação
- A / X / RT — ataque
- LB / RB — troca de classe

O suporte a gamepad é uma característica importante do projeto e deve ser preservado desde o início.

---

# 22. Estrutura técnica atual

O protótipo é propositalmente simples.

Arquivos principais:

- `index.html`
- `game.js`
- `README.txt`
- `INICIAR.bat`

A implementação usa:

- HTML5;
- Canvas 2D;
- JavaScript;
- desenho pixelado por código;
- sem engine externa no momento.

Essa tecnologia não precisa necessariamente ser a tecnologia final do jogo.

O que foi aprovado é:

> **a lógica visual, o controle, a movimentação e a arquitetura de animação.**

A escolha definitiva de engine pode ser feita posteriormente.

---

# 23. O que NÃO deve ser refeito imediatamente

No próximo chat, não voltar a discutir do zero:

- se pixel art funciona;
- se devemos abandonar pixel art;
- se quatro direções são necessárias;
- se devemos usar perfil muito fino;
- se arma precisa ficar permanentemente na mão;
- se Guerreiro precisa animar corpo + espada juntos;
- se ataque deve ficar preso na posição inicial;
- se Arqueiro deve simplesmente disparar flecha do nada.

Esses pontos já foram testados.

---

# 24. Decisões oficiais já fechadas

## VISUAL

- pixel art no gameplay;
- mapas pixelados;
- personagens compactos;
- quatro direções reais;
- três fases simples de caminhada.

## ARMAS

- não permanentes no sprite base;
- podem existir como objetos temporários de animação.

## GUERREIRO

- slash em meia lua;
- espada temporária;
- efeito e espada separados;
- ataque ancorado ao personagem.

## ARQUEIRO

- arco temporário;
- puxada;
- flecha encaixada;
- disparo;
- projétil independente;
- ataque ancorado antes do disparo.

## PRODUÇÃO

- simplicidade de animação é uma vantagem;
- efeitos podem carregar parte importante da sensação de combate;
- evitar aumentar o número de frames sem necessidade.

---

# 25. Base estável versus baseline oficial

É importante diferenciar:

## V12.1

**Base visual estável.**

É o ponto de referência para:

- corpo;
- proporções;
- movimentação;
- quatro direções;
- caminhada.

## V15.3

**Baseline oficial do projeto.**

É a V12.1 mais:

- ataque do Guerreiro;
- espada temporária;
- slash;
- ancoragem;
- ataque do Arqueiro;
- arco temporário;
- puxada;
- flecha;
- projétil;
- correções visuais finais.

Portanto:

> Para iniciar o projeto real, usar **V15.3**.

---

# 26. Arquivo oficial do protótipo

Nome do ZIP:

`ragbia_pixel_proto_fullhd_v15_3.zip`

Esse arquivo deve acompanhar este documento na abertura do próximo chat.

---

# 27. Próximo estágio recomendado

A partir daqui, o trabalho deixa de ser:

> “descobrir se a direção funciona”

e passa a ser:

> “transformar a direção aprovada em jogo.”

O próximo ciclo pode começar pela definição da arquitetura real do projeto.

Sugestão de ordem:

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

Não implementar tudo de uma vez.

A filosofia deve continuar:

> **incremental → testável → validado → fechado → próximo sistema.**

---

# 28. Regra de desenvolvimento para o novo projeto

Sempre que possível:

1. implementar o menor sistema funcional;
2. gerar build/protótipo jogável;
3. testar;
4. corrigir;
5. congelar a decisão;
6. avançar.

Evitar grandes blocos de desenvolvimento sem validação prática.

---

# 29. Filosofia de arte

O Ragbia Pixel deve aproveitar referências técnicas de jogos existentes para estudar:

- proporção;
- timing;
- direção;
- legibilidade;
- camadas;
- animação;
- feedback.

Mas a produção final deve buscar:

> **assets próprios e identidade própria.**

A inspiração em Tibia deve ser estrutural e técnica, não uma reprodução direta de conteúdo proprietário.

---

# 30. Estado final deste ciclo

## APROVADO

- direção pixelada;
- personagens;
- movimentação;
- quatro direções;
- caminhada;
- Guerreiro;
- Arqueiro;
- ataque melee;
- ataque ranged;
- gamepad;
- efeitos básicos;
- mapa pixelado de laboratório.

## BASE OFICIAL

> **RAGBIA PIXEL FULL HD V15.3**

## BASE VISUAL DE SEGURANÇA

> **V12.1**

---

# 31. Instrução para o próximo chat

Ao iniciar um novo chat, enviar:

1. este arquivo;
2. o ZIP da V15.3.

E informar:

> “Este documento e a V15.3 são a base oficial do Ragbia Pixel. Não reabrir decisões já fechadas; continuar o projeto a partir daqui.”

---

# 32. Resumo executivo

O Ragbia Pixel encontrou uma solução viável para seu maior gargalo: animação.

A solução não foi aumentar a complexidade do sprite.

Foi separar responsabilidades:

- **sprite base** cuida de identidade + movimento;
- **efeito** cuida de impacto;
- **arma temporária** cuida da trajetória;
- **projétil** cuida do movimento independente;
- **camadas** cuidam da profundidade;
- **ancoragem** mantém ataque coerente com o jogador.

Essa arquitetura permite crescer o jogo sem exigir animações extensas para cada personagem.

Esse é o princípio central que deve acompanhar o desenvolvimento daqui em diante.

---

**FIM DO DOCUMENTO DE TRANSIÇÃO**

**Baseline oficial:** `Ragbia Pixel FULL HD V15.3`  
**Base visual estável:** `V12.1`  
**Status:** pronto para iniciar o desenvolvimento do projeto real.
