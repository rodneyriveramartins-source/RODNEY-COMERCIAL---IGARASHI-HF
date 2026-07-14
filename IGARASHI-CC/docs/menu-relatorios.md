# MENU DE RELATÓRIOS — comando `/LISTA DE RELATÓRIOS`
*Cardápio fixo de relatórios. Rodney chama o número, o agente já sabe fonte, formato e pasta de destino. Numeração CONGELA (nunca troca de número; relatório novo entra no fim). Criado 14/07/2026.*

## COMO FUNCIONA
- Rodney digita `/LISTA DE RELATÓRIOS` → agente devolve a lista numerada abaixo.
- Rodney escolhe um número → agente executa conforme o gatilho:
  - **A (eu gero):** agente puxa o dado da fonte, monta o relatório no padrão visual e salva na pasta de destino.
  - **B (molde):** agente devolve um molde/lista pronta; Rodney cola a informação e reenvia pelo chat; agente finaliza e salva.
- Relatório ainda não montado: na 1ª vez o agente pergunta o modelo (ou Rodney cola um exemplo). A partir daí fica pronto pra sempre naquela pasta.
- Entrega padrão: HTML pra print/WhatsApp (identidade visual oficial), salvo na pasta do Drive.

## LISTA (o que o comando devolve)
```
LISTA DE RELATÓRIOS
1 - Relatório de faturamento
2 - Relatório de venda por vendedor
3 - Painel Executivo (sábado)
4 - Painel Executivo (fechamento do mês)
5 - [reservado]
6 - Tabela de estoque (eu te mando a lista, você preenche)
7 - Tabela de preços
```

## MAPA (fonte + gatilho + destino no Drive)
Pasta raiz dos relatórios: `02_RELATORIOS` (`1UrKwzeQvk4974vRXHCBfjaRV1mnzFZbv`)

| Nº | Relatório | Gatilho | Fonte | Pasta destino | ID da pasta |
|---|---|---|---|---|---|
| 1 | Faturamento | A – eu gero | CONTROLE (Sheets) | `01_FATURAMENTO` | `1apFWobAKwJ0Ukwh_8sCdlzYI3IQLrTwC` |
| 2 | Venda por vendedor | A – eu gero | Export Hortigestão | `02_VENDA_VENDEDOR` | `1gyWRpvm1gCWrRteVHO1kw1jQv97YbSW5` |
| 3 | Painel Executivo (sábado) | A – eu gero | CONTROLE + vendas | `03_PAINEL_SABADO` | `1xCS9VGvphV-XG1oD5vkFB9aOz8Ou-Crs` |
| 4 | Painel Executivo (fechamento mês) | A – eu gero | CONTROLE + vendas | `04_PAINEL_MES` | `1As5mdPsMIGvDV1lC5Q2mRrd-adgn2fmv` |
| 5 | [reservado] | — | — | `05_RESERVADO` | `12ER0poDfBCWw5CgN6B8KZxNK8VXAmHK9` |
| 6 | Tabela de estoque | B – molde | lista de produtos (Notion) | `06_ESTOQUE` | `1MjM_AMRYz3HsboCB_pV1aIm-HwXH0Y9g` |
| 7 | Tabela de preços | B – molde | Rodney preenche | `07_PRECOS` | `1AA8CnTU8zaXmVdS6oVluZCvQrXFKhVyb` |

## REGRAS DO MENU
- Numeração congela. Relatório novo = próximo número livre (8, 9, 10...), nunca reaproveita.
- Nome do arquivo salvo: `TIPO_AAAA-MM-DD` (ex: `FATURAMENTO_2026-07-14`). Recorrentes ficam datados dentro da pasta do tipo.
- Cada relatório só vira "pronto" depois que Rodney aprova o modelo na 1ª execução (LEI 2 — critério antes da criação).
- SIGILO mantido: relatório pra Iago/fazendas nunca leva nome de cliente.

## STATUS DOS RELATÓRIOS (o que já tem modelo pronto)
- 1 Faturamento — PENDENTE (definir modelo)
- 2 Venda por vendedor — PENDENTE
- 3 Painel sábado — PENDENTE
- 4 Painel fechamento mês — PENDENTE
- 5 Reservado — vazio
- 6 Tabela de estoque — PENDENTE (definir lista-base de produtos)
- 7 Tabela de preços — PENDENTE

## ROTA B (RB-004 — adormecida)
Escolhido = comando manual `/LISTA` (Rodney chama, agente monta e ele envia). Rota B = pipeline agendado (painel de sábado sai sozinho via API sem Rodney chamar). Acorda se: Rodney esquecer/atrasar envio de painel recorrente 3+ vezes no mês.
