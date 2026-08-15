# RAGBIA PIXEL — ROADMAP OFICIAL

**Atualizado em:** 15/08/2026  
**Baseline funcional:** `CORE V0.1 — Foundation Combat Slice`  
**Branch estável:** `main`  
**Tag de baseline:** `core-v0.1`

> Regra de continuidade: **incremental → testável → validado → fechado → próximo sistema.**

---

## 1. Estado atual

### M001 — Fundação / Núcleo V0
**Status:** CONCLUÍDO

O ciclo M001 consolidou a fundação jogável do Ragbia Pixel:
- runtime;
- movimento e gamepad;
- câmera;
- colisões;
- targeting;
- Engage;
- combate V0;
- HP/dano;
- morte/respawn;
- feedback de impacto;
- ataque inimigo;
- Dash/esquiva;
- perseguição e continuidade;
- IA passiva/agressiva;
- FOV, leash e reset;
- mapa beta técnico.

Baseline resultante: **CORE V0.1 — Foundation Combat Slice**.

### M001.13 — Fundação do Repositório / Versionamento
**Status:** CONCLUÍDO

- Git/GitHub adotados como fluxo oficial de versionamento e backup;
- repositório privado `edukazu/RagbiaPixel`;
- `main` como linha estável;
- tag `core-v0.1` criada;
- estrutura normalizada na raiz;
- recuperação por clone remoto validada;
- testes e execução do CORE recuperado aprovados.

ZIPs deixam de ser o fluxo normal de evolução do projeto.

---

# 2. M002 — Casa do Avô / Escolha Inicial de Classe

**Status:** PRÓXIMO CICLO  
**Objetivo:** produzir o primeiro fluxo de onboarding realmente jogável, fechado dentro da Casa do Avô.

O M002 termina antes da Vila. A Vila só entra em desenvolvimento depois que este slice estiver funcionando e aprovado.

## Fluxo-alvo do M002

1. abrir o jogo;
2. tela inicial simples;
3. informar nome do personagem;
4. clicar em **Jogar**;
5. entrar na Casa do Avô;
6. iniciar com outfit/classe **Aprendiz**;
7. movimentar-se normalmente;
8. interagir com o suporte de armas;
9. escolher **Espada** ou **Arco**;
10. tornar-se:
   - **Guerreiro Aprendiz** ao escolher Espada; ou
   - **Arqueiro Aprendiz** ao escolher Arco;
11. arma escolhida passa a constar como equipada;
12. abrir **Status do Personagem**;
13. abrir **Inventário**;
14. visualizar equipamentos e slots de itens;
15. confirmar que nome, classe e equipamento refletem o estado atual.

---

## 2.1 — Tela Inicial + Estado Mínimo do Personagem

**Objetivo:** permitir a entrada no jogo sem criar ainda sistemas de conta, criação avançada ou save/load.

### Entrega
- tela inicial simples;
- título do jogo;
- campo de nome;
- botão **Jogar**;
- nome obrigatório ou fallback técnico claramente definido;
- criação do estado de personagem da sessão;
- transição para a Casa do Avô.

### Estado inicial
- classe/outfit: **Aprendiz**;
- HP: **1**;
- Ataque: **1**;
- Defesa: **1**;
- sem arma equipada;
- inventário de itens vazio.

### Fora do escopo
- login;
- conta;
- seleção de personagem;
- customização estética;
- save/load persistente.

### Critério de fechamento
Nome digitado na tela inicial aparece corretamente no estado do personagem após entrar na Casa do Avô.

---

## 2.2 — Casa do Avô: Primeiro Mapa Real Jogável

**Objetivo:** substituir, neste slice, o mapa beta técnico por uma primeira área real de apresentação.

### Referência visual
Usar a ilustração fornecida da **Casa do Avô** como referência-base de:
- composição;
- atmosfera;
- organização do interior;
- materiais;
- objetos principais.

Pipeline deste mapa:

> **referência ilustrada → interpretação pixelada → mapa jogável → colisões → validação**

A referência não deve ser tratada como imagem de fundo definitiva nem exigir reprodução literal de cada detalhe.

### Entrega
- mapa pixelado da Casa do Avô;
- área navegável coerente;
- paredes e objetos principais com colisão;
- entrada/spawn do jogador;
- suporte de armas posicionado e identificável no espaço;
- compatibilidade com movimento, câmera e colisões do CORE V0.1.

### Fora do escopo
- Vila;
- exterior jogável completo;
- NPCs com lore;
- quests;
- transições para outras áreas.

### Critério de fechamento
O personagem pode percorrer a casa sem atravessar estruturas relevantes e alcançar o suporte de armas.

---

## 2.3 — Estado Aprendiz + Interação com Suporte de Armas

**Objetivo:** criar a primeira interação de progressão do jogo.

