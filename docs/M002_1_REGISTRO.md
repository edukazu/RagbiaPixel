# M002.1 — Tela Inicial + Estado Mínimo do Personagem

**Status:** implementação para validação

## Escopo desta subetapa

- tela inicial simples;
- campo para nome do personagem;
- botão **Jogar**;
- Enter também confirma;
- nome vazio é rejeitado;
- criação do estado de sessão do personagem;
- estado inicial `Aprendiz`;
- `HP = 1`;
- `Ataque = 1`;
- `Defesa = 1`;
- arma vazia;
- inventário de itens vazio;
- nome + classe inicial visíveis no HUD após entrar no runtime.

## Limite intencional

O M002.1 ainda entra no **mapa beta técnico do CORE V0.1**. A Casa do Avô pertence ao M002.2.

O runtime de combate do CORE ainda mantém internamente seu perfil de laboratório Guerreiro/Arqueiro; a integração visual/sistêmica completa do outfit `Aprendiz` e o bloqueio da escolha de classe antiga pertencem às próximas subetapas do M002. Não antecipar a escolha de arma/classe nesta entrega.

## Critério de validação

1. abrir o launcher;
2. visualizar tela inicial;
3. confirmar que nome vazio não inicia;
4. informar um nome;
5. clicar **Jogar** ou pressionar Enter;
6. runtime abre;
7. HUD mostra `<nome> — Aprendiz`;
8. testes automatizados continuam verdes.


## FIX1 — HUD de identidade

Após validação manual, foi corrigida a sobreposição entre o título do build e `Nome — Aprendiz`.
A identidade passou a ocupar linha própria. O HUD normal também passa a exibir a classe oficial da sessão (`Aprendiz`) em vez da classe técnica herdada do laboratório do CORE. A classe técnica permanece disponível somente no diagnóstico DEBUG até a escolha oficial de arma/classe do M002.4.
