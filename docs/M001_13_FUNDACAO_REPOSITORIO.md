# RAGBIA PIXEL — M001.13 — FUNDAÇÃO DO REPOSITÓRIO / VERSIONAMENTO

**Data de início:** 15/08/2026  
**Baseline de entrada:** Ragbia Pixel CORE V0.1  
**Baseline funcional preservada:** M001.12 — CORE V0.1 — Foundation Combat Slice

## Objetivo

Colocar o CORE V0.1 sob controle de versão Git/GitHub sem alterar seu comportamento funcional, estabelecendo uma base simples, recuperável e adequada ao desenvolvimento incremental do Ragbia Pixel.

## Regra principal

A `main` representa somente estados aprovados/jogáveis.

Mudanças experimentais ou de novos marcos devem ser feitas em branches próprias e incorporadas à `main` somente após validação.

## Arquivos de infraestrutura adicionados

- `.gitignore` — exclui arquivos locais, temporários, IDE, dependências futuras e o Phaser baixado automaticamente pelo launcher;
- `.gitattributes` — impede conversões automáticas de final de linha para preservar os bytes/checksums do CORE e identifica binários;
- `.editorconfig` — padroniza UTF-8, indentação e finais de linha;
- `docs/M001_13_FUNDACAO_REPOSITORIO.md` — este registro.

Nenhum arquivo funcional do CORE V0.1 deve ser alterado nesta preparação.

## Estado de entrada validado

Antes da preparação Git, a suíte existente em `tests/` foi executada com Node.js e passou integralmente.

Isso define o estado de referência para a implantação do repositório.

## Procedimento no computador de desenvolvimento

1. Colocar a pasta `RagbiaPixel_Core_V0_1` no local definitivo de desenvolvimento.
2. Abrir o GitHub Desktop.
3. Usar **File > Add local repository** e selecionar a pasta do projeto.
4. Caso ainda não seja um repositório, usar a opção oferecida pelo GitHub Desktop para criar um repositório nessa pasta.
5. Nome recomendado do repositório: `RagbiaPixel`.
6. Não adicionar outro `.gitignore`; o projeto já possui o arquivo autoritativo.
7. Confirmar que os arquivos esperados aparecem como mudanças iniciais.
8. Criar o commit inicial com a mensagem:

   `CORE V0.1 — Foundation Combat Slice`

9. Publicar no GitHub como repositório **privado**.
10. Fazer o primeiro push.
11. Criar a tag:

   `core-v0.1`

12. Publicar/sincronizar a tag no remoto.
13. Executar `RODAR_TESTES_CORE.bat` no ambiente local.
14. Executar `INICIAR_CORE_V0_1.bat` e validar manualmente que a baseline continua jogável.

## Política inicial de branches

- `main` — baseline aprovada;
- novos trabalhos — uma branch por marco ou experimento relevante;
- nomes recomendados: `m002-...`, `m003-...` etc.;
- commits pequenos devem descrever uma alteração coerente e testável;
- não usar ZIPs intermediários como mecanismo normal de versionamento.

## Política de checkpoints

Quando um marco gerar uma baseline aprovada:

1. integrar a branch aprovada à `main`;
2. executar testes;
3. validar manualmente o build;
4. atualizar documentação/versionamento correspondente;
5. criar uma tag para o checkpoint;
6. fazer push da `main` e da tag;
7. releases/ZIPs ficam reservados para checkpoints importantes, não para cada alteração.

## Critério de fechamento do M001.13

O marco só é considerado concluído quando forem confirmados:

- repositório Git local criado;
- repositório privado publicado no GitHub;
- commit inicial do CORE V0.1 criado;
- tag `core-v0.1` criada e sincronizada;
- testes locais passando;
- launcher abrindo o jogo normalmente;
- recuperação/versionamento básico validado no GitHub Desktop.

Até lá, **CORE V0.1 continua sendo a baseline funcional autoritativa e M001.13 permanece em andamento**.
