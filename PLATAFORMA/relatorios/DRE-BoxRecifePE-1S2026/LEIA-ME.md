# DRE Gerencial — Box Ceasa Recife/PE — 1º Semestre 2026

Três formatos do mesmo relatório, gerados a partir do painel
`Painel_DRE_BoxRecifePE_Completo.pdf` (Drive, pasta de relatórios, criado em
17/08/2026), que por sua vez vem do relatório interno **"RESULTADO 1S2026 Box
RecifePE"** (DRE Gerencial). Consolidado + 8 produtos (Batata, Cebola, Cenoura,
Repolho, Alho, Maçã, Beterraba, Mirtilo), mês a mês (jan–jun/26) + acumulado.

| Arquivo | Uso |
|---|---|
| `DRE_BoxRecifePE_1S2026.xlsx` | Análise no Excel/Sheets. 10 abas: RESUMO (fórmulas ligadas às demais) + CONSOLIDADO + 8 produtos. ACUMULADO e % são fórmulas — a planilha recalcula. |
| `DRE_BoxRecifePE_1S2026.pdf` | Leitura/impressão. 20 páginas A4 paisagem: resumo executivo + 9 seções completas. |
| `DRE_BoxRecifePE_1S2026.html` | Celular/WhatsApp. Abas, cards de KPI, gráficos de barras e tabelas com coluna fixa. Autocontido. |

## Números-chave do semestre (consolidado)

- Receita Líquida: **R$ 40.272.358,78**
- Lucro Bruto: **R$ 1.159.645,00** (2,9%)
- Despesas Operacionais: **R$ 2.242.984,50** (5,6%)
- **Resultado Líquido: −R$ 1.156.495,73 (margem −2,9%)**

## Verificações feitas na geração

- Soma dos 6 meses = acumulado em **todas** as linhas das 9 seções.
- Consolidado = soma dos 8 produtos (Lucro Bruto, Despesas, Resultado Líquido) ao centavo.
- Repolho (17.891,67) + Mirtilo (411,27) = Perdas de Mercadorias do consolidado (18.302,94). A seção MAÇÃ não tem a linha de Perdas — assim está na fonte.

## Divergência declarada (não é erro dos arquivos)

No Excel, o ACUMULADO é fórmula (soma dos meses exibidos). Como a fonte
arredonda os meses a centavos mas calculou o acumulado antes de arredondar,
algumas linhas diferem em **até R$ 0,02** do relatório-fonte. PDF e HTML usam
os valores impressos da fonte, sem recálculo.

## Regeneração

`geradores/` contém os scripts (`parse_dre.py` → `dre_dados.json` →
`gera_xlsx.py` / `gera_pdf.py` / `gera_html.py`). Dependências Python:
`pdfplumber`, `openpyxl`, `reportlab`. Rodar na ordem acima a partir do texto
extraído do PDF-fonte.
