# M002 — PLANO DE PRODUÇÃO ENXUTO

**Marco:** Casa do Avô / Escolha Inicial de Classe  
**Baseline de origem:** `core-v0.1`  
**Escopo:** tela inicial → Casa do Avô → escolha de arma/classe → Status → Inventário  
**Limite:** não iniciar a Vila antes do fechamento do M002.

---

## Princípio

O M002 não é um “pacote de sistemas de RPG”. É um primeiro fluxo jogável completo.

A implementação deve evitar frameworks antecipados. Criar apenas a estrutura necessária para o fluxo atual, mantendo pontos de extensão claros.

---

## Ordem de produção

### P0 — Branch do ciclo
Criar branch de trabalho a partir de `main`:

`m002-casa-avo`

Não alterar a tag `core-v0.1`.

---

### P1 — Estado mínimo do personagem + Tela Inicial

Criar um estado simples de sessão contendo:
- `name`;
- `class`;
- `outfit`;
- `stats.hp`;
- `stats.attack`;
- `stats.defense`;
- `equipment.weapon`;
- inventário de itens.

Estado inicial:
- class = Aprendiz;
- HP = 1;
- Ataque = 1;
- Defesa = 1;
- weapon = vazio.

Depois criar a tela inicial:
- nome;
- Jogar;
- transição para a cena da casa.

**Teste de saída:** o nome informado chega corretamente à cena jogável.

---

### P2 — Casa do Avô funcional antes do polimento

Usar a referência ilustrada fornecida para montar a primeira interpretação pixelada jogável.

Prioridade:
1. proporção/layout;
2. área caminhável;
3. colisões;
4. leitura dos objetos principais;
5. suporte de armas;
6. polimento visual.

Não inverter essa ordem.

**Teste de saída:** Aprendiz entra, caminha pela casa e alcança o suporte sem erros de colisão.

---

### P3 — Interação com suporte

Adicionar mecanismo mínimo de interação contextual necessário para o suporte de armas.

O suporte oferece:
- Espada;
- Arco.

Nenhuma classe é escolhida automaticamente.

**Teste de saída:** cada opção pode ser escolhida explicitamente.

---

### P4 — Aplicação da escolha

Ao escolher Espada:
- Guerreiro Aprendiz;
- outfit correspondente;
- arma = Espada.

Ao escolher Arco:
- Arqueiro Aprendiz;
- outfit correspondente;
- arma = Arco.

Neste marco:
- HP permanece 1;
- Ataque permanece 1;
- Defesa permanece 1.

**Teste de saída:** estado interno e representação visual concordam.

---

### P5 — Status

Criar menu mínimo mostrando apenas:
- Nome;
- Classe;
- HP;
- Ataque;
- Defesa.

Nada além disso entra por antecipação.

**Teste de saída:** menu reflete Aprendiz antes da escolha e a nova classe depois dela.

---

### P6 — Inventário

Criar duas áreas:
- Equipamentos;
- Itens.

Obrigatório:
- slot de arma;
- grade de itens;
- arma escolhida exibida no slot correto;
- estado vazio antes da escolha.

Não implementar ainda:
- bônus;
- peso;
- stack;
- consumíveis;
- drag-and-drop complexo;
- loot.

**Teste de saída:** escolha da arma aparece corretamente e não se duplica.

---

### P7 — Integração dos dois caminhos

Executar duas sessões limpas:

#### Caminho A
Tela inicial → Casa → Aprendiz → Espada → Guerreiro Aprendiz → Status → Inventário.

#### Caminho B
Tela inicial → Casa → Aprendiz → Arco → Arqueiro Aprendiz → Status → Inventário.

Rodar regressões relevantes do CORE.

---

### P8 — Fechamento

Somente após aprovação:
- integrar branch em `main`;
- atualizar documentação/roadmap;
- atualizar identificação de versão conforme decisão do marco;
- criar tag/release apenas se o checkpoint justificar;
- liberar planejamento do M003 — Vila Inicial.

---

## Critérios anti-escopo

Durante M002, rejeitar como “agora não”:
- lore detalhada;
- avô/NPC completo;
- quests;
- Vila;
- XP/nível;
- save/load completo;
- atributos adicionais;
- diferença numérica entre classes;
- loot/economia;
- skills novas;
- inventário sofisticado.

Se algum item se tornar tecnicamente indispensável para o fluxo, ele deve entrar pelo menor recorte possível e ser registrado como dependência concreta.
