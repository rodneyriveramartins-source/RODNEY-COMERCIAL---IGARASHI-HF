# DE-PARA HORTIGESTÃO ↔ CONTROLE (criado 13/07/2026, conferência XMLs 01–12/07)

Referência fixa pra conferência automática. Fonte: relatório de compras 01–14/07 + relatório de vendas + XMLs.

## Produtos (código Hortigestão → nosso SKU)
| Cód | Produto Hortigestão | Un | Nosso |
|---|---|---|---|
| 2002 | BATATA ESPECIAL | SC | BAT-ESP-SC25 |
| 2929 | BATATA ESP KG | KG | BAT-ESP em KG (R-007) |
| 2000 | BATATA DIVERSA | SC | BAT-DIV |
| 2075 | BATATA APERITIVO | S2 | **BAT-SEG (a confirmar com Rodney/Douglas)** — a SEG da NF 156580 foi lançada como APERITIVO |
| 2072 | BATATA FLORAO | SC | BAT-FLO |
| 2004 | BATATA X | SC | BAT-X |
| 2005 | CEBOLA CX3 | SC | CEB-CX3 |
| 2089/2090 | CEBOLA KG / CEBOLA ROXA KG | KG | CEB em KG |
| 2012/2013/2091 | CENOURA 2A / 3A / KG | CX/KG | CEN |
| 2092 | BETERRABA KG | KG | BET |
| 98 | REPOLHO VERDE | CX | REP-VER |

## Fornecedores
- "LPI - FILIAL 0007 / 0012 - UP-IBICOARA" = LAVOURA E PECUÁRIA IGARASHI (séries de NF: 1465xx/1467xx = filial 0007 · 1553xx–1566xx = filial 0012 · 789xx = outra série).
- Plano de contas: 03.01.10 = COMPRA DE MERCADORIAS · 01.10.01 = DEVOLUÇÕES DE COMPRAS.

## Peculiaridades descobertas na conferência
- NF da Lavoura sempre traz ~2,52% de desconto destacado (vNF < vProd). Custo da carga = BRUTO (R-011).
- Placa e motorista vêm SÓ do infCpl do XML (campo veicTransp vazio) — sem XML não há chave NF+PLACA.
- XML de devolução traz refNFe da NF de venda original → vínculo devolução↔venda é automático (R-012). Obs Interna NÃO vem no XML de venda → vínculo venda↔carga segue manual (R-003/RB-001).
- Vendas Carrefour/Sendas saem em KG no produto "BATATA ESPECIAL" (não no 2929) — cuidado ao somar SC.
- Notas de vasilhame (HB POOLING, "SAIDA CAIXA FLV" Carrefour) e compras de consumo (gás, EPI, móveis) NÃO entram no relatório de compras por produto — ignorar na conferência de cargas.

## Regra de conferência de vendas
Relatório de vendas por produto só serve pra conferir o dia se for puxado DEPOIS do faturamento (o de 13/07 tinha detalhe só até 11/07). Rotina: relatório do dia D puxado em D+1 de manhã + XMLs de saída de D.