### Entrega
- personagem entra como **Aprendiz**;
- suporte de armas é interativo;
- interação apresenta duas escolhas:
  - **Espada**;
  - **Arco**;
- não há escolha automática por proximidade;
- escolha ocorre explicitamente pelo jogador.

### Critério de fechamento
O jogador consegue chegar ao suporte, interagir e selecionar uma das duas armas sem quebrar movimentação ou menus.

---

## 2.4 — Escolha Inicial de Classe

**Objetivo:** transformar a escolha de arma em mudança real de estado.

### Espada
- classe/outfit: **Guerreiro Aprendiz**;
- Espada equipada.

### Arco
- classe/outfit: **Arqueiro Aprendiz**;
- Arco equipado.

### Atributos neste marco
A escolha de classe **não altera ainda os atributos-base**:

- HP: **1**;
- Ataque: **1**;
- Defesa: **1**.

Diferenças de atributos entre classes ficam para sistema posterior.

### Critério de fechamento
Classe, outfit e arma equipada mudam de forma consistente e permanecem corretos durante toda a sessão.

---

## 2.5 — Menu: Status do Personagem

**Objetivo:** expor o primeiro painel sistêmico do personagem.

### Deve mostrar
- nome;
- classe atual;
- HP;
- Ataque;
- Defesa.

Valores iniciais:
- HP = 1;
- Ataque = 1;
- Defesa = 1.

### Fora do escopo
- nível;
- XP;
- atributos adicionais;
- resistências;
- crítico;
- recursos de classe;
- cálculo complexo de estatísticas.

### Critério de fechamento
O painel abre/fecha corretamente e sempre reflete o estado atual do personagem.

---

## 2.6 — Menu: Inventário / Equipamentos

**Objetivo:** estabelecer a estrutura mínima de posse e equipamento.

### Deve conter duas áreas visuais distintas

#### Equipamentos
- seção de slots de equipamentos;
- **slot de arma obrigatório** para o M002;
- demais tipos/nomes de slots só serão fechados quando necessário.

#### Itens
- seção de slots de itens;
- grade mínima funcional;
- inicialmente vazia, exceto se algum item de teste for necessário para validação.

### Comportamento obrigatório
- Espada aparece equipada após escolha do Guerreiro Aprendiz;
- Arco aparece equipado após escolha do Arqueiro Aprendiz;
- antes da escolha, slot de arma aparece vazio.

### Fora do escopo
- drag-and-drop avançado;
- consumíveis;
- stack;
- peso;
- loot;
- descarte;
- comércio;
- equipamento com bônus.

### Critério de fechamento
Inventário abre/fecha e representa corretamente a arma equipada sem duplicar ou perder estado.

---

## 2.7 — Integração / Auditoria do M002

**Objetivo:** testar o slice inteiro como uma experiência contínua.

### Teste obrigatório
- iniciar em tela inicial;
- inserir nome;
- Jogar;
- entrar na Casa do Avô;
- confirmar Aprendiz;
- movimentar;
- abrir Status;
- abrir Inventário;
- chegar ao suporte;
- escolher Espada;
- validar Guerreiro Aprendiz + equipamento + menus;
- repetir fluxo limpo escolhendo Arco;
- validar Arqueiro Aprendiz + equipamento + menus.

### Regressões obrigatórias
O M002 não pode quebrar os sistemas do CORE V0.1 que ainda forem usados no runtime.

### Definição de pronto
O M002 só é fechado quando os dois caminhos de escolha funcionarem de ponta a ponta e os menus refletirem corretamente o estado do personagem.

---

# 3. Próximos ciclos

## M003 — Vila Inicial
**Status:** BLOQUEADO PELO M002

Direção preliminar:
- primeiro mapa básico da Vila;
- saída funcional da Casa do Avô;
- transição Casa → Vila;
- conteúdo da Vila definido incrementalmente.

**Importante:** detalhes de M003 ainda não estão fechados. Não antecipar sistemas da Vila dentro do M002 apenas para “adiantar trabalho”.

---

# 4. Sistemas posteriores ainda abertos

Permanecem para ciclos futuros:
- atributos de RPG além de HP/Ataque/Defesa;
- diferenças estatísticas entre classes;
- recursos de classe;
- framework amplo de skills;
- defesa/armadura real;
- crítico;
- elementos/status;
- NPCs;
- lore;
- quests;
- loot;
- XP/níveis;
- progressão;
- economia;
- save/load;
- HUD final;
- bosses/VIPs;
- pathfinding, se comprovadamente necessário.

---

# 5. Regra de execução

Cada subetapa do M002 deve seguir:

> **implementar → testar → validar → commit → próximo subpasso**

`main` continua reservada para estado estável/aprovado. O desenvolvimento do M002 deve ocorrer em branch própria antes da integração final.
