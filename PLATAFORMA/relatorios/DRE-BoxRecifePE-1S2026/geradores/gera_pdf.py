# -*- coding: utf-8 -*-
"""Gera DRE_BoxRecifePE_1S2026.pdf a partir de dre_dados.json.

A4 paisagem. Página-resumo + 9 seções (Consolidado + 8 produtos).
Cada célula: valor (linha 1) e % da receita (linha 2, menor).
Valores exatamente como no relatório-fonte.
"""
import json

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4, landscape
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.platypus import (LongTable, PageBreak, Paragraph, SimpleDocTemplate,
                                Spacer, Table, TableStyle)

d = json.load(open("dre_dados.json", encoding="utf-8"))
secoes = d["secoes"]

VERDE_ESCURO = colors.HexColor("#051F20")
TEAL = colors.HexColor("#0A2E2F")
SALVIA = colors.HexColor("#8EB69B")
MENTA = colors.HexColor("#DAF1DE")
DOURADO = colors.HexColor("#D9C988")
ZEBRA = colors.HexColor("#F4FAF5")
GOLD_BG = colors.HexColor("#F5EED5")
VERMELHO = colors.HexColor("#B3261E")

MESES = ["JAN/26", "FEV/26", "MAR/26", "ABR/26", "MAI/26", "JUN/26", "ACUM. 1S26"]
TOTAIS = ("RECEITA LÍQUIDA", "(-) CMV", "(=) LUCRO BRUTO", "(-) DESPESAS OPERACIONAIS",
          "(=) RESULTADO OPERACIONAL", "(+/-) RESULTADO FINANCEIRO",
          "(=) RESULTADO ANTES DO IRPJ e CSLL", "(=) RESULTADO LÍQUIDO")


def brl(v):
    s = f"{abs(v):,.2f}".replace(",", "X").replace(".", ",").replace("X", ".")
    return ("-R$ " if v < -0.004 else "R$ ") + s


def pct(p):
    s = f"{abs(p):.1f}".replace(".", ",")
    return ("-" if p < -0.04 else "") + s + "%"


st_lab = ParagraphStyle("lab", fontName="Helvetica", fontSize=6.4, leading=7.4)
st_lab_b = ParagraphStyle("labb", parent=st_lab, fontName="Helvetica-Bold")
st_val = ParagraphStyle("val", fontName="Helvetica", fontSize=6.4, leading=7.4, alignment=2)
st_val_b = ParagraphStyle("valb", parent=st_val, fontName="Helvetica-Bold")
st_lab_w = ParagraphStyle("labw", parent=st_lab_b, textColor=colors.white)

st_h1 = ParagraphStyle("h1", fontName="Helvetica-Bold", fontSize=17, leading=21,
                       textColor=colors.white)
st_h2 = ParagraphStyle("h2", fontName="Helvetica", fontSize=8.5, leading=11,
                       textColor=MENTA)
st_sec = ParagraphStyle("sec", fontName="Helvetica-Bold", fontSize=12.5, leading=15,
                        textColor=VERDE_ESCURO, spaceAfter=3)
st_note = ParagraphStyle("note", fontName="Helvetica-Oblique", fontSize=7,
                         leading=9, textColor=colors.HexColor("#555555"))


def celula(v, p, bold):
    stv = st_val_b if bold else st_val
    cor_v = "#B3261E" if v < -0.004 else "#111111"
    cor_p = "#B3261E" if p < -0.04 else "#667766"
    return Paragraph(
        f'<font color="{cor_v}">{brl(v)}</font><br/>'
        f'<font color="{cor_p}" size="5.4">{pct(p)}</font>', stv)


