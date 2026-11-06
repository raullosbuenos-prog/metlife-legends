# Equipe Legends · Páginas de captura

Duas páginas responsivas, em português, com um ponto de entrada:
- /carreira/ para pessoas que querem conhecer a oportunidade profissional.
- /seguro/ para pessoas que querem conversar sobre soluções de proteção.

## Visual
- Carreira: base grafite da identidade Legends.
- Proteção: paleta #F6F4EF, #D9EAF1, #123C49 e #4B8293.

## Para publicar
O workflow .github/workflows/pages.yml publica o site no GitHub Pages após ativação de Pages no repositório. Endereços esperados:
- https://raullosbuenos-prog.github.io/metlife-legends/
- https://raullosbuenos-prog.github.io/metlife-legends/carreira/
- https://raullosbuenos-prog.github.io/metlife-legends/seguro/

## Formulários
apps-script/Code.gs contém um receptor para salvar leads em abas separadas nas planilhas indicadas. Antes do lançamento:
1. validar o aviso de privacidade em privacidade.html;
2. implantar o Apps Script como Web App na conta autorizada;
3. inserir a URL /exec em FORM_ENDPOINT no arquivo assets/app.js;
4. testar um envio em cada página.

Os formulários coletam nome, WhatsApp, e-mail, cidade/estado e tema de interesse. Evitam dados de saúde, documentos e promessas de cobertura, renda ou contratação.
