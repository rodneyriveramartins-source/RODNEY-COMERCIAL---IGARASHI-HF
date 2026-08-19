# Painel de Vendas Igarashi — arquivo único (CODEX-03 · 2026-08-18)

**O que é:** `PAINEL-VENDAS-IGARASHI.html` — painel de vendas em 1 arquivo HTML, sem nenhuma dependência externa de código. Rodney arrasta o **Relatório de Vendas por Produto** do Hortigestão (`.xls`) para dentro da página e o painel monta sozinho: acumulado do mês, venda do dia, top clientes, mix por família, faturamento por dia, produtos líderes e leitura executiva. Zero token gasto, zero upload — o arquivo é lido 100% no navegador.

## Como instalar (uma vez)
1. Copiar `PAINEL-VENDAS-IGARASHI.html` para a pasta do PC: `C:\Users\Rodney_Acer\OneDrive\Desktop\IGARASHI NORMAL`.
2. Dar dois cliques para abrir no navegador (Chrome/Edge).

## Como usar (todo dia)
1. Exportar o **Relatório de Vendas por Produto** no Hortigestão (formato `.xls`, sem abrir/salvar pelo Excel).
2. Arrastar o arquivo para qualquer lugar da página aberta (ou clicar na barra "Trocar relatório").
3. Pronto. O painel guarda o último arquivo no navegador — ao reabrir o HTML, os números do último carregamento já aparecem.

## Fatos técnicos
- O `.xls` do Hortigestão é **HTML disfarçado** — por isso o parser é `DOMParser` nativo, sem biblioteca.
- Reconhece: linha-resumo do produto (12 células, unidade SC/CX), seções `Mining - PRODUTO`, linhas de pedido (14 células: nº, data, cliente, qtde, preço, total). Ignora `TOTAIS MINING` e cabeçalhos.
- Se receber um Excel binário/xlsx (salvo por cima pelo Excel), avisa e pede o export original — não inventa número.
- Pedidos fora do mês do último dia do arquivo são ignorados **e avisados** na Leitura Executiva.
- Visual: modelo 46.45 (creme + painel verde-floresta + painel marrom-terra), paleta 47.50 em tokens CSS, tipografia Oswald + Lora (Google Fonts com fallback offline).
- Logo: **distintivo oficial 2026** (kamon dourado sobre disco vinho, enviado por Rodney em 18/08) recriado em SVG vetorial com gradiente dourado — sem fundo, escala de 58px a impressão. A arte bitmap original ainda não está no Drive/repo (pendência "logo como arquivo próprio no repo" segue aberta; o SVG cobre o uso no painel).

## Evidência da entrega (arquivo real de 18/08/2026)
22 verificações automatizadas (Playwright/Chromium) — todas passaram: acumulado R$ 3.464.095 · média diária (18 dias) R$ 192.450 · 444 pedidos · 191 clientes · ticket R$ 7.802 · venda do dia R$ 45.299 (▼76,5%, 22·20, ticket R$ 2.059) · top 5 = 33,9% · mix Batata 71,8% · líder BATATA ESPECIAL 28.521 SC / R$ 2.201.430 · restauração via localStorage após reabrir.

## Limites conhecidos
- Aceita 1 mês por arquivo (o mês do último dia); multi-mês entra como aviso, não como painel.
- "Venda do dia" = último dia presente no arquivo (dia parcial aparece em dourado no gráfico).
- Isto é **faturamento, não resultado** — custo/margem não existem neste relatório.
