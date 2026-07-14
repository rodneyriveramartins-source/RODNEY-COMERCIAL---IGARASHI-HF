# PLATAFORMA IGARASHI — Descoberta e Perguntas (P2 · FABLE-01)
*Criado 2026-07-14, a partir do áudio do Rodney. Este doc registra: a missão como foi dita, o que já está decidido pelos documentos-base, as perguntas abertas e as escolhas técnicas declaradas. As respostas do Rodney entram aqui e viram a SPEC v1 (teste de aceite congelado) antes da construção.*

---

## 1. A MISSÃO, NAS PALAVRAS DELE (dado concreto — resumo fiel do áudio de 14/07)

- Desenvolver o **app de gestão comercial** — a plataforma da empresa (nome ainda não definido; substituirá o nome pessoal pelo nome da empresa, plataforma Igarashi).
- **Dor central:** o sistema atual (Hortigestão) recebe nota e informação mas **não devolve nada** — nenhum relatório, nenhum acompanhamento. Exemplo dado: uma carga de batata chega, é vendida para 6 clientes, e ele **não consegue saber se está ganhando, perdendo ou empatando** naquela carga, nem quanta margem tem "pra queimar".
- **Objetivo:** dados depurados, tratados o mais rápido possível, **na mão, em tempo quase real** — porque as decisões do CEASA são abruptas: ou faz ou não faz, e o prejuízo se repete.
- Perfil de quem usa: gestor comercial + sócio + vendedor, celular na mão, galpão da madrugada ao meio-dia.
- Pedidos explícitos: (a) criar agentes e sistema cada vez mais robusto/tecnológico; (b) **landing page** da empresa + documentação do aplicativo (o que tem, o que não tem, telas); (c) **perguntar muito antes de começar**; (d) código limpo, seguro, bonito e funcional; (e) usar CLAUDE.md + AGENTS.md como guia permanente.

## 2. O QUE OS DOCUMENTOS-BASE JÁ DECIDEM (não se pergunta de novo — Lei 4)

| Já decidido | Fonte |
|---|---|
| Chave da carga = `NF_COMPRA+PLACA`; vínculo venda↔carga = ID COMPOSTO `NF-PROD(3)-CLASSE`, nunca FIFO | R-003, R-016 |
| Escada de custo A/B/C/D; seguro em toda carga; custo box = % do faturamento na venda | R-008, R-009, R-015 |
| Casas de dado hoje: Notion = cadastro + lançamento vivo; CONTROLE (Sheets) = consolidação | R-002 v2 |
| SIGILO: nada com nome de cliente vai para Iago/fazendas | Protocolo |
| Identidade visual: verde #051F20→#8EB69B→#DAF1DE + dourado #D9C988, fonte Barlow, logo em chip branco | Código-Fonte |
| Vazio = PENDENTE; nunca inventar dado; 1 NF = 1 produto; KG fiel à NF | R-005, R-007 |
| Construção só com SPEC e teste de aceite congelado; autor não audita a própria obra | Lei 2, Regra de Ouro 1 |

## 3. A DECISÃO ARQUITETURAL CENTRAL (análise — a pergunta mais importante do Bloco C)

O app mexe na R-002 (casa única de transação). Dois caminhos:

- **Fase 1 — App de LEITURA/inteligência (recomendado para começar):** o app lê o CONTROLE (Sheets) e o Notion como estão hoje e entrega a tela que resolve a dor nº 1 — margem por carga em tempo real. Lançamento continua como hoje (chat → Notion → [FECHAR DIA] → CONTROLE). Nenhuma casa muda, risco baixo, valor na mão em semanas.
- **Fase 2 — App vira a CASA transacional (Rota B RB-C2/RB-002 promovida):** banco próprio (PostgreSQL), o app recebe XML/foto direto (Lei 5), o Sheets vira espelho de leitura para o Iago. Mais poderoso; exige migração com caminho de volta e evidência da Fase 1 funcionando (Lei 4).

**Rota B registrada desta decisão (Lei 6):** se a Fase 1 provar que a latência do Sheets ou o lançamento manual travam a operação (3+ ocorrências registradas como R-xxx no mês), a Fase 2 é promovida imediatamente com os dados da Fase 1 como espelho.

## 4. ESCOLHAS TÉCNICAS DECLARADAS (FABLE-01 escolhe e declara — não são perguntas)

