# CHECKLIST — Campos da Carga (Notion 🚛 Cargas) v1.1 (11/07/2026 · atualizado 13/07)

Schema real lido direto do Notion (data source `collection://8d49abc7-0fd3-42c7-a297-9afc2555a214`), 29 campos + título. Serve de referência fixa pra qualquer sessão: não precisa reconsultar o schema, só usar esta lista.

## BLOCO 1 — MÍNIMO IAGO (dispara msg automática assim que completo)
View já existe no Notion: "📋 RESUMO IAGO — [Produto]" (hoje só tem a de Batata; outros produtos precisam da view equivalente).

| Campo | Tipo | Fonte típica |
|---|---|---|
| ID Carga | title (eu gero: DDMM-PROD-UF) | — |
| Produto | select | XML/romaneio |
| Motorista | text | obs. XML (infCpl) ou romaneio |
| Placa caminhão | text | obs. XML (infCpl) ou romaneio |
| Classe / Calibre | text | XML/romaneio |
| Qtd (cx/sc) | number | XML/romaneio |
| Embalagem | select (SC25/SC50/CX20/CX22/CX18/BAG/Outro) | XML/romaneio |
| Preço unit. (R$/cx) | number | XML/negociação |
| Data chegada | date | romaneio/mensagem motorista |
| Status | select (A caminho→Recebida→Em venda→Vendida→Sobra/Perda) | eu atualizo |
| NF | text | XML |

## BLOCO 2 — Fica no banco (Notion), NÃO vai pro Iago, só entra no CONTROLE (Sheets) no `[FECHAR DIA]`
| Campo | Tipo | Nota 13/07 |
|---|---|---|
| Fornecedor | text | |
| Origem (UF) | select | |
| CNH motorista | text | |
| Telefone motorista | phone | |
| Hora chegada | text | |
| Recebida por | select (Reginaldo/Rodney/Maykon/Outro) | |
| Frete (R$) | number | **ESTIMADO até chegar o CTe/NF de frete (R-008 v2)** — quando o documento chegar via [ATUALIZAR], vira comprovado |
| Forma pgto fornecedor | select | |
| Vencimento pgto | date | |
| ICMS crédito (%) | select | |
| Desconto qualidade | number | |
| Observações | text | anotar "frete ESTIMADO" / "CTe nº X" aqui |

## BLOCO 3 — Calculado (eu preencho, nunca pergunto)
- Custo c/ frete (R$) — CIF = mercadoria + frete
- Custo médio/cx (R$)
- Valor total
- Cadastrada em (timestamp automático do Notion)
- No CONTROLE (aba CARGAS): **ID COMPOSTO automático** `NF-PROD(3)-CLASSE` (R-016) — não é campo do Notion, é coluna de fórmula no Sheets. Seguro entra no custo de TODA carga (R-015).

## BLOCO 4 — Fecha só no fim do ciclo de venda (acerto carga a carga)
- Qtd em sobra
- Valor sobra (R$)
- % Vendido — **PENDENTE VALIDAR**: campo é tipo `number`, não `formula`/`rollup`. Confirmar com Rodney se é lançamento manual no acerto ou cálculo automático.

## Observação de uso
- Bloco 1 completo = manda pro Iago na hora, mesmo com Bloco 2/3/4 vazios.
- Dado que chegar depois (Bloco 2/3/4) atualiza o registro e, se mudou algo do Bloco 1, reemite a mensagem do Iago.
- Compra de terceiro no balcão (R-014): sem motorista/placa — ID `NF-BALCAO`, tipo C.
- Vazio nunca é 0 nem inventado — fica como PENDENTE até o dado chegar.
