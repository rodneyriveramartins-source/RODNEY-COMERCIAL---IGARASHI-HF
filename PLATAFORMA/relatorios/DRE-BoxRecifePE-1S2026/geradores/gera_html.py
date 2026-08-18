# -*- coding: utf-8 -*-
"""Gera DRE_BoxRecifePE_1S2026.html (mobile-first, autocontido) a partir de dre_dados.json."""
import json

d = json.load(open("dre_dados.json", encoding="utf-8"))
secoes = d["secoes"]

MESES = ["JAN/26", "FEV/26", "MAR/26", "ABR/26", "MAI/26", "JUN/26", "ACUM. 1S26"]
MESES_CURTO = ["jan", "fev", "mar", "abr", "mai", "jun"]
TOTAIS = ("RECEITA LÍQUIDA", "(-) CMV", "(=) LUCRO BRUTO", "(-) DESPESAS OPERACIONAIS",
          "(=) RESULTADO OPERACIONAL", "(+/-) RESULTADO FINANCEIRO",
          "(=) RESULTADO ANTES DO IRPJ e CSLL", "(=) RESULTADO LÍQUIDO")
CHAVES = ["RECEITA LÍQUIDA", "(-) CMV", "(=) LUCRO BRUTO", "(-) DESPESAS OPERACIONAIS",
          "(=) RESULTADO OPERACIONAL", "(+/-) RESULTADO FINANCEIRO", "(=) RESULTADO LÍQUIDO"]


def brl(v):
    s = f"{abs(v):,.2f}".replace(",", "X").replace(".", ",").replace("X", ".")
    return ("-R$ " if v < -0.004 else "R$ ") + s


def brl_compacto(v):
    a = abs(v)
    if a >= 1_000_000:
        s = f"{a/1_000_000:.2f}".replace(".", ",") + " mi"
    elif a >= 1_000:
        s = f"{a/1_000:.0f} mil"
    else:
        s = f"{a:.0f}"
    return ("-R$ " if v < 0 else "R$ ") + s


def pct(p):
    s = f"{abs(p):.1f}".replace(".", ",")
    return ("-" if p < -0.04 else "") + s + "%"


def esc(t):
    return t.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


cons = secoes[0]
lab2 = {ln["label"]: ln for ln in cons["linhas"]}
rec = lab2["RECEITA LÍQUIDA"]
lb = lab2["(=) LUCRO BRUTO"]
desp = lab2["(-) DESPESAS OPERACIONAIS"]
rl = lab2["(=) RESULTADO LÍQUIDO"]


# ---------- gráfico de barras SVG (série única, rótulo direto, base zero) ----------
def barras_svg(valores, cor_pos, cor_neg, titulo_id):
    W, H = 680, 240
    ml, mr, mt, mb = 14, 14, 34, 26
    pw = W - ml - mr
    vmax = max(max(valores), 0)
    vmin = min(min(valores), 0)
    span = (vmax - vmin) or 1
    ph = H - mt - mb
    y0 = mt + ph * (vmax / span)  # linha do zero
    bw = pw / len(valores) * 0.58
    step = pw / len(valores)
    partes = []
    partes.append(f'<line x1="{ml}" y1="{y0:.1f}" x2="{W-mr}" y2="{y0:.1f}" stroke="#B9CDBB" stroke-width="1"/>')
    for i, v in enumerate(valores):
        x = ml + step * i + (step - bw) / 2
        h = abs(v) / span * ph
        r = min(4, h / 2, bw / 2)
        cor = cor_pos if v >= 0 else cor_neg
        if v >= 0:
            y = y0 - h
            path = (f'M{x:.1f},{y0:.1f} V{y + r:.1f} Q{x:.1f},{y:.1f} {x + r:.1f},{y:.1f} '
                    f'H{x + bw - r:.1f} Q{x + bw:.1f},{y:.1f} {x + bw:.1f},{y + r:.1f} V{y0:.1f} Z')
            ly = y - 6
        else:
            y = y0 + h
            path = (f'M{x:.1f},{y0:.1f} V{y - r:.1f} Q{x:.1f},{y:.1f} {x + r:.1f},{y:.1f} '
                    f'H{x + bw - r:.1f} Q{x + bw:.1f},{y:.1f} {x + bw:.1f},{y - r:.1f} V{y0:.1f} Z')
            ly = y + 13
        cx = x + bw / 2
        partes.append(f'<path d="{path}" fill="{cor}"><title>{MESES_CURTO[i]}/26: {brl(v)}</title></path>')
        # rótulo direto; se colidir com o eixo dos meses, entra para dentro da barra (branco)
        classe = "cbl"
        if v < 0 and ly > H - mb - 4:
            ly = y - 6
            classe = "cbl cbw"
        partes.append(f'<text x="{cx:.1f}" y="{ly:.1f}" text-anchor="middle" class="{classe}">{brl_compacto(v)}</text>')
        partes.append(f'<text x="{cx:.1f}" y="{H - 8}" text-anchor="middle" class="cbx">{MESES_CURTO[i]}</text>')
    return (f'<svg viewBox="0 0 {W} {H}" role="img" aria-labelledby="{titulo_id}" '
            f'style="width:100%;height:auto;display:block">' + "".join(partes) + "</svg>")


