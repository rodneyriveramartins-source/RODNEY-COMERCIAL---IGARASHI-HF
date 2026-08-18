# -*- coding: utf-8 -*-
"""Parser do texto extraído do Painel_DRE_BoxRecifePE_Completo.pdf.

Estrutura: seções "DRE Gerencial ..." contendo trincas de linhas:
  1) linha de 7 valores monetários (jan..jun + acumulado)
  2) linha(s) de rótulo (pode quebrar em 2 linhas)
  3) linha de 7 percentuais
Saída: dre_dados.json {secoes: [{nome, linhas: [{label, valores[7], pcts[7]}]}]}
"""
import json
import re

SRC = "dre_texto.txt"
OUT = "dre_dados.json"

money_tok = re.compile(r"^[−\-]?R\$\s?[−\-]?[\d.]+,\d{2}$")
pct_tok = re.compile(r"^[−\-]?[\d.]+,\d%$|^[−\-]?[\d.]+,\d{1,2}%$")


def is_money_line(line):
    toks = line.replace("\\-", "-").split()
    # junta "R$" com o número seguinte: tokens vêm como "R$", "4.216.602,61"
    joined = []
    i = 0
    while i < len(toks):
        if toks[i] in ("R$", "-R$", "−R$") and i + 1 < len(toks):
            joined.append(toks[i] + " " + toks[i + 1])
            i += 2
        else:
            joined.append(toks[i])
            i += 1
    if len(joined) != 7:
        return None
    if all(money_tok.match(t.replace(" ", " ").replace("R$ ", "R$")) or money_tok.match(t.replace(" ", "")) for t in joined):
        return [parse_money(t) for t in joined]
    return None


def parse_money(t):
    neg = t.strip().startswith("-") or t.strip().startswith("−")
    num = t.replace("R$", "").replace("-", "").replace("−", "").strip()
    num = num.replace(".", "").replace(",", ".")
    v = float(num)
    return -v if neg else v


def is_pct_line(line):
    toks = line.replace("\\-", "-").split()
    if len(toks) != 7:
        return None
    ok = all(re.match(r"^[−\-]?[\d.]+,\d+%$", t) for t in toks)
    if not ok:
        return None
    out = []
    for t in toks:
        neg = t.startswith("-") or t.startswith("−")
        num = t.rstrip("%").lstrip("-−").replace(".", "").replace(",", ".")
        v = float(num)
        out.append(-v if neg else v)
    return out


text = open(SRC, encoding="utf-8").read()
lines = [l.strip() for l in text.split("\n")]

sec_re = re.compile(r"^DRE Gerencial (Consolidado|por Produto) — (.+)$")
NOTES = ("Detalhamento completo", "Receita Líquida e CMV detalhados", "Grupo Igarashi", "Fonte:")

secoes = []
cur = None
pending_vals = None
pending_label = []

for ln in lines:
    if not ln:
        continue
    m = sec_re.match(ln)
    if m:
        nome = "Consolidado" if m.group(1) == "Consolidado" else m.group(2).split("—")[-1].strip()
        cur = {"nome": nome, "titulo": ln, "linhas": []}
        secoes.append(cur)
        pending_vals, pending_label = None, []
        continue
    if cur is None:
        continue
    if ln.startswith("LINHA "):
        continue
    if any(ln.startswith(n) for n in NOTES):
        pending_vals, pending_label = None, []
        continue
    vals = is_money_line(ln)
    if vals is not None:
        pending_vals = vals
        pending_label = []
        continue
    pcts = is_pct_line(ln)
    if pcts is not None:
        if pending_vals is not None and pending_label:
            cur["linhas"].append({
                "label": " ".join(pending_label),
                "valores": pending_vals,
                "pcts": pcts,
            })
        else:
            print("!! pct sem par:", ln[:60], "| label:", pending_label)
        pending_vals, pending_label = None, []
        continue
    # linha de rótulo (pode acumular quebra)
    if pending_vals is not None:
        pending_label.append(ln)

# ---- validações ----
print("Seções:", [(s["nome"], len(s["linhas"])) for s in secoes])
divergencias = []
for s in secoes:
    for r in s["linhas"]:
        soma = sum(r["valores"][:6])
        acc = r["valores"][6]
        if abs(soma - acc) > 0.05:
            divergencias.append(f"{s['nome']} | {r['label']}: soma meses {soma:,.2f} != acumulado {acc:,.2f}")

# consolidado x soma dos produtos nas linhas-chave
def acha(sec, label):
    for r in sec["linhas"]:
        if r["label"] == label:
            return r
    return None

cons = secoes[0]
prods = secoes[1:]
for key in ["(=) LUCRO BRUTO", "(=) RESULTADO LÍQUIDO", "(-) DESPESAS OPERACIONAIS"]:
    rc = acha(cons, key)
    if rc is None:
        divergencias.append(f"Consolidado: linha '{key}' não encontrada")
        continue
    soma_prod = [0.0] * 7
    faltou = False
    for p in prods:
        rp = acha(p, key)
        if rp is None:
            faltou = True
            break
        soma_prod = [a + b for a, b in zip(soma_prod, rp["valores"])]
    if not faltou:
        diff = abs(soma_prod[6] - rc["valores"][6])
        status = "OK" if diff <= 1.0 else f"DIVERGE {diff:,.2f}"
        print(f"{key}: consolidado {rc['valores'][6]:,.2f} vs soma produtos {soma_prod[6]:,.2f} -> {status}")
        if diff > 1.0:
            divergencias.append(f"{key}: consolidado {rc['valores'][6]:,.2f} != soma produtos {soma_prod[6]:,.2f}")

print("\nDivergências soma-meses:", len(divergencias))
for d in divergencias[:20]:
    print(" -", d)

json.dump({"secoes": secoes, "divergencias": divergencias}, open(OUT, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print("\nGravado", OUT)
