# AUDITORIA DO CONTROLE — rodada 1: aba CARGAS (FABLE-01 · 2026-07-14)
*Pedido do Rodney: "revisar a planilha inteira, refazer o layout, fazer os dashboards". Rodada 1 = o que o conector alcançou: aba CARGAS completa (47 linhas, 01–13/07). As outras 9 abas NÃO vieram na leitura — cobertura declarada, não silenciosa. Achados por severidade, com evidência.*

## DECISÃO REGISTRADA NESTA DATA — RB-001 PROMOVIDA ✅
- **O quê:** vínculo venda↔carga automático via XML. O time digita o **ID COMPOSTO** no campo **Nº da O.C.** ao lado do produto no Hortigestão; ele sai no XML de venda na tag **`xPed`** (campo "pedido de compra" do item da NFe).
- **Quem aprovou/testou:** Rodney, teste real faturado, 14/07/2026 ("fiz o teste e deu certo").
- **Evidência:** teste do Rodney (palavra do dono). **PENDENTE arquivar:** 1 XML da nota de teste no repo/NOTAS como evidência permanente + confirmação do texto exato que caiu no `xPed`.
- **⚠️ Restrição técnica do `xPed`: máximo 15 caracteres.** `156394-BAT-ESP` = 14, cabe. Classes têm que usar código curto (ESP, DIV, SEG, FLO, X, CX3) — "CALIBRE III G" por extenso NÃO cabe. Padronizar a tabela de códigos de classe antes de espalhar pro time.

## ACHADOS DA ABA CARGAS (severidade decrescente)

### A1 · GRAVE — Custo da Lavoura contradiz a R-011 (custo = BRUTO)
Toda linha da Lavoura calcula `CUSTO_POSTO = VLR_PRODUTOS − DESCONTO_NF` (ex.: NF 156394: 30.240 − 518,40 = 29.721,60; NF 156285: 48.000 − 816 = 47.184). A R-011 manda custo = **BRUTO** (30.240 / 48.000). Ou a regra mudou (aí atualiza o Protocolo), ou a planilha está errada → margem de TODA carga da Lavoura sai inflada em ~1,7%.

### A2 · GRAVE — Coluna DESCONTO_NF mistura duas grandezas (desconto E seguro)
Hipótese com evidência forte: `DESCONTO_NF ≈ desconto Lavoura 2,52% − seguro 0,8%`.
- NF 156138: 50.575 × 2,52% = 1.274,49; menos 0,8% (404,60) = **869,89** — exatamente o valor da célula.
- Linhas sem desconto ficam **negativas** = só o seguro: NF 156108: 28.500 × 0,8% = **228** = célula (−228). Idem 155926 (−3,84 = 0,8% de 480), 156141 (−380,80 = 0,8% de 47.600).
Consequência: não existe coluna SEGURO visível (R-015 diz que seguro entra em TODA carga), o desconto não é auditável e o sinal negativo confunde qualquer leitura. **No layout novo: DESCONTO e SEGURO em colunas separadas.**

### A3 · MÉDIO — Colunas prometidas pelos docs que NÃO existem na CARGAS
- **ID COMPOSTO** (R-016) — não existe. Agora que a RB-001 foi promovida, essa coluna é a chave do casamento automático. Fórmula pronta no doc: `=SE($C2="";"";$C2&"-"&MAIÚSCULA(ESQUERDA($E2;3))&"-"&$F2)` — atenção: com PRODUTO = "BATATA ORCHESTRA", ESQUERDA(3) dá "BAT" ✓, mas CLASSE tem valores longos ("CALIBRE III G", "ESP X") que quebram o padrão de 15 chars do xPed (ver acima).
- **TIPO (A/B/C/D)** — não existe como coluna; está improvisado em OBS ("Tipo carga PENDENTE"). Existe FLUXO (GALPAO/DIRETA), que é outra coisa.
- **SEGURO** — não existe (ver A2).

### A4 · MÉDIO — A chave NF+PLACA NÃO é única na prática
NF com 2+ classes gera 2+ linhas com a MESMA chave: 156108-SNZ3J02 (×2), 156138-AUF9I97 (×3), 156141, 156150, 156315, 156325, 3373, 7034 (×2 cada). Não é erro de lançamento — é o modelo de dados: a chave única real é o **ID COMPOSTO** (NF+produto+classe). Os docs precisam dizer isso com clareza, e a Plataforma nasce com essa chave.

### A5 · BAIXO — Vazios inconsistentes
Placa ausente vira "PENDENTE" na chave (156310-PENDENTE ✓ certo), mas motorista ausente às vezes fica em branco (NFs 78989/78990) em vez de PENDENTE. Padronizar: vazio = PENDENTE, sempre (Regra de Ouro 5).

### O que está CERTO (registrar também)
- R-007 respeitada: KG entra em KG (155926: 120 KG × 4 = 480 ✓).
- R-008 v2 respeitada nas cebolas de 13/07: CTe RODOXISTO 17359 rateado por sacas na viagem RQX3D40 (9,2235/sc × 750/250 ✓ conferido: 6.917,65 + 2.305,88 = 9.223,53 = total do CTe).
- Frete estimado marcado em OBS até o CTe ✓. Excesso autorizado = 2 NFs mesma placa ✓ (79308/79309).

## COBERTURA E PRÓXIMA RODADA
- **Não auditado ainda:** VENDAS, QUEBRAS, FECHAMENTO, PAINEL, PARAMETROS, CONF_CARGAS, CONF_VENDAS, INSTRUCOES, LEIA-ME (o conector devolveu só a 1ª aba). O bug conhecido do seguro no tipo A (R-015) mora na CONF_CARGAS — segue não verificado por mim.
- **Caminho para a rodada 2:** Rodney baixa o CONTROLE como .xlsx (Arquivo → Fazer download → Excel) e **anexa aqui no chat** — aí eu abro as 10 abas com fórmulas e audito tudo de uma vez.

## SEQUÊNCIA APROVADA PELO RODNEY (áudio 14/07) — ordem de execução
1. ✅ Teste do XML (feito — RB-001 promovida).
2. 🔄 Revisar a planilha inteira (rodada 1 feita; rodada 2 aguarda o .xlsx).
3. ⏭ Refazer o layout do CONTROLE — sai como SPEC com teste de aceite (Lei 2), Rodney bate o martelo antes (casa transacional, time e Iago usam).
4. ⏭ Dashboards em tempo real — tela nº 1: margem por carga (motor: ID COMPOSTO via xPed).
