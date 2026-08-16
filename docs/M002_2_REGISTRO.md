# M002.2 — Casa do Avô: Primeiro Mapa Real Jogável

**Status do patch:** pronto para validação manual  
**Origem:** branch `m002-casa-avo`, após M002.1

## Objetivo

Trocar a experiência ativa do mapa beta técnico por uma primeira interpretação pixelada e jogável da **Casa do Avô**, usando a ilustração fornecida como referência de composição e atmosfera.

## Entregue

- novo mapa `house-map-v0.js`, desenhado em arte lógica 480×270 e ampliado 4× por nearest-neighbor;
- mundo 1920×1080 que mantém a casa inteira visível;
- layout inspirado na referência: duas camas, lareira central, mesa central, armários/baús, mesa de trabalho, porta e suporte de armas;
- nova colisão própria da casa, separada da arte;
- paredes e mobiliário principal bloqueiam o movimento;
- suporte de armas já existe visualmente e possui colisor, mas **ainda não é interativo**;
- porta para a Vila permanece bloqueada enquanto M003 não existe;
- personagem entra como `Aprendiz` e usa um outfit neutro provisório de Aprendiz, sem espada/arco;
- removidos da experiência ativa da casa: Slimes, targeting, Engage, combate e troca técnica Guerreiro/Arqueiro;
- movimento por teclado e gamepad preservado;
- `C` mostra colisores apenas para diagnóstico técnico;
- `F` alterna tela cheia.

## Limites deliberados

Este passo **não implementa ainda**:

- interação com o suporte;
- escolha Espada/Arco;
- Guerreiro Aprendiz / Arqueiro Aprendiz;
- Status;
- Inventário;
- NPC/lore;
- saída funcional para a Vila;
- depth sorting/oclusão avançados.

Esses itens permanecem nos próximos passos do M002.

## Critério de validação manual

1. tela inicial aceita o nome;
2. `Jogar` abre a Casa do Avô;
3. identidade mostra `Nome — Aprendiz`;
4. o personagem não aparece como Guerreiro/Arqueiro;
5. não existe troca de classe por Q/E/Y;
6. não existem Slimes ou combate na casa;
7. é possível caminhar pelos corredores úteis;
8. paredes, camas, lareira, mesa, baús/armários, mesa de trabalho e suporte impedem atravessamento relevante;
9. o suporte de armas é visualmente localizável à direita;
10. `C` permite auditar colisores e abre com debug desligado.

## Próximo passo após aprovação

**M002.3 — Estado Aprendiz + Interação com Suporte de Armas.**