- **Stack:** TypeScript + Next.js/React (app e landing na mesma base), Tailwind para o visual no padrão da marca. Fase 2: PostgreSQL (Supabase) como banco. Testes automatizados desde o primeiro commit.
- **Formato:** PWA instalável — abre como app no celular, sem depender de loja da Apple/Google, atualiza sozinho. (Confirmação no Bloco B, pergunta 5.)
- **Repositório:** este (`RODNEY-COMERCIAL---IGARASHI-HF`), pasta `PLATAFORMA/`. O app terá o próprio CLAUDE.md técnico dentro da pasta dele quando a construção abrir (§3 da Central — projeto de código tem o CLAUDE.md dele).

## 5. AS PERGUNTAS (respostas do Rodney preenchem aqui)

### BLOCO A — Nome e landing page
1. **Nome da empresa/plataforma:** já existe? Se não, quer que eu proponha 5 opções com domínio disponível? → _____
2. **A landing page serve para quê?** (a) vender a plataforma como produto para outros operadores/atacadistas de CEASA; (b) apresentar ao Grupo Igarashi (Nelson, unidades); (c) presença institucional da Igarashi HF. Muda texto, público e o que pode aparecer. → _____
3. **Domínio:** já comprou algum? → _____

### BLOCO B — Quem usa e onde
4. **Usuários da v1:** só Rodney? Ou já entram Douglas (lançamentos), Iago (view SIGILO, sem nome de cliente), Nelson (painel executivo)? *Recomendo: Rodney completo + view do Iago sem cliente.* → _____
5. **Celular primeiro, como PWA** (instala direto do navegador, sem loja)? *Recomendo sim.* → _____

### BLOCO C — Arquitetura de dados (a mais importante)
6. **Fase 1 leitura sobre o CONTROLE → Fase 2 casa própria com evidência**, como descrito na seção 3? Ou já quer partir direto para a casa própria? *Recomendo o faseado.* → _____
7. **Entrada de documento no app (XML/foto direto na tela) já na v1**, ou continua pelo chat comigo e o app só mostra? *Recomendo: v1 só mostra; entrada de documento entra na Fase 2.* → _____

### BLOCO D — Escopo do MVP
8. **Confirma a tela nº 1: ACOMPANHAMENTO DE CARGA** — carga aberta, vendas vinculadas pelo ID COMPOSTO, e em tempo real: quanto já vendeu, custo pela escada A–D, margem realizada, quanto falta vender, ponto de empate, margem disponível "pra queimar"? → _____
9. **Telas 2 e 3 — proponho:** (2) Painel do dia: faturamento + alertas SEM CARGA VINCULADA / ABAIXO DO MÍNIMO / MARGEM NEGATIVA; (3) Fechamento/acerto carga a carga. Concorda ou troca? → _____
10. **Histórico:** começa dos dados de julho/2026 em diante (o que está no CONTROLE) ou precisa importar meses anteriores? → _____

### BLOCO E — Operação e custo (alçada do dono — dinheiro saindo)
11. **Infra:** a Fase 1 roda entre R$ 0 e ~R$ 150/mês (hospedagem + banco). Autoriza esse teto? → _____
12. **Acesso técnico:** as credenciais (hospedagem, domínio, banco) ficam só com Rodney? → _____

### BLOCO F — Governança e agentes
13. **Aprova as 5 cartas especialistas em lote com data de hoje** (PLANILHA-05, DESIGN-06, MEMORIA-07, CONECTOR-08, IDEIA-09)? E a Fábrica segue a regra: agente novo do app nasce com carta e vem para sua aprovação, um por problema? → _____

## 6. O QUE ACONTECE DEPOIS DAS RESPOSTAS (plano — P2 → P3)

1. Respostas entram neste doc (registro).
2. FABLE-01 escreve a **SPEC v1 com teste de aceite congelado** (telas, dados, critérios mensuráveis) — como toca alçada do dono (dinheiro, material que terceiros veem), volta para aprovação do Rodney: o martelo é dele.
3. SPEC aprovada → `[CODEX-03]` constrói em passos verificáveis → `[FABLE-01]` audita contra o teste (máx. 2 rodadas; auditoria de entrega crítica em sessão distinta) → registro da versão aprovada.
4. Landing page segue o mesmo rito depois que o nome (pergunta 1) estiver batido — critério visual congelado antes de gerar (Lei 2).

**PENDENTE (placar):** respostas 1–13 · dono: Rodney.
