# Ragbia Pixel — CORE V0.1

Baseline consolidada após o ciclo M001.

## Executar

Use:

`INICIAR_CORE_V0_1.bat`

O projeto usa **Phaser 4.2.1** fixado. Se a biblioteca não estiver em `phaser_map_beta/vendor/`, o launcher tenta recuperá-la automaticamente e mantém a cópia local.

## Debug

O CORE abre com debug **desligado**.

Pressione `C` para alternar o diagnóstico técnico. Somente em debug aparecem:

- colisores;
- FOV;
- leash;
- estados internos da IA;
- identificação técnica de passivo/agressivo;
- coordenadas e eventos internos.

Esses dados não fazem parte da experiência final do jogador.

## Estrutura

- `phaser_map_beta/` — runtime consolidado atual;
- `tests/` — regressões e contratos técnicos;
- `docs/` — checkpoint, auditoria e histórico do M001;
- `reference/` — V15.3 original e documento-base;
- `VERSION.json` — identificação da baseline.

## Baselines

- referência original: **Ragbia Pixel FULL HD V15.3**;
- referência visual de segurança: **V12.1**;
- baseline funcional pós-protótipo: **CORE V0.1**.

## Regra

**incremental → testável → validado → fechado → próximo sistema**.
