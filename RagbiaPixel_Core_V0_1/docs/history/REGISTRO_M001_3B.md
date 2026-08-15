# RAGBIA PIXEL — M001.3B — FOV + ATTACK RANGE

## Estado de entrada

O M001.3A validou Soft Target, ciclo amplo por FOV, facing lock, Engage contínuo, anel vermelho abaixo do inimigo e manutenção do alvo ao soltar Engage.

## Objetivo

Separar dois conceitos que não podem ser tratados como equivalentes no combate:

1. **ver/selecionar** um inimigo;
2. **estar perto o suficiente para atacar** esse inimigo.

## Regra 1 — Soft Target limitado pelo FOV

`Tab / RB` deixa de procurar os dois inimigos mais próximos em qualquer distância.

A nova regra é:

1. filtrar inimigos válidos dentro do `targetRange`/FOV da classe;
2. ordenar por distância;
3. manter apenas os dois mais próximos;
4. ciclar entre esses dois.

Se a lista estiver vazia, o comando não seleciona alvo.

O Engage (`Espaço / RT`) sem alvo continua tentando adquirir alvo pelo Soft Target. Se nenhum inimigo estiver dentro do FOV, permanece sem alvo e nenhum ataque é executado.

## Regra 2 — Attack Range independente

Cada perfil de classe passa a possuir explicitamente:

- `visionRange`;
- `targetRange`;
- `attackRange`.

Neste laboratório `visionRange` e `targetRange` têm o mesmo valor, mas são campos separados para permitir evolução futura sem refatorar o contrato.

Valores provisórios:

- Guerreiro: vision/target 500 px; attack 130 px.
- Arqueiro: vision/target 650 px; attack 520 px.

`startAttack()` recusa iniciar se o alvo estiver fora do `attackRange`, mesmo que esteja selecionado.

Não foi adicionada perseguição. Com Engage segurado e alvo fora de alcance, o personagem não ataca; ao aproximar-se manualmente até entrar no alcance, a repetição automática pode começar.

## Persistência do alvo

O alvo selecionado continua persistindo fora do FOV enquanto permanecer uma entidade inimiga válida. Esta regra não foi modificada neste gate.

## HUD de laboratório

O HUD informa:

- quantidade de candidatos Soft;
- quantidade de inimigos no FOV;
- alcance de visão atual;
- `ATK OK` quando o alvo está em alcance;
- `FORA ATK` quando está selecionado mas fora do alcance;
- distância atual / `attackRange`.

## Fora do escopo

- perseguição automática;
- pathfinding;
- line-of-sight por obstáculos;
- dano/HP/morte;
- continuidade automática após morte;
- balanceamento final dos alcances.
