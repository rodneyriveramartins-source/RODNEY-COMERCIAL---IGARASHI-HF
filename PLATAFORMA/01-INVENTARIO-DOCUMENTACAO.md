# INVENTÁRIO DE DOCUMENTAÇÃO — base da "lista padrão" (GEMINI-02 · 2026-07-14 ~16h)
*Pedido do Rodney (áudio 14/07): conferir se os arquivos estão atualizados e montar uma lista de documentação para servir de padrão. Este doc é a semente dessa lista. DADO verificado no Drive/repo nesta data; o que eu não abri está marcado.*

## 1. Situação dos arquivos (dado concreto)

| Fonte | Estado em 14/07 ~16h | Verificação |
|---|---|---|
| Repo (este) — CLAUDE.md, AGENTS.md, IGARASHI-CC/ | Export de 14/07 do Project, gravado íntegro | diff byte a byte no 1º commit |
| **CONTROLE DE CARREGAMENTO** (Sheets) | **Vivo** — última modificação 14/07 07:01 | metadado Drive |
| Pastas do menu de relatórios (01_FATURAMENTO … 07_PRECOS) | **Criadas hoje 14/07 09:11** dentro de 02_RELATORIOS — batem com `menu-relatorios.md` | listagem Drive |
| Pasta **CLAUDE CODE** (raiz IGARASHI HF 2026) | Criada hoje 15:33 pelo Rodney, contém IGARASHI-CC/docs — espelho do pacote deste repo | listagem Drive |
| HUB (3 arquivos) | Inventariado em `referencias/hub/LEIA-ME.md` | commit 11b3627 |

## 2. Relatórios soltos em 02_RELATORIOS — EXISTEM MAS NÃO ESTÃO NOS DOCS (divergência)

| Arquivo | Criado/modif. | O que parece ser (não abri — PENDENTE catalogar) |
|---|---|---|
| `Relatorios Igarashi HF - offline.html` (388 KB) | **hoje 07:11** | pacote de relatórios offline — novo, pós-export |
| `PAINEL_EXECUTIVO_ACUMULADO_X_DIA - MODELO 1.html` | 09/07 · **modif. hoje 13:35** | candidato a modelo do relatório nº 3/4 do menu |
| `PAINEL_EXECUTIVO_ACUMULADO_X_DIA -MODELO 2.html` | 10/07 · **modif. hoje 13:36** | idem — dois modelos concorrendo (Lei 2: decidir por critério e congelar) |
| `PRECIFICADOR_DIARIO_IGARASHI.html` (242 KB) | 09/07 | ferramenta de preço — não está no menu de relatórios |
| `TABELA_PRECOS_FEIRA_BOX_09JUL_FINAL` (.html + .jpg) | 09/07 | modelo provável do relatório nº 7 |
| `CADASTRO_PRESTADORES_IGARASHI_v2.html` | 09/07 | formulário de cadastro — não citado nos docs |
| `ECOSSISTEMA IGARASHI.html` | 09/07 | mapa do ecossistema |
| `PAINEL_EXECUTIVO_1007_ANONIMO.jpg` + `PAINEL_EXECUTIVO_ACUMULADO_X_DIA.jpg` | 09–10/07 | prints entregues |

**Análise:** o repo está sincronizado com o export de 14/07, mas o Drive já andou depois (offline.html de hoje + modelos de painel mexidos hoje à tarde). Nada disso invalida os docs — são artefatos de relatório, não regra de negócio. **Sugestão:** na 1ª execução de cada relatório do menu, o modelo vencedor é congelado e esta lista vira o catálogo oficial (nome, fonte, pasta, modelo aprovado, data).

## 3. PLACAR DA PLATAFORMA (atualizado 14/07 ~16h)

| Chave | Estado | Faltando | Próxima ação (dono) |
|---|---|---|---|
| PERGUNTAS-1-13 | aberto | respostas | Rodney responde (áudio/texto) |
| **TESTE-XML-ID-COMPOSTO (RB-001)** | 🔥 quente — Rodney identificou no Hortigestão campo ao lado do produto que ninguém preenche **e que sai no XML** | o XML de teste como evidência (Lei 4) | Rodney fatura 1 nota com o ID COMPOSTO nesse campo e manda o XML |
| AUDIO-14/07-PARTE-2 | cortado no meio ("Ele marca lá e…") | o resto da explicação | Rodney reenvia/continua |
| HUB-OFICIAL | aberto | qual design vale (pills × launcher) | Rodney decide |
| MODELO-PAINEL-EXECUTIVO | 2 modelos concorrendo, mexidos hoje | critério + decisão (Lei 2) | Rodney escolhe na 1ª execução do menu 3/4 |
| LOGO-ARQUIVO | pendente | logo como arquivo no repo | extrair do Drive na construção ou Rodney envia |
| CARTAS-ESPECIALISTAS | PENDENTE aprovação | assinatura do Rodney (pergunta 13) | Rodney |
| PASTA-NOTAS-VAZIA | divergência: a pasta oficial NOTAS (01_OPERACIONAL) está vazia — nenhum XML mora na casa das notas | os XMLs (chegam por e-mail hoje) | Rodney decide se NOTAS vira o depósito padrão dos XMLs — resolveria o teste RB-001 e alimentaria a Plataforma |
