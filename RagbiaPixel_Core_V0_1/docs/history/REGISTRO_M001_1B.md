# RAGBIA PIXEL — REGISTRO M001.1B

## Paridade Visual Phaser

**Baseline:** Ragbia Pixel FULL HD V15.3  
**Tecnologia:** Phaser 4.2.1 / Canvas  
**Status:** AGUARDANDO VALIDAÇÃO DO USUÁRIO

---

## 1. Motivo do gate

O M001.1 FIX foi aprovado somente para escala e câmera. A avaliação identificou ausência visual de personagens, inimigos, caminhada, flecha e mapa pixelado.

Esses elementos fazem parte da direção visual mínima da V15.3 e precisam existir antes de colisão e targeting.

---

## 2. Causa técnica encontrada

O build anterior registrava CanvasTextures com:

```js
textures.addCanvas(key, canvas, true)
```

No Phaser, o terceiro argumento é `skipCache`.

Com `true`, a textura era criada mas não era armazenada no Texture Manager para uso posterior por objetos `Image`.

A correção é:

```js
textures.addCanvas(key, canvas)
```

A correção foi aplicada a:

- Guerreiro;
- Arqueiro;
- frames de caminhada;
- Slimes;
- flecha;
- seis chunks do Mapa Beta 01.

---

## 3. Escopo visual restaurado

### Personagens

- Guerreiro;
- Arqueiro;
- Norte, Sul, Leste e Oeste;
- idle;
- três fases simples de caminhada.

### Inimigos

- Slime pixelado;
- três fases simples de idle/bounce para leitura no cenário.

### Ataques

**Guerreiro**
- espada temporária;
- trajetória em arco;
- ancoragem ao jogador durante o golpe.

**Arqueiro**
- arco temporário;
- puxada;
- disparo;
- flecha pixelada visível;
- projétil independente após a soltura.

### Mapa

- Mapa Beta 01 gerado em pixel art por código;
- 4608 × 2688;
- seis chunks de 1536 × 1344;
- câmera já aprovada preservada.

---

## 4. Proteção contra regressão silenciosa

O runtime valida no boot a existência das texturas essenciais no Texture Manager.

Se personagem, Slime, flecha ou algum chunk do mapa não estiver disponível, a execução mostra erro explícito e interrompe o gate.

---

## 5. Critério de aprovação

Avaliar apenas:

1. personagens aparecem corretamente;
2. inimigos aparecem corretamente;
3. quatro direções são visíveis;
4. caminhada de três fases é perceptível;
5. espada e arco continuam legíveis;
6. flecha aparece e viaja de forma independente;
7. mapa pixelado aparece;
8. escala continua adequada;
9. câmera continua adequada.

Ainda NÃO avaliar colisão ou targeting.

---

## 6. Próximo passo após aprovação

Somente com M001.1B aprovado:

> **M001.2 — Colisão V0**

Primeiro conjunto previsto:

- limites;
- construções;
- troncos;
- pedras;
- cercas;
- água.

Targeting permanece posterior à primeira colisão validada.