def tabela_secao(sec):
    linhas = sec["linhas"]
    data = [[Paragraph("LINHA", st_lab_w)] + [Paragraph(m, ParagraphStyle(
        "hd", parent=st_val_b, textColor=colors.white)) for m in MESES]]
    estilos = [
        ("BACKGROUND", (0, 0), (-1, 0), TEAL),
        ("TEXTCOLOR", (0, 0), (0, 0), colors.white),
        ("GRID", (0, 0), (-1, -1), 0.4, colors.HexColor("#CCDDCC")),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("LEFTPADDING", (0, 0), (-1, -1), 3),
        ("RIGHTPADDING", (0, 0), (-1, -1), 3),
        ("TOPPADDING", (0, 0), (-1, -1), 1.5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 1.5),
    ]
    for i, ln in enumerate(linhas):
        bold = ln["label"] in TOTAIS
        row = [Paragraph(ln["label"], st_lab_b if bold else st_lab)]
        for m in range(7):
            row.append(celula(ln["valores"][m], ln["pcts"][m], bold))
        data.append(row)
        r = i + 1
        if ln["label"] == "(=) RESULTADO LÍQUIDO":
            estilos.append(("BACKGROUND", (0, r), (-1, r), GOLD_BG))
        elif bold:
            estilos.append(("BACKGROUND", (0, r), (-1, r), MENTA))
        elif i % 2 == 1:
            estilos.append(("BACKGROUND", (0, r), (-1, r), ZEBRA))
    larg = [52 * mm] + [29.2 * mm] * 7
    t = LongTable(data, colWidths=larg, repeatRows=1)
    t.setStyle(TableStyle(estilos))
    return t


doc = SimpleDocTemplate(
    "DRE_BoxRecifePE_1S2026.pdf", pagesize=landscape(A4),
    leftMargin=10 * mm, rightMargin=10 * mm, topMargin=9 * mm, bottomMargin=9 * mm,
    title="DRE Gerencial Box Recife/PE — 1º Semestre 2026 — Igarashi HF",
    author="Igarashi HF")

story = []

# ---- capa / resumo executivo ----
cab = Table([[Paragraph("DRE GERENCIAL COMPLETO — BOX RECIFE/PE", st_h1)],
             [Paragraph("Igarashi HF — Box Ceasa Recife/PE · 1º Semestre de 2026 (janeiro a junho) · "
                        "Consolidado + 8 produtos · Fonte: \"RESULTADO 1S2026 Box RecifePE\" (DRE Gerencial, relatório interno)", st_h2)]],
            colWidths=[277 * mm])
cab.setStyle(TableStyle([
    ("BACKGROUND", (0, 0), (-1, -1), VERDE_ESCURO),
    ("LEFTPADDING", (0, 0), (-1, -1), 8),
    ("RIGHTPADDING", (0, 0), (-1, -1), 8),
    ("TOPPADDING", (0, 0), (0, 0), 7),
    ("BOTTOMPADDING", (0, 1), (0, 1), 7),
]))
story.append(cab)
story.append(Spacer(1, 6 * mm))

story.append(Paragraph("RESUMO EXECUTIVO — CONSOLIDADO MÊS A MÊS", st_sec))
cons = secoes[0]
CHAVES = ["RECEITA LÍQUIDA", "(-) CMV", "(=) LUCRO BRUTO", "(-) DESPESAS OPERACIONAIS",
          "(=) RESULTADO OPERACIONAL", "(+/-) RESULTADO FINANCEIRO", "(=) RESULTADO LÍQUIDO"]
lab2 = {ln["label"]: ln for ln in cons["linhas"]}
data = [[Paragraph("LINHA", st_lab_w)] + [Paragraph(m, ParagraphStyle(
    "hd2", parent=st_val_b, textColor=colors.white)) for m in MESES]]
est = [
    ("BACKGROUND", (0, 0), (-1, 0), TEAL),
    ("GRID", (0, 0), (-1, -1), 0.4, colors.HexColor("#CCDDCC")),
    ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
    ("LEFTPADDING", (0, 0), (-1, -1), 3),
    ("RIGHTPADDING", (0, 0), (-1, -1), 3),
    ("TOPPADDING", (0, 0), (-1, -1), 2.5),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 2.5),
]
for i, k in enumerate(CHAVES):
    ln = lab2[k]
    row = [Paragraph(k, st_lab_b)]
    for m in range(7):
        row.append(celula(ln["valores"][m], ln["pcts"][m], True))
    data.append(row)
    r = i + 1
    if k == "(=) RESULTADO LÍQUIDO":
        est.append(("BACKGROUND", (0, r), (-1, r), GOLD_BG))
    elif i % 2 == 1:
        est.append(("BACKGROUND", (0, r), (-1, r), ZEBRA))
t = Table(data, colWidths=[52 * mm] + [29.2 * mm] * 7)
t.setStyle(TableStyle(est))
story.append(t)
story.append(Spacer(1, 5 * mm))

