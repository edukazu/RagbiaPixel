# RAGBIA PIXEL — M001.4 — COMBATE V0

**Base:** M001.3C aprovado  
**Status:** build para validação  
**Data:** 15/08/2026

## Objetivo

Validar o primeiro ciclo de combate real com a menor escala numérica possível.

## Escala aprovada para laboratório

- Personagem: HP 1 / ATK 1.
- Inimigos: HP 1 / ATK 0,5.

O ataque 0,5 do inimigo é registrado como atributo, mas ainda não existe comportamento de ataque inimigo neste marco.

## Contrato do M001.4

1. Ataque exige alvo selecionado e alcance válido, como já aprovado.
2. Guerreiro aplica 1 de dano no ponto de impacto do golpe.
3. Arqueiro aplica 1 de dano quando a flecha efetivamente alcança o alvo.
4. Inimigo com HP 1 morre após um acerto válido.
5. Ao morrer: `alive=false`, `targetable=false`, `solid=false`.
6. O sprite é ocultado e o alvo deixa de ser válido.
7. Engage não continua automaticamente em outro alvo neste gate.
8. Inimigo não ataca o personagem ainda.

## Critério de aprovação

Selecionar -> Engage -> ataque conecta -> dano aparece -> HP 1 vira 0 -> inimigo desaparece -> alvo é limpo -> espaço físico fica livre.
