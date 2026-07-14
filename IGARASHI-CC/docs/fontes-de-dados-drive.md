# FONTES DE DADOS — Google Drive (fixado 09/07/2026 · corrigido 13/07/2026)

Pasta raiz oficial: **IGARASHI HF 2026**
https://drive.google.com/drive/folders/1HZTRNGGH-kIRAH4bNfyWnhMeUOt2hV4J
(ID: `1HZTRNGGH-kIRAH4bNfyWnhMeUOt2hV4J`)

## ⚠️ CORREÇÃO 13/07 — ID do CONTROLE
Este doc apontava para o ID `1j5CwNQS7YQs0kjyfUGnsk9rR02g-soE9xXjL6LRHCn4` (versão antiga, só CARGAS/VENDAS). O CONTROLE **vivo** — conferido em 13/07 com as 10 abas e os lançamentos de 11–13/07 — é o do Protocolo:
**ID oficial: `1MikzUBMpCEoVqkCc5ADFyTsS7TzOHZ1F13ruINTZlYs`** (R-006).
Pendência: Rodney confirmar que o arquivo antigo é duplicata e mover pro 99_ARQUIVO (R-005).

## Estrutura confirmada
- `01_OPERACIONAL` (ID: `1fJPsTC2zhL1mcx07azj4xebEx6GV_MLY`)
  - **CONTROLE DE CARREGAMENTO** (Google Sheets — fonte de verdade de TRANSAÇÕES, R-002)
    ID: `1MikzUBMpCEoVqkCc5ADFyTsS7TzOHZ1F13ruINTZlYs`
    Abas (confirmadas 13/07): CARGAS, VENDAS, QUEBRAS, FECHAMENTO, PAINEL, INSTRUCOES, LEIA-ME, PARAMETROS, CONF_CARGAS, CONF_VENDAS
  - `NOTAS` (subpasta, ID: `1VgD5hk4TF2Zi2itw5lOH_fuVXKBRyOmW`)
- `02_RELATORIOS` (ID: `1UrKwzeQvk4974vRXHCBfjaRV1mnzFZbv`)
- `03_MODELOS` (ID: `1VFmtn6EOCcxy4TjBqH4N0rn_jDQPk0-M`)
- `04_DOCUMENTOS` (ID: `1cC-jjjW1HRpGF-jrIG5IrJAmU-0vQ7hE`)
- `99_ARQUIVO` (ID: `1bH2sG4m7C297kgjCh_BE4cfOV3SO0QzI`)
- `05_FONTES_APP` — **A CRIAR** (decisão 13/07): exports padronizados do Hortigestão (uma subpasta por relatório, nome com data) — matéria-prima do app e do relatório geral.

## Regra fixada (R-005/R-006)
Toda tarefa [CARREGAMENTO], [COMPRAS] ou [VENDAS] que precise ler/gravar transação usa o CONTROLE pelo ID oficial acima — nunca planilha nova, duplicada ou busca por nome. Antes de criar registro: buscar pela chave NF_COMPRA+PLACA (ou ID COMPOSTO, R-016). Cadastros continuam no Notion.

## Observação
Sem sincronização automática — cada sessão lê o Sheets sob demanda. O conector Drive atual é SÓ-LEITURA: gravação sai como bloco pra colar ou edição via Chrome no desktop do Rodney (R-013).
