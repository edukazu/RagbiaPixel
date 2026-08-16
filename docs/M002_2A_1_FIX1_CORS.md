# M002.2A.1 — FIX1 — Carregamento local por HTTP

## Problema observado

Ao abrir `phaser_map_beta/index.html` diretamente pelo Windows, o navegador usa o protocolo `file://`.

O Phaser carrega assets como `assets/house_avo_pixel_v1.png` por XHR/fetch. Navegadores modernos bloqueiam esse acesso entre arquivos locais por política CORS, fazendo o cenário não carregar e deixando apenas HUD/personagem sobre fundo escuro.

## Correção

O launcher `INICIAR_CORE_V0_1.bat` passa a:

1. validar a presença de Node.js;
2. iniciar `tools/local_server.js`;
3. servir o repositório localmente em `http://127.0.0.1:41731`;
4. abrir `phaser_map_beta/index.html` através de HTTP.

Nenhuma dependência npm adicional é necessária. O servidor usa apenas módulos nativos do Node.js.

## Regra daqui em diante

Não testar o runtime Phaser abrindo `index.html` diretamente por `file://`.

Usar sempre:

`INICIAR_CORE_V0_1.bat`

ou outro launcher HTTP equivalente.
