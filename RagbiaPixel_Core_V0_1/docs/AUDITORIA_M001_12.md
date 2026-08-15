# RAGBIA PIXEL — M001.12 — CONSOLIDAÇÃO / AUDITORIA DO NÚCLEO V0

**Status:** CONCLUÍDO  
**Data:** 15/08/2026  
**Entrada:** M001.11 — Estados Visuais e Leitura da IA V0  
**Saída:** **Ragbia Pixel CORE V0.1**  
**Runtime:** Phaser 4.2.1 + JavaScript

## Objetivo

Encerrar a sequência de laboratórios M001 e criar uma única baseline funcional pós-V15.3, sem adicionar gameplay novo.

O M001.12 consolidou:

- runtime mais recente;
- testes;
- documentação;
- histórico;
- V15.3 original;
- referências visuais;
- separação entre experiência normal e debug técnico.

## Estrutura consolidada

```text
RagbiaPixel_Core_V0_1/
├─ INICIAR_CORE_V0_1.bat
├─ RODAR_TESTES_CORE.bat
├─ README.md
├─ VERSION.json
├─ TEST_REPORT_CORE_V0_1.txt
├─ phaser_map_beta/
├─ tests/
├─ docs/
└─ reference/
```

## Correção de consolidação: debug

A regra de produto aprovada é que o jogador não deve saber antecipadamente se um inimigo é passivo ou agressivo.

Por isso o CORE V0.1 inicia com debug **desligado**.

`C` alterna o modo técnico.

Somente com debug ligado aparecem:

- colisores e footprints;
- FOV;
- leash;
- PASSIVO/AGRESSIVO;
- IDLE/CHASE/ATTACK/RESET;
- coordenadas;
- contadores e eventos internos.

Com debug desligado, o HUD normal não revela esses metadados.

Telegraph de ataque, dano, impacto e reações reais continuam visíveis.

## Gameplay preservado

Nenhuma regra aprovada foi intencionalmente alterada em:

- movimento;
- gamepad;
- colisão;
- Soft Target;
- targeting amplo;
- facing lock;
- Engage;
- perseguição;
- manual override;
- continuidade do Engage;
- Dash/i-frame;
- combate;
- impacto;
- morte/respawn;
- IA passiva/agressiva;
- FOV;
- attackRange;
- leash/reset.

## Testes

Foram executados:

- `node --check` em todos os JavaScript do runtime e testes;
- suíte de regressão existente;
- novo contrato estático do CORE V0.1.

Resultado:

> **25 arquivos de teste — PASS**

Relatório:

`TEST_REPORT_CORE_V0_1.txt`

## Referências preservadas no pacote

O ZIP consolidado contém:

- documento oficial V15.3;
- ZIP original V15.3;
- V15.3 extraída;
- referências visuais de campo e interior;
- registros históricos M001;
- previews técnicos.

## Limitação conhecida

O ambiente de consolidação não possuía `phaser.min.js` já baixado. O launcher preserva o mecanismo robusto de recuperação automática do Phaser 4.2.1 na primeira execução, mantendo a cópia local depois.

A alteração funcional do M001.12 ficou restrita ao isolamento de debug/HUD; o núcleo deriva diretamente do M001.11 já validado manualmente.

## Pendências preservadas

- quatro direções/animação dos inimigos;
- depth sorting por Y;
- oclusão de copas/objetos altos;
- pathfinding/steering apenas se necessário;
- mapa real ilustrado → pixelado;
- atributos de RPG;
- framework de skills;
- NPCs/transições;
- inventário/equipamentos;
- progressão;
- UI final;
- conteúdo real.

## Fechamento

O M001 passa a ser considerado:

> **FOUNDATION COMBAT SLICE — CORE V0.1**

Novos ciclos devem partir do CORE V0.1, não dos ZIPs intermediários.

**M001.12 CONCLUÍDO**
