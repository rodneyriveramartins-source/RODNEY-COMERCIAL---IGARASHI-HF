# MANUAL DE OPERAÇÃO — IGARASHI HF × CLAUDE · v1.1 (13/07/2026 noite)

Fonte: .docx/PDF entregue no chat em 13/07 + atualizações da conferência de 13/07 (R-009 a R-016, comando [ATUALIZAR]). Erro corrigido ([CORREÇÃO]) entra aqui e regenera o Word.

## 1. O sistema em uma página — as três casas
Toda informação mora em UMA casa, nunca em duas.
- **CHAT** = porta de entrada de tudo (mensagem, XML, foto, áudio). É aqui que se lança, nunca direto na planilha durante o dia.
- **NOTION** = banco vivo do dia (cadastros + cargas em andamento). Claude grava; Iago acompanha a view dele.
- **CONTROLE (Sheets)** = consolidação oficial. Recebe o bloco do [FECHAR DIA] 1x/dia; Rodney cola e confere.

Regra que resolve 90% das dúvidas: aconteceu algo? Manda no CHAT do jeito que estiver — o resto é problema do Claude.

## 2. Rotina do dia
Durante o dia: (1) chegou info de carga → manda no chat na hora, sem formatar; (2) Claude grava no Notion e, com o mínimo Iago completo (motorista+placa+produto+classe+qtd), devolve a mensagem do Iago automática; (3) dado novo (CTe, correção, NF) → manda com **[ATUALIZAR]** que Claude casa e atualiza na hora, sem esperar o fechamento.
Fim do dia: (4) [FECHAR DIA] → bloco pronto; (5) colar nas abas; (6) conferir alertas — erro vira [CORREÇÃO]; (7) mandar XMLs pendentes (NF obrigatória em tudo). D+1 de manhã: puxar o relatório de vendas do dia anterior (só serve DEPOIS do faturamento) pra conferência.

## 3. [CARREGAMENTO] — 4 jeitos de lançar
1. Mensagem simples: "[CARREGAMENTO] Saiu carga: motorista Cleiton Claves, placa DMR7G30, 800 sc batata especial a R$72, frete 8.800, box 1."
2. Só o XML anexado ("segue XML da 156394" — motorista/placa saem da observação).
3. Foto do romaneio ou print do WhatsApp: "lança essa carga aí".
4. Pingado aos poucos — Claude atualiza o registro conforme chega.
Regras: não sabe = não inventa (PENDENTE); chave NF+PLACA, buscar antes de criar; 1 NF = 1 produto; KG entra em KG (R-007); frete sem CTe = ESTIMADO até o documento chegar (R-008 v2); compra de terceiro no balcão = tipo C, sem placa, ID `NF-BALCAO` (R-014); capacidade TRUCK 600/BITRUCK 800/CARRETINHA 1.200 sc — excesso só autorizado pelo Rodney = 2 NFs; mensagem do Iago nunca leva cliente (SIGILO).

## 4. [VENDAS]
Vendedor põe ID COMPOSTO (ex.: 156394-BAT-ESP) na Obs. Interna do Hortigestão → fim do dia manda o export no chat → Claude casa venda↔carga e calcula margem real. Nunca FIFO (R-003): só ID COMPOSTO, par DIRETA ou ordem do Rodney. Venda sem vínculo = alerta SEM CARGA VINCULADA, resolver antes de fechar. Devolução de cliente → aba QUEBRAS com NF de devolução + NF de venda na OBS (R-012 — o XML da devolução entrega as duas sozinho). Cliente novo: verificar família antes. Custo nunca se confunde com preço de venda.
*Em teste (13/07): se a obs digitada embaixo do produto sair no XML de venda (infAdProd), o casamento vira automático — aguardando 1 nota de teste do Rodney.*

## 5. Outras tags
- [COMPRAS]: XML/cotação/preço de praça → carga nasce COMPRADA, fornecedor novo pro Notion. Conferência tripla quando houver relatório: XML × Hortigestão × CONF.
- [FINANCEIRO]: pendência/recebível/acerto → Notion Pendências, alerta vencidos, acerto carga a carga.
- [MARKETING]: relatórios e materiais na identidade oficial (verde #051F20 + dourado #D9C988, Barlow), prontos pra print/WhatsApp.
- [PESSOAL]: agenda → Google Agenda; finanças pessoais → Notion. Nunca mistura com comercial.
Sem tag? Claude deduz e declara.

## 6. A planilha de conferência
Abas CONF (LEIA-ME, PARAMETROS, CONF_CARGAS, CONF_VENDAS) — espelho do dia, não mexe nas abas antigas. Cores: verde claro = entrada; cinza = fórmula (não digitar); cabeçalho dourado = campos do Iago (sem cliente). Alertas: SEM CARGA VINCULADA · ABAIXO DO MINIMO (vender abaixo só consciente, avisar Rodney) · MARGEM NEGATIVA.
Custos: escada TIPO A/B/C/D; **SEGURO entra no custo de TODAS as cargas** (R-015); **custo box = % do faturamento, cobrado na VENDA** (coluna % BOX editável por linha, R-009 v2); frete de viagem multi-linha rateia por PESO, mesmo ID_FRETE e frete TOTAL repetido em cada linha (R-008). Percentuais moram em PARAMETROS. Fórmulas propagadas até a linha 10.000 (volume alto — pendente executar).

## 7. Comandos
direto · **[ATUALIZAR]** (novo — casa documento com carga/venda existente e atualiza na hora) · [FECHAR DIA] · [STATUS] · [CORREÇÃO]+erro (vira R-xxx) · [FABRICA]+problema (aprovação Rodney) · [AUDITORIA] (mensal).

## 8. Regras de ouro
R-001 estrutura só reabre com uso real · R-002 Notion vivo/CONTROLE consolida · R-003 vínculo só explícito · R-004 canal por palavra-chave (validar) · R-005 sistema novo nunca em pasta velha · R-006 CONTROLE pelo ID fixo · R-007 KG fiel à NF · R-008 rateio por peso + frete ESTIMADO até o CTe · R-009 custo box % do faturamento na venda · R-010 venda na unidade da NF de venda · R-011 custo Lavoura = bruto da NF · R-012 devolução → QUEBRAS com refNFe · R-013 gravação só em coluna autorizada · R-014 terceiro = tipo C, ID NF-BALCAO · R-015 seguro em toda carga · R-016 ID COMPOSTO automático na CARGAS.
NUNCA: inventar dado (vazio=PENDENTE) · digitar em fórmula · duplicar NF+PLACA · cliente pro Iago/fazendas · mercadoria sem NF · misturar pessoal com comercial.

## 9. Funcionário novo — primeiro dia
Ler o manual (30 min) → assistir 3 lançamentos reais → fazer 1 supervisionado de cada tipo → na dúvida, pergunta no chat. Errar no chat custa uma correção; errar escondido custa uma carga.
