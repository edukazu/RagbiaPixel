# RAGBIA PIXEL — M001.4B — IMPACTO DE ATAQUE V1

**Status:** APROVADO
**Base:** M001.4A aprovado  
**Escopo:** exclusivamente feedback de impacto

---

## 1. Motivo do marco

No M001.4A foram aprovados:

- animação de morte;
- dano em amarelo;
- remoção da colisão após a morte;
- respawn de laboratório.

O impacto visual do ataque, porém, foi considerado praticamente imperceptível.

O M001.4B altera somente essa leitura de contato.

---

## 2. Impacto melee

Para o Guerreiro foi aplicado um perfil deliberadamente mais pesado:

- hit-stop: **72 ms**;
- flash mais forte;
- burst pixelado amplo;
- knock visual máximo: **18 px**;
- shake de câmera curto e mais perceptível.

O dano continua ocorrendo no instante de impacto do golpe.

---

## 3. Impacto da flecha

Para o Arqueiro o feedback é menor para preservar a diferença de peso:

- hit-stop: **46 ms**;
- flash forte, mas mais curto;
- burst menor que o melee;
- knock visual máximo: **11 px**;
- shake menor.

A flecha continua causando dano apenas quando o projétil alcança o inimigo.

---

## 4. Knock apenas visual

O deslocamento criado neste marco não é uma mecânica de knockback.

A posição lógica da entidade permanece intacta. Colisão e targeting continuam usando a posição real, enquanto o sprite recebe apenas um offset visual temporário e retorna ao ponto original.

Knockback físico, stagger ou deslocamento real ficam fora deste marco.

---

## 5. O que não mudou

- Player HP 1 / ATK 1;
- Slime HP 1 / ATK 0,5;
- inimigos ainda não atacam;
- Soft Target;
- FOV;
- Attack Range;
- Engage;
- facing lock;
- colisão com cenário e inimigos;
- morte squash + fade;
- respawn em 3 segundos;
- dano amarelo.

---

## 6. Critério de aprovação

O acerto deve ser percebido imediatamente sem precisar observar o número de dano.

A sensação desejada é:

> **contato → pequena pausa → impacto → reação visual do inimigo**

O Guerreiro deve parecer mais pesado que a flecha, mas nenhum dos dois deve transformar cada ataque em uma explosão exagerada.

---

## 7. Próximo passo

Somente após validar a sensação de impacto decidir o próximo marco. Não ampliar automaticamente para IA ou novas mecânicas durante este gate.
