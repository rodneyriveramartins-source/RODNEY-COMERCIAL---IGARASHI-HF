# ABA CONFERÊNCIA DIÁRIA + Regras R-007 a R-016 (atualizado 13/07/2026 noite — decisões Rodney)
*(Arquivo renomeado de `aba-conferencia-regras-R007-R008.md` — o nome antigo mentia sobre o conteúdo.)*

Decisão do dia (Rodney delegou, Claude assumiu e Rodney vai validar em 1 semana de uso — LEI 4).
> ✅ Protocolo v3.2 COLADO nas Instructions do Project em 13/07 (confirmado pelo Rodney). Regra nova a partir de agora: mudou regra → gerar nova versão do Protocolo → Rodney cola de novo.

## O que existe
4 abas de conferência no CONTROLE DE CARREGAMENTO (LEIA-ME, PARAMETROS, CONF_CARGAS, CONF_VENDAS). Espelho — não alimenta CARGAS/VENDAS. Fluxo: chat → Notion ao vivo (view do Iago) → [FECHAR DIA]/[ATUALIZAR] → Rodney cola e confere.

## Regras
- **R-007 — KG fiel à NF.** Nota em KG entra em KG. EQUIV. SC25 só leitura. Nunca converter na entrada.
- **R-008 v2 — Rateio por PESO + CTe comprovado.** Frete/CTe/despesas da viagem rateiam por kg. Mesma viagem = mesmo ID_FRETE e o FRETE TOTAL da viagem repetido em todas as linhas (a planilha rateia). Frete sem documento = ESTIMADO (marcar OBS). CTe chegou → casa por PLACA + NF referenciada, sobrescreve FRETE VIAGEM, IMPOSTO CTe = ICMS destacado, OBS "CTe nº X". Idem NF de serviço. *Viagem 8 (156625/156626) segue ESTIMADA — aguardando CTe.*
- **R-009 v2 — Custo Box = % do FATURAMENTO, TODA venda, VISÍVEL.** CONF_VENDAS: col X % BOX (5% editável por linha) · col Y CUSTO BOX = TOTAL BRUTO × %BOX, somado em DESPESAS DA VENDA. PARAMETROS!B7 só alimenta ALERTA e PREÇO MÍNIMO. CONF_CARGAS CUSTO BOX zerada. CUSTO UN. DA CARGA puxa custo real por ÍNDICE/CORRESP no ID COMPOSTO.
- **R-010 — Unidade na venda.** Linha de venda segue a unidade da NF DE VENDA; custo unitário na MESMA unidade. Cruzada digita por cima (Carrefour Z13=2,1380 · Z14=3,1208).
- **R-011 — Custo da carga da Lavoura = valor BRUTO da NF.** NF da Lavoura vem com ~2,52% desconto destacado; a fazenda dá o desconto e a Igarashi paga → "empata". Custo = qtd × preço (bruto). Reabre com evidência do pago real quando o financeiro sair do sistema (LEI 4).
- **R-012 — Devolução de cliente → aba QUEBRAS.** TIPO=DEVOLUCAO, OBS "DEV NF [nº] [cliente] | ref NF venda [nº]". XML de devolução traz refNFe da venda (67/71 no lote) → extração automática; ID_CARGA manual. Bloco 01–12/07 (71 dev, R$ 76.667,29) entregue 13/07.
- **R-013 — Lançamento via autorização por coluna.** Rodney joga no chat; Claude grava só nas colunas autorizadas. Conector Drive só-leitura → saída como bloco pra colar ou edição via Chrome no desktop.
- **R-014 — Compra de terceiro entra na CONF_CARGAS como TIPO C, sem placa, ID = `NF-BALCAO` (Rodney 13/07).** Ex: MLS cebola NF 6/7/13, Paiva cenoura 64051 → `64051-BALCAO`. Custo monta pela escada do tipo C. Sem chave de placa (não tem viagem própria).
- **R-015 — SEGURO entra no custo de TODAS as cargas (Rodney 13/07).** Bug atual: fórmula soma seguro no custo do tipo C mas ignora no tipo A (146711 tem seguro 41,60 e custo posto ficou 5.200, sem somar). Corrigir: CIF RECIFE / CUSTO TOTAL POSTO deve somar a coluna SEGURO em todos os tipos. Cargas de terceiro: o seguro normalmente vem embutido no CTe.
- **R-016 — ID COMPOSTO automático na aba CARGAS (Rodney 13/07).** Nova coluna = `NF_COMPRA - CÓD.PRODUTO(3) - CLASSE` (ex: `156394-BAT-ESP`). Fórmula: `=SE($C2="";"";$C2&"-"&MAIÚSCULA(ESQUERDA($E2;3))&"-"&$F2)` (BATATA=BAT, CEBOLA=CEB, CENOURA=CEN, BETERRABA=BET, REPOLHO=REP; conferir MAÇA/acento). **CRÍTICO:** o separador e o formato têm que ser IGUAIS ao que o Rodney digitar embaixo do produto no Hortigestão — senão o casamento com o XML falha. Padrão adotado: hífen "-".