story.append(Paragraph("ACUMULADO 1S26 — POR PRODUTO", st_sec))
data = [[Paragraph(h, ParagraphStyle("hd3", parent=st_val_b, textColor=colors.white,
                                     alignment=2 if j else 0))
         for j, h in enumerate(["PRODUTO", "RECEITA LÍQUIDA", "CMV", "LUCRO BRUTO",
                                "DESPESAS OPER.", "RES. OPERAC.", "RES. FINANC.",
                                "RESULTADO LÍQUIDO", "MARGEM LÍQ."])]]
est = [
    ("BACKGROUND", (0, 0), (-1, 0), TEAL),
    ("GRID", (0, 0), (-1, -1), 0.4, colors.HexColor("#CCDDCC")),
    ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
    ("LEFTPADDING", (0, 0), (-1, -1), 3),
    ("RIGHTPADDING", (0, 0), (-1, -1), 3),
    ("TOPPADDING", (0, 0), (-1, -1), 2.5),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 2.5),
]
soma = [0.0] * 7
for i, s in enumerate(secoes[1:]):
    l2 = {ln["label"]: ln for ln in s["linhas"]}
    vals = [l2[k]["valores"][6] if k in l2 else 0.0 for k in CHAVES]
    rec, resl = vals[0], vals[6]
    marg = (resl / rec * 100) if rec else 0.0
    soma = [a + b for a, b in zip(soma, vals)]
    row = [Paragraph(s["nome"], st_lab_b)]
    for v in vals:
        cor = "#B3261E" if v < -0.004 else "#111111"
        row.append(Paragraph(f'<font color="{cor}">{brl(v)}</font>', st_val))
    cor = "#B3261E" if marg < -0.04 else "#111111"
    row.append(Paragraph(f'<font color="{cor}">{pct(marg)}</font>', st_val_b))
    data.append(row)
    if i % 2 == 1:
        est.append(("BACKGROUND", (0, i + 1), (-1, i + 1), ZEBRA))
row = [Paragraph("TOTAL", st_lab_b)]
for v in soma:
    cor = "#B3261E" if v < -0.004 else "#111111"
    row.append(Paragraph(f'<font color="{cor}"><b>{brl(v)}</b></font>', st_val_b))
marg_t = soma[6] / soma[0] * 100 if soma[0] else 0.0
cor = "#B3261E" if marg_t < 0 else "#111111"
row.append(Paragraph(f'<font color="{cor}"><b>{pct(marg_t)}</b></font>', st_val_b))
data.append(row)
est.append(("BACKGROUND", (0, len(data) - 1), (-1, len(data) - 1), MENTA))
t = Table(data, colWidths=[36 * mm] + [28.5 * mm] * 7 + [17.5 * mm])
t.setStyle(TableStyle(est))
story.append(t)
story.append(Spacer(1, 4 * mm))
story.append(Paragraph(
    "Em cada célula das seções seguintes: valor em R$ e, abaixo, o percentual sobre a Receita Líquida da própria seção (análise vertical). "
    "Valores negativos em vermelho. TOTAL da tabela acima soma os 8 produtos e confere com o Consolidado (diferenças de centavos = arredondamento da fonte).",
    st_note))
story.append(PageBreak())

# ---- seções completas ----
for s in secoes:
    story.append(Paragraph(s["titulo"], st_sec))
    story.append(tabela_secao(s))
    story.append(Spacer(1, 2 * mm))
    story.append(Paragraph(
        'Fonte: "RESULTADO 1S2026 Box RecifePE" (DRE Gerencial, relatório interno Igarashi HF). Percentuais = análise vertical sobre a Receita Líquida da seção.',
        st_note))
    if s is not secoes[-1]:
        story.append(PageBreak())


def rodape(canvas, doc_):
    canvas.saveState()
    canvas.setFont("Helvetica", 6.5)
    canvas.setFillColor(colors.HexColor("#667766"))
    canvas.drawString(10 * mm, 5 * mm,
                      "Grupo Igarashi HF — Box Ceasa Recife/PE — DRE Gerencial 1S2026")
    canvas.drawRightString(287 * mm, 5 * mm, f"pág. {canvas.getPageNumber()}")
    canvas.restoreState()


doc.build(story, onFirstPage=rodape, onLaterPages=rodape)
print("gerado DRE_BoxRecifePE_1S2026.pdf")