graf_rl = barras_svg([rl["valores"][m] for m in range(6)], "#0E8A4D", "#B3261E", "t-rl")
graf_rec = barras_svg([rec["valores"][m] for m in range(6)], "#52796F", "#B3261E", "t-rec")


# ---------- tabela de uma seção ----------
def tabela(sec):
    linhas = sec["linhas"]
    out = ['<div class="tw"><table><thead><tr><th class="lc">LINHA</th>']
    for m in MESES:
        out.append(f"<th>{m}</th>")
    out.append("</tr></thead><tbody>")
    for ln in linhas:
        cls = []
        if ln["label"] in TOTAIS:
            cls.append("tt")
        if ln["label"] == "(=) RESULTADO LÍQUIDO":
            cls.append("rl")
        out.append(f'<tr class="{" ".join(cls)}"><td class="lc">{esc(ln["label"])}</td>')
        for m in range(7):
            v, p = ln["valores"][m], ln["pcts"][m]
            neg_v = " nv" if v < -0.004 else ""
            neg_p = " nv" if p < -0.04 else ""
            out.append(f'<td><span class="v{neg_v}">{brl(v)}</span>'
                       f'<span class="p{neg_p}">{pct(p)}</span></td>')
        out.append("</tr>")
    out.append("</tbody></table></div>")
    return "".join(out)


# ---------- montagem ----------
abas = [("resumo", "RESUMO")] + [
    ("s" + str(i), ("CONSOLIDADO" if s["nome"] == "Consolidado" else s["nome"]))
    for i, s in enumerate(secoes)]

nav = "".join(
    f'<button class="tab{" on" if i == 0 else ""}" data-t="{tid}">{nome}</button>'
    for i, (tid, nome) in enumerate(abas))

kpis = f"""
<div class="kpis">
 <div class="kpi"><div class="kl">Receita Líquida 1S26</div><div class="kv">{brl_compacto(rec['valores'][6])}</div><div class="ks">{brl(rec['valores'][6])}</div></div>
 <div class="kpi"><div class="kl">Lucro Bruto</div><div class="kv">{brl_compacto(lb['valores'][6])}</div><div class="ks">{brl(lb['valores'][6])} · {pct(lb['pcts'][6])} da receita</div></div>
 <div class="kpi"><div class="kl">Despesas Operacionais</div><div class="kv">{brl_compacto(desp['valores'][6])}</div><div class="ks">{brl(desp['valores'][6])} · {pct(desp['pcts'][6])} da receita</div></div>
 <div class="kpi ruim"><div class="kl">Resultado Líquido 1S26</div><div class="kv">{brl_compacto(rl['valores'][6])}</div><div class="ks">{brl(rl['valores'][6])} · margem {pct(rl['pcts'][6])}</div></div>
</div>"""

# resumo mês a mês (linhas-chave)
res_tab = ['<div class="tw"><table><thead><tr><th class="lc">LINHA</th>']
for m in MESES:
    res_tab.append(f"<th>{m}</th>")
res_tab.append("</tr></thead><tbody>")
for k in CHAVES:
    ln = lab2[k]
    cls = "tt rl" if k == "(=) RESULTADO LÍQUIDO" else "tt"
    res_tab.append(f'<tr class="{cls}"><td class="lc">{esc(k)}</td>')
    for m in range(7):
        v, p = ln["valores"][m], ln["pcts"][m]
        neg_v = " nv" if v < -0.004 else ""
        neg_p = " nv" if p < -0.04 else ""
        res_tab.append(f'<td><span class="v{neg_v}">{brl(v)}</span><span class="p{neg_p}">{pct(p)}</span></td>')
    res_tab.append("</tr>")
res_tab.append("</tbody></table></div>")
res_tab = "".join(res_tab)