## ACHADO 13/07 (verificação factual dos 302 XMLs de venda) — ID Composto NÃO aparece no XML
Varredura item a item dos 302 XMLs de saída: `infAdProd` (obs "logo abaixo do produto" na DANFE) VAZIO em 100% · nenhum padrão `NF-PROD-CLASSE` no item, no infCpl ou em obsCont. Único texto livre no item = `xProd` (nome do produto).
Duas hipóteses, indecidível com este lote: (a) obs ainda não era digitada nessas notas; (b) o campo do Hortigestão não mapeia pro `infAdProd` do XML (fica só interno). **Teste pendente:** Rodney digita `156XXX-BAT-ESP` embaixo do produto, fatura, manda o XML dessa nota → confirma se sobrevive. Se sobreviver, promove RB-001 (casamento venda↔carga automático). Se não, vínculo segue manual.

## Comando [ATUALIZAR]
`[ATUALIZAR]` + documento (CTe, XML, foto, valor) = Claude casa com cargas/vendas existentes (NF+PLACA / ID COMPOSTO / refNFe), mostra o que muda e grava/entrega o bloco na hora. [FECHAR DIA] = fechamento consolidado do dia.

## Esticar fórmulas até a linha 10.000 (Rodney 13/07 — volume alto)
Todas as abas formuladas (CARGAS, VENDAS, QUEBRAS, FECHAMENTO, CONF_CARGAS, CONF_VENDAS) precisam das fórmulas propagadas até a linha 10000. Conector Drive é só-leitura → execução: (a) via Chrome no desktop do Rodney, ou (b) Rodney seleciona a linha com fórmula → copia → cola no range até 10000. PENDENTE de execução.

## Rotas B (dormindo — LEI 6)
- RB-004: escolhido = Notion + [FECHAR DIA]/[ATUALIZAR] + Chrome. Rota B = escrita direta no Sheets (Apps Script). Acorda: Rodney esquecer de colar 3+/mês.
- RB-005: escolhido = CTe casado via [ATUALIZAR]. Rota B = pasta CTE monitorada + casamento automático. Acorda: 3+ CTes sem casar/mês.
- RB-001 (reforçado): vínculo venda↔carga manual via Obs Interna. Rota B = robô lendo ID Composto do XML de venda. **Acorda assim que o teste do XML provar que o ID Composto cai no infAdProd.**

## Pendências abertas (13/07 noite)
1. Prints dos erros de sábado → cada um vira R-xxx.
2. Fim da 1ª semana: mini-auditoria da aba.
3. Linhas 4–6 CONF_CARGAS: CONF com 65, Hortigestão com 72 (fiel à NF) — fecha com o acerto.
4. PREÇO VENDA linha 14 (Carrefour kg) — aguarda NF de venda.
5. Marcar STATUS NF das vendas do dia.
6. ~~XMLs de sábado~~ ✅ conferidos.
7. Dia 02/07 fora do CONTROLE: 10 NFs Lavoura (155796–155915, ~R$ 616,7 mil). Rodney mandar XMLs.
8. Formosa 22623 / 22757: XML existe, fora do relatório de compras — checar com Douglas.
9. Carga 156625: 830 sc, só 88 cx vinculadas, status VENDIDA — vincular resto ou corrigir.
10. ASSAI OLINDA: 5 linhas em branco na CONF_VENDAS.
11. ~~Terceiros na CONF~~ ✅ decidido R-014.
12. ~~Seguro inconsistente~~ ✅ decidido R-015 (somar em todos).
13. ~~Bloco QUEBRAS~~ ✅ entregue (colar + ID_CARGA pendente).
14. Mapear relatórios do Hortigestão → pasta 05_FONTES_APP.
15. **Esticar fórmulas até 10000** (todas as abas) — executar.
16. **ID COMPOSTO na aba CARGAS** — criar coluna + fórmula R-016.
17. ~~Protocolo v3.2 nas Instructions~~ ✅ **COLADO pelo Rodney em 13/07.**
18. **Teste do XML com ID Composto** — Rodney faturar 1 nota de teste + mandar XML. ← MAIS VALIOSA
19. **ID antigo do CONTROLE** (`1j5CwNQS7...`) — Rodney confirmar duplicata e mover pro 99_ARQUIVO (R-005).
