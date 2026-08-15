# RAGBIA PIXEL — M001.3A — SOFT TARGET + ENGAGE

## Estado de entrada

O M001.3 FIX1 validou selecionar, ciclar, identificar e limpar alvos em teclado e gamepad. Também ficaram definidos os refinamentos do indicador visual e a necessidade de manter o facing do personagem voltado ao alvo selecionado.

## Objetivo

Evoluir o Targeting V0 para o primeiro contrato próprio de combate do Ragbia Pixel sem introduzir perseguição, IA ou progressão.

## Soft Target

`Tab` / `RB` trabalha exclusivamente com os **2 inimigos válidos mais próximos**, independentemente da lista ampla de FOV. A lista é recalculada conforme a posição do personagem muda.

Se o alvo atual estiver entre esses dois, o comando alterna para o outro. Se não estiver, a seleção começa pelo mais próximo.

## Ciclo amplo por campo de visão

`Shift+Tab` / `LB+RB` percorre todos os inimigos válidos dentro do perfil de visão da classe.

A arquitetura do perfil é independente por classe desde este marco. Para laboratório:

- Guerreiro: raio 500 px;
- Arqueiro: raio 650 px.

Esses valores não são balanceamento aprovado. O formato radial também é provisório e poderá ser substituído por cone, visão frontal ou outra geometria por classe.

## Facing lock

Enquanto existir um alvo válido selecionado, a direção visual do personagem é derivada da posição relativa do alvo. O movimento continua livre, permitindo deslocamento lateral ou para trás enquanto o personagem mantém a visão no alvo.

## Engage

`Espaço` / `RT` é o comando ENGAGE.

- Pressionar sem alvo executa primeiro a aquisição equivalente ao Soft Target.
- Se um alvo válido for encontrado, o ataque começa.
- Manter o comando pressionado repete o ataque automaticamente respeitando a cadência/cooldown da classe.
- Soltar o comando interrompe novas repetições, mas não limpa o alvo.
- Sem alvo selecionado, `startAttack()` recusa iniciar qualquer ataque.
- Limpar o alvo com `Esc` / `LT` cancela uma animação de ataque ainda em andamento; projéteis já liberados continuam independentes.

## Indicador do alvo

- anel vermelho;
- camada abaixo do sprite inimigo;
- sem losango superior.

## Arqueiro

O corpo/arco continua usando as quatro direções visuais. Depois de liberada, a flecha é um projétil independente e sua trajetória passa a apontar para a posição do alvo usado ao iniciar aquele ataque.

## Gamepad — LB+RB

Foi adicionada uma pequena janela de 110 ms para distinguir `RB` isolado de `LB+RB`. Isso evita que uma tentativa de combo dispare primeiro o Soft Target por diferença de um frame entre os botões.

## Não implementado

- perseguição automática;
- continuidade automática para próximo alvo morto;
- hit/dano/HP como consequência do auto-ataque;
- bloqueio de alvo por LOS;
- IA;
- FOV final de cada classe.

## Gate de validação

Validar em teclado e gamepad:

1. Tab/RB nunca percorre mais de dois alvos próximos.
2. Shift+Tab/LB+RB consegue percorrer alvos adicionais que estejam dentro do FOV.
3. Personagem mantém o facing no alvo durante movimento.
4. Espaço/RT sem alvo adquire um soft target e inicia Engage.
5. Segurar Espaço/RT repete ataques continuamente.
6. Soltar Espaço/RT interrompe a repetição sem perder alvo.
7. Sem alvo, não ocorre ataque.
8. Esc/LT limpa o alvo.
9. Anel vermelho permanece atrás do sprite inimigo.
10. Arqueiro dispara a flecha em direção ao alvo.