# por produto (acumulado)
prod_tab = ['<div class="tw"><table><thead><tr><th class="lc">PRODUTO</th>'
            '<th>RECEITA LÍQ.</th><th>CMV</th><th>LUCRO BRUTO</th><th>DESPESAS</th>'
            '<th>RES. OPERAC.</th><th>RES. FINANC.</th><th>RESULT. LÍQ.</th><th>MARGEM</th></tr></thead><tbody>']
soma = [0.0] * 7
for s in secoes[1:]:
    l2 = {ln["label"]: ln for ln in s["linhas"]}
    vals = [l2[k]["valores"][6] if k in l2 else 0.0 for k in CHAVES]
    soma = [a + b for a, b in zip(soma, vals)]
    marg = vals[6] / vals[0] * 100 if vals[0] else 0.0
    prod_tab.append(f'<tr><td class="lc">{esc(s["nome"])}</td>')
    for v in vals:
        neg = " nv" if v < -0.004 else ""
        prod_tab.append(f'<td><span class="v{neg}">{brl(v)}</span></td>')
    neg = " nv" if marg < 0 else ""
    prod_tab.append(f'<td><span class="v{neg}"><b>{pct(marg)}</b></span></td></tr>')
marg_t = soma[6] / soma[0] * 100 if soma[0] else 0.0
prod_tab.append('<tr class="tt"><td class="lc">TOTAL</td>')
for v in soma:
    neg = " nv" if v < -0.004 else ""
    prod_tab.append(f'<td><span class="v{neg}">{brl(v)}</span></td>')
neg = " nv" if marg_t < 0 else ""
prod_tab.append(f'<td><span class="v{neg}"><b>{pct(marg_t)}</b></span></td></tr>')
prod_tab.append("</tbody></table></div>")
prod_tab = "".join(prod_tab)

resumo_html = f"""
<section id="resumo" class="sec on">
{kpis}
<h2 id="t-rl">Resultado Líquido mês a mês — Consolidado</h2>
<div class="card">{graf_rl}</div>
<h2 id="t-rec">Receita Líquida mês a mês — Consolidado</h2>
<div class="card">{graf_rec}</div>
<h2>Consolidado — linhas-chave, mês a mês</h2>
{res_tab}
<h2>Acumulado 1S26 — por produto</h2>
{prod_tab}
<p class="nota">TOTAL soma os 8 produtos e confere com o Consolidado (diferenças de centavos = arredondamento da fonte).</p>
</section>"""

secs_html = []
for i, s in enumerate(secoes):
    nome = "CONSOLIDADO" if s["nome"] == "Consolidado" else s["nome"]
    secs_html.append(
        f'<section id="s{i}" class="sec"><h2>{esc(s["titulo"])}</h2>{tabela(s)}'
        '<p class="nota">Em cada célula: valor em R$ e, abaixo, o % sobre a Receita Líquida da seção (análise vertical).</p></section>')
secs_html = "".join(secs_html)

