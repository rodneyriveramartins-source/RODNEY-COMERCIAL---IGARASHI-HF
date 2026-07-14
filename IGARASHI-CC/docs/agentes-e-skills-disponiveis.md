# Agentes/Skills disponíveis — chat normal e Project (v1, 11/07/2026)

> ⚠️ NOTA (exportação pro Claude Code, 14/07/2026): este documento descreve as skills do ambiente **Cowork/claude.ai**. No Claude Code (terminal) o conjunto de ferramentas é OUTRO (skills locais em `.claude/skills/`, MCPs configurados pelo Rodney). Usar só como referência do que existe no ambiente web.

Isso não são "atalhos" — são ferramentas especializadas que carrego automaticamente quando o pedido casa com o que elas fazem. Você não precisa decorar nome de comando: descreve a tarefa em português normal e eu identifico e uso a skill certa. Uso este documento como referência de "o que existe", não como sintaxe obrigatória.

## As que mais valem pro seu negócio (CEASA/hortifrúti)

- **xlsx** — abrir/criar/corrigir planilha Excel/Google Sheets (CONTROLE DE CARREGAMENTO, fechamentos).
- **ceasa-commercial-spreadsheet-architect** — redesenhar/simplificar planilhas comerciais de CEASA/hortifrúti (cargas, margem, sobra, KPI).
- **docx / pdf / pptx** — gerar relatório Word, PDF ou apresentação pronta.
- **dataviz / kpi-dashboard-design** — montar dashboard ou gráfico (Painel Executivo pro Nelson).
- **business-metrics-calculator / margin-analyzer** — cálculo de margem, KPI, métrica de negócio.
- **notion-api** — ler/gravar direto no Notion (é o que uso o tempo todo aqui).
- **google-drive-api** — ler/gravar arquivos no Drive (CONTROLE, NOTAS, RELATÓRIOS).
- **small-business:** cash-flow-snapshot, invoice-chase, price-check, month-end-prep, sales-brief, monday-brief/friday-brief, quarterly-review, crm-cleanup — rotina de dono de negócio pequeno/médio.
- **sales:** daily-briefing, pipeline-review, call-prep, forecast — se quiser tratar clientes grandes (Assaí, Novo Atacado etc.) como pipeline.
- **canva-creator / canva:** brand-check, edit-design, get-design-feedback, resize-for-social-media — materiais visuais no padrão Igarashi (verde/dourado).
- **internal-comms** — mensagens/relatórios pro time (Maykon, Iago, Reginaldo).
- **deep-research** — pesquisa profunda multi-fonte na web (preço de praça, concorrência, mercado).
- **claude-in-chrome** — automatizar navegador (ex: mexer em sistema web tipo Hortigestão).
- **pdf-viewer:** open/annotate/fill-form/sign — abrir e trabalhar em PDF de forma interativa (contratos, NFs).

## Suíte completa por categoria (existe, mas boa parte não se aplica ao seu dia a dia)

**Documentos e conteúdo:** docx, pdf, pptx, xlsx, canvas-design, algorithmic-art, frontend-design, web-artifacts-builder, theme-factory, brand-guidelines, dataviz, humanizer, internal-comms, doc-coauthoring, skill-creator, mcp-builder, notebooklm, slack-gif-creator, brainstorming, analysis-retrospective, business-metrics-calculator, kpi-dashboard-design

**Pesquisa:** deep-research

**Marca/voz (brand-voice):** discover-brand, enforce-voice, generate-guidelines, brand-voice-enforcement, guideline-generation

**Financeiro/modelagem (financial-analysis):** 3-statement-model, audit-xls, clean-data-xls, competitive-analysis, comps-analysis, comps, dcf-model, dcf, deck-refresh, ib-check-deck, lbo-model, lbo, ppt-template(-creator), pptx-author, skill-creator, xlsx-author

**Research financeiro institucional (bigdata-com):** catalyst-monitor, company-brief, country-analysis, country-sector-analysis, cross-sector, earnings-digest/preview/quality-screen/reaction, g7-comparison, investment-memo, moat-governance-review, peer-comparables, post-ipo-day1/14/179/365, pre-ipo-analysis, quick-take, regional-comparison, risk-assessment, scenario-analysis, sector-analysis, sector-playbook, thematic-research, valuation-snapshot, variant-perception, financial-research-analyst
*(irrelevante pro dia a dia do galpão — é pra quem analisa ações/M&A)*

**Product management:** brainstorm, competitive-brief, metrics-review, product-brainstorming, roadmap-update, sprint-planning, stakeholder-update, synthesize-research, write-spec

**Small business:** business-pulse, call-list, canva-creator, cash-flow-snapshot, close-month, content-strategy, contract-review, crm-cleanup, crm-maintenance, customer-pulse(-check), friday-brief, handle-complaint, invoice-chase, job-post-builder, lead-triage, margin-analyzer, monday-brief, month-end-prep, month-heads-up, plan-payroll, price-check, quarterly-review, review-contract, run-campaign, sales-brief, smb-onboard, smb-router, tax-prep, tax-season-organizer, ticket-deflector

**Operações:** capacity-plan, change-request, compliance-tracking, process-doc, process-optimization, risk-assessment, runbook, status-report, vendor-review

**RH:** comp-analysis, draft-offer, interview-prep, onboarding, org-planning, people-report, performance-review, policy-lookup, recruiting-pipeline

**Vendas:** account-research, call-prep, call-summary, competitive-intelligence, create-an-asset, daily-briefing, draft-outreach, forecast, pipeline-review

**Design:** accessibility-review, design-critique, design-handoff, design-system, research-synthesis, user-research, ux-copy

**Jurídico:** brief, compliance-check, legal-response, legal-risk-assessment, meeting-briefing, review-contract, signature-request, triage-nda, vendor-check

**Marketing:** brand-review, campaign-plan, competitive-brief, content-creation, draft-content, email-sequence, performance-report, seo-audit

**Dados:** analyze, build-dashboard, create-viz, data-context-extractor, data-visualization, explore-data, sql-queries, statistical-analysis, validate-data, write-query

**Busca corporativa (enterprise-search):** digest, knowledge-synthesis, search, search-strategy, source-management

**Contábil/financeiro (finance):** audit-support, close-management, financial-statements, journal-entry(-prep), reconciliation, sox-testing, variance-analysis

**Engenharia:** architecture, code-review, debug, deploy-checklist, documentation, incident-response, standup, system-design, tech-debt, testing-strategy
*(só relevante se você mexer no App Igarashi Comercial)*

**Produtividade:** memory-management, start, task-management, update

**Gestão do próprio Cowork:** cowork-plugin-customizer, create-cowork-plugin, cowork-plugin, setup-cowork

**Integrações (conectores, precisam estar plugados):** Notion, Salesforce, Google Drive, Google Calendar, Gmail, Canva, Figma, Booking.com, Apify, Granola, 21st.dev

## Como chamar

Não existe comando fixo tipo "/skill". Você só descreve o que quer ("me monta um dashboard de vendas do mês", "revisa esse contrato", "cria um relatório em Word") e eu identifico e carrego a skill certa — no chat normal ou dentro do Project "Comando Igarashi HF" funciona igual.
