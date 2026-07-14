# COMO USAR ESTE PACOTE NO CLAUDE CODE (exportado 14/07/2026)

## O que é
Cópia completa do Project "Comando Igarashi HF" do claude.ai, no formato que o Claude Code entende:
- `CLAUDE.md` — o Código-Fonte v2 (lido AUTOMATICAMENTE pelo Claude Code ao abrir nesta pasta)
- `docs/` — os 8 documentos do Project (Claude lê sob demanda)

## Passo a passo (3 minutos)
1. Extraia este zip numa pasta do seu computador. Ex.: `C:\IGARASHI-CC` (Windows) ou `~/IGARASHI-CC` (Mac).
2. Abra o terminal NESSA pasta:
   - Windows: abra a pasta no Explorer → barra de endereço → digite `cmd` → Enter
   - Mac: Terminal → `cd ~/IGARASHI-CC`
3. Rode: `claude`
   (se não tiver instalado: `npm install -g @anthropic-ai/claude-code` e faça login com sua conta Claude)
4. Pronto. Ele já nasce sabendo o protocolo, as regras R-001 a R-016, as tags e os comandos. Teste digitando `[STATUS]`.

## O que o Claude Code NÃO tem (diferença pro Cowork/claude.ai)
- Conectores Notion, Drive, Gmail, Calendar — NÃO vêm de fábrica. Pra ele mexer no Notion/Drive precisa configurar MCP (`claude mcp add ...`) — é outro projeto, não faça sem precisar.
- Os docs desta pasta são CÓPIA de 14/07/2026. A fonte viva continua sendo o Project no claude.ai. Mudou regra lá → gerar exportação nova (pede no chat do Project: "gera o pacote atualizado pro Claude Code").

## Regra de ouro
Se houver conflito entre esta pasta e o Project do claude.ai, a versão MAIS RECENTE vence (R-005).