html = f"""<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>DRE Box Recife/PE — 1S2026 — Igarashi HF</title>
<style>
:root {{
  --verde: #051F20; --teal: #0A2E2F; --salvia: #8EB69B; --menta: #DAF1DE;
  --dourado: #D9C988; --tinta: #16211A; --tinta2: #5C6E60; --neg: #B3261E;
  --sup: #FCFDFC; --card: #FFFFFF; --borda: #D7E4D8; --zebra: #F4FAF5;
}}
* {{ box-sizing: border-box; margin: 0; padding: 0; }}
html {{ -webkit-text-size-adjust: 100%; }}
body {{ font-family: 'Barlow', 'Segoe UI', Roboto, -apple-system, sans-serif;
       background: var(--sup); color: var(--tinta); font-size: 14px; }}
header {{ background: var(--verde); color: #fff; padding: 14px 14px 10px; }}
header h1 {{ font-size: 1.15rem; letter-spacing: .02em; }}
header p {{ color: var(--menta); font-size: .74rem; margin-top: 4px; line-height: 1.35; }}
nav {{ position: sticky; top: 0; z-index: 5; background: var(--verde);
      display: flex; overflow-x: auto; gap: 6px; padding: 8px 10px;
      -webkit-overflow-scrolling: touch; scrollbar-width: none; }}
nav::-webkit-scrollbar {{ display: none; }}
.tab {{ flex: 0 0 auto; border: 1px solid var(--salvia); background: transparent;
       color: var(--menta); border-radius: 999px; padding: 6px 13px; font-size: .78rem;
       font-weight: 600; font-family: inherit; }}
.tab.on {{ background: var(--dourado); border-color: var(--dourado); color: var(--verde); }}
main {{ padding: 12px 10px 20px; max-width: 1100px; margin: 0 auto; }}
.sec {{ display: none; }}
.sec.on {{ display: block; }}
h2 {{ font-size: .95rem; color: var(--teal); margin: 16px 2px 8px; }}
.kpis {{ display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 4px; }}
.kpi {{ background: var(--card); border: 1px solid var(--borda); border-radius: 12px;
       padding: 10px 12px; }}
.kpi.ruim {{ border-color: #E5C1BD; background: #FDF6F5; }}
.kl {{ font-size: .68rem; text-transform: uppercase; letter-spacing: .05em; color: var(--tinta2); }}
.kv {{ font-size: 1.25rem; font-weight: 700; margin-top: 2px; }}
.kpi.ruim .kv {{ color: var(--neg); }}
.ks {{ font-size: .68rem; color: var(--tinta2); margin-top: 2px; }}
.card {{ background: var(--card); border: 1px solid var(--borda); border-radius: 12px; padding: 10px 6px 4px; }}
.cbl {{ font: 600 11px 'Barlow', sans-serif; fill: var(--tinta); }}
.cbw {{ fill: #fff; }}
.cbx {{ font: 10px 'Barlow', sans-serif; fill: var(--tinta2); }}
.tw {{ overflow-x: auto; border: 1px solid var(--borda); border-radius: 10px; background: var(--card); }}
table {{ border-collapse: collapse; width: 100%; min-width: 760px; }}
th {{ background: var(--teal); color: #fff; font-size: .66rem; padding: 7px 8px;
     text-align: right; white-space: nowrap; position: sticky; top: 0; }}
th.lc {{ text-align: left; background: var(--teal); color: #fff; z-index: 3; }}
td {{ padding: 4px 8px; text-align: right; border-top: 1px solid var(--borda);
     white-space: nowrap; vertical-align: top; }}
td .v {{ display: block; font-size: .74rem; font-variant-numeric: tabular-nums; }}
td .p {{ display: block; font-size: .62rem; color: var(--tinta2); }}
.nv {{ color: var(--neg) !important; }}
.lc {{ text-align: left; position: sticky; left: 0; background: var(--card);
      font-size: .72rem; max-width: 168px; white-space: normal; min-width: 128px;
      box-shadow: 1px 0 0 var(--borda); }}
tbody tr:nth-child(even) td {{ background: var(--zebra); }}
tbody tr:nth-child(even) td.lc {{ background: var(--zebra); }}
tr.tt td {{ background: var(--menta) !important; font-weight: 700; }}
tr.tt td .v {{ font-weight: 700; }}
tr.rl td {{ background: #F5EED5 !important; }}
.nota {{ font-size: .68rem; color: var(--tinta2); font-style: italic; margin: 8px 2px 4px; }}
footer {{ text-align: center; font-size: .66rem; color: var(--tinta2); padding: 10px 12px 26px; }}
@media (min-width: 700px) {{ .kpis {{ grid-template-columns: repeat(4, 1fr); }} body {{ font-size: 15px; }} }}
</style>
</head>
<body>
<header>
<h1>DRE GERENCIAL COMPLETO — BOX RECIFE/PE</h1>
<p>Igarashi HF — Box Ceasa Recife/PE · 1º Semestre de 2026 (jan–jun) · Consolidado + 8 produtos<br>
Fonte: “RESULTADO 1S2026 Box RecifePE” (DRE Gerencial, relatório interno) · Valores realizados</p>
</header>
<nav>{nav}</nav>
<main>
{resumo_html}
{secs_html}
</main>
<footer>Grupo Igarashi HF — Box Ceasa Recife/PE — DRE Gerencial 1S2026.<br>
Documento gerado a partir do relatório interno “RESULTADO 1S2026 Box RecifePE”.</footer>
<script>
document.querySelectorAll('.tab').forEach(function(b) {{
  b.addEventListener('click', function() {{
    document.querySelectorAll('.tab').forEach(function(x) {{ x.classList.remove('on'); }});
    document.querySelectorAll('.sec').forEach(function(x) {{ x.classList.remove('on'); }});
    b.classList.add('on');
    document.getElementById(b.dataset.t).classList.add('on');
    window.scrollTo(0, 0);
  }});
}});
</script>
</body>
</html>"""

open("DRE_BoxRecifePE_1S2026.html", "w", encoding="utf-8").write(html)
print("gerado DRE_BoxRecifePE_1S2026.html,", len(html) // 1024, "KB")
