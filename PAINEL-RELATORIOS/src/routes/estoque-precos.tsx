import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";
import { AppShell, ModuleHeader } from "@/components/AppShell";
import { ExportBar } from "@/components/ExportBar";
import { fmtBRL, fmtNum } from "@/lib/storage";
import { Users2, EyeOff, Sprout, Leaf, Carrot, Circle, Salad, Apple, Package } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export const Route = createFileRoute("/estoque-precos")({
  head: () => ({
    meta: [
      { title: "Estoque e Preços — Igarashi HF" },
      { name: "description", content: "Consolidado de estoque por categoria, valor a preço de venda e pendências." },
    ],
  }),
  component: Estoque,
});

type Item = {
  produto: string; classe: string; obs?: string; nf: string; qtd: number; unidade: string;
  precoUnit: number | null; situacao: "OK" | "Pendente"; principal?: boolean;
};

type Categoria = { nome: string; icon: LucideIcon; cor: string; itens: Item[] };

const CATEGORIAS: Categoria[] = [
  {
    nome: "Batata", icon: Sprout, cor: "#d4a54c",
    itens: [
      { produto: "Batata Especial", classe: "Extra", nf: "NF 18432", qtd: 620, unidade: "sc", precoUnit: 62.5, situacao: "OK", principal: true },
      { produto: "Batata Especial", classe: "Comum", nf: "NF 18420", qtd: 380, unidade: "sc", precoUnit: 54.0, situacao: "OK" },
      { produto: "Batata Ágata", classe: "Extra", nf: "", qtd: 210, unidade: "sc", precoUnit: null, situacao: "Pendente", obs: "Aguardando NF" },
    ],
  },
  {
    nome: "Cebola", icon: Circle, cor: "#c07050",
    itens: [
      { produto: "Cebola Nacional 3", classe: "Comum", nf: "NF 18441", qtd: 420, unidade: "sc", precoUnit: 78.0, situacao: "OK", principal: true },
      { produto: "Cebola Importada", classe: "Extra", nf: "NF 18438", qtd: 180, unidade: "sc", precoUnit: 92.0, situacao: "OK" },
    ],
  },
  {
    nome: "Cenoura", icon: Carrot, cor: "#e8823a",
    itens: [
      { produto: "Cenoura Extra", classe: "Extra", nf: "NF 18445", qtd: 240, unidade: "cx", precoUnit: 48.0, situacao: "OK", principal: true },
      { produto: "Cenoura Ana", classe: "Comum", nf: "", qtd: 90, unidade: "cx", precoUnit: null, situacao: "Pendente", obs: "Preço a definir" },
    ],
  },
  {
    nome: "Beterraba", icon: Leaf, cor: "#a83b5a",
    itens: [
      { produto: "Beterraba Extra", classe: "Extra", nf: "NF 18450", qtd: 150, unidade: "sc", precoUnit: 55.0, situacao: "OK", principal: true },
    ],
  },
  {
    nome: "Repolho", icon: Salad, cor: "#7ab86a",
    itens: [
      { produto: "Repolho Verde", classe: "Comum", nf: "NF 18452", qtd: 320, unidade: "sc", precoUnit: 42.0, situacao: "OK", principal: true },
    ],
  },
  {
    nome: "Maçã", icon: Apple, cor: "#d84c4c",
    itens: [
      { produto: "Maçã Fuji", classe: "Cat I", nf: "NF 18461", qtd: 180, unidade: "cx", precoUnit: 165.0, situacao: "OK", principal: true },
      { produto: "Maçã Gala", classe: "Cat I", nf: "NF 18462", qtd: 140, unidade: "cx", precoUnit: 152.0, situacao: "OK" },
    ],
  },
];

function Estoque() {
  const [modo, setModo] = useState<"executivo" | "grupo">("executivo");
  const reportRef = useRef<HTMLDivElement>(null);
  const ocultarValores = modo === "grupo";

  const resumo = useMemo(() => {
    return CATEGORIAS.map((cat) => {
      let valor = 0, volume = 0, pend = 0;
      for (const i of cat.itens) {
        volume += i.qtd;
        if (i.precoUnit !== null) valor += i.qtd * i.precoUnit;
        if (i.situacao === "Pendente") pend += 1;
      }
      return { nome: cat.nome, valor, volume, unidade: cat.itens[0]?.unidade ?? "un", itens: cat.itens.length, pendencias: pend };
    });
  }, []);
  const totais = useMemo(() => {
    const valor = resumo.reduce((s, r) => s + r.valor, 0);
    const volume = resumo.reduce((s, r) => s + r.volume, 0);
    const itens = resumo.reduce((s, r) => s + r.itens, 0);
    const pend = resumo.reduce((s, r) => s + r.pendencias, 0);
    return { valor, volume, itens, pend };
  }, [resumo]);

  const sheets = () => {
    const rows: (string | number)[][] = [
      ["Categoria", "Produto", "Classe", "NF", "Qtd", "Unidade", "Preço unit.", "Valor total", "Situação", "Obs."],
    ];
    for (const cat of CATEGORIAS) {
      for (const it of cat.itens) {
        rows.push([
          cat.nome,
          (it.principal ? it.produto.toUpperCase() : it.produto),
          it.classe,
          it.nf,
          it.qtd,
          it.unidade,
          it.precoUnit ?? "",
          it.precoUnit !== null ? it.qtd * it.precoUnit : "",
          it.situacao,
          it.obs ?? "",
        ]);
      }
    }
    rows.push([], ["", "TOTAL", "", "", totais.volume, "", "", totais.valor, "", ""]);
    return [
      { name: "Estoque", colWidths: [12, 24, 10, 10, 8, 8, 12, 14, 10, 20], rows },
      { name: "Resumo", colWidths: [14, 14, 10, 8, 8, 12], rows: [
        ["Categoria", "Valor estimado", "Volumes", "Un.", "Itens", "Pendências"],
        ...resumo.map((r) => [r.nome, r.valor, r.volume, r.unidade, r.itens, r.pendencias]),
      ]},
    ];
  };

  return (
    <AppShell>
      <div className="px-6 lg:px-10 py-8 max-w-[1400px] mx-auto">
        <ModuleHeader
          eyebrow="Relatório comercial e operacional"
          title="Estoque e Preços"
          description="Fotografia do galpão. Valor calculado a preço de venda. Itens sem preço não entram no total."
          actions={
            <ExportBar
              targetRef={reportRef}
              baseName={`estoque_${modo}_${format(new Date(), "yyyyMMdd")}`}
              sheets={sheets}
              extra={
                <button
                  className={`btn ${modo === "grupo" ? "btn-gold" : "btn-outline"}`}
                  onClick={() => setModo(modo === "grupo" ? "executivo" : "grupo")}
                >
                  {modo === "grupo" ? <><EyeOff className="h-4 w-4" />Modo Grupo (ativo)</> : <><Users2 className="h-4 w-4" />Modo Estoque Grupo</>}
                </button>
              }
            />
          }
        />

        <div ref={reportRef} className="space-y-6 bg-background p-6 rounded-lg">
          <div className="module-surface p-5 flex flex-wrap justify-between gap-4">
            <div>
              <div className="text-[0.68rem] uppercase tracking-wider text-primary font-semibold">Igarashi HF · Recife</div>
              <div className="text-xl font-bold mt-1">Estoque e Preços</div>
              <div className="text-xs text-muted-foreground mt-1">
                Atualizado em {format(new Date(), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                {ocultarValores && <span className="chip chip-gold ml-2">Versão para grupo comercial</span>}
              </div>
            </div>
            {!ocultarValores && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-right">
                <Kpi label="Valor total" value={fmtBRL(totais.valor)} accent />
                <Kpi label="Volumes" value={fmtNum(totais.volume)} />
                <Kpi label="Categorias" value={fmtNum(resumo.length)} />
                <Kpi label="Pendências" value={fmtNum(totais.pend)} />
              </div>
            )}
          </div>

          {/* Resumo por categoria */}
          {!ocultarValores && (
            <div className="module-surface p-5">
              <div className="section-title">Resumo por categoria</div>
              <div className="table-scroll">
                <table className="table-clean">
                  <thead><tr><th>Categoria</th><th className="text-right">Valor estimado</th><th className="text-right">Volumes</th><th>Un.</th><th className="text-right">Itens</th><th className="text-right">Pendências</th></tr></thead>
                  <tbody>
                    {resumo.map((r) => {
                      const cat = CATEGORIAS.find(c => c.nome === r.nome)!;
                      const Icon = cat.icon;
                      return (
                        <tr key={r.nome}>
                          <td>
                            <div className="flex items-center gap-2">
                              <span className="grid place-items-center h-7 w-7 rounded-md" style={{ background: `${cat.cor}22`, color: cat.cor }}>
                                <Icon className="h-4 w-4" />
                              </span>
                              <span className="font-semibold">{r.nome}</span>
                            </div>
                          </td>
                          <td className="text-right">{fmtBRL(r.valor)}</td>
                          <td className="text-right">{fmtNum(r.volume)}</td>
                          <td>{r.unidade}</td>
                          <td className="text-right">{r.itens}</td>
                          <td className="text-right">{r.pendencias > 0 ? <span className="chip chip-gold">{r.pendencias}</span> : "—"}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Categorias detalhadas */}
          {CATEGORIAS.map((cat) => {
            const r = resumo.find(x => x.nome === cat.nome)!;
            const Icon = cat.icon;
            return (
              <div key={cat.nome} className="module-surface p-5">
                <div className="flex justify-between items-start mb-4 flex-wrap gap-3">
                  <div className="cat-header">
                    <span className="cat-icon" style={{ color: cat.cor, background: `${cat.cor}22`, borderColor: `${cat.cor}66` }}>
                      <Icon className="h-6 w-6" />
                    </span>
                    <div>
                      <div className="cat-title" style={{ color: cat.cor }}>{cat.nome.toUpperCase()}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{r.itens} itens · {fmtNum(r.volume)} {r.unidade}</div>
                    </div>
                  </div>
                  {!ocultarValores && (
                    <div className="text-right">
                      <div className="text-[0.65rem] uppercase tracking-wider text-muted-foreground">Valor estimado</div>
                      <div className="text-lg font-bold text-primary tabular">{fmtBRL(r.valor)}</div>
                    </div>
                  )}
                </div>
                <div className="table-scroll">
                  <table className="table-clean table-estoque">
                    <thead>
                      <tr>
                        <th>Produto</th><th>Classe</th><th>NF</th>
                        <th className="text-right">Qtd</th><th>Un.</th>
                        <th className="text-right">Preço / un</th>
                        <th>Situação</th><th>Obs.</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cat.itens.map((it, idx) => (
                        <tr key={idx} className={it.situacao === "Pendente" ? "row-pendente" : ""}>
                          <td className={it.principal ? "font-bold uppercase tracking-wide text-foreground" : "font-medium"}>
                            {it.produto}
                            {it.principal && <span className="chip chip-primary ml-2 !text-[0.6rem]">Principal</span>}
                          </td>
                          <td>{it.classe}</td>
                          <td className="text-xs">{it.nf || <span className="text-warning">—</span>}</td>
                          <td className="text-right">{fmtNum(it.qtd)}</td>
                          <td>{it.unidade}</td>
                          <td className="text-right font-semibold">{it.precoUnit !== null ? fmtBRL(it.precoUnit) : <span className="text-warning">a definir</span>}</td>
                          <td>{it.situacao === "OK"
                            ? <span className="chip chip-primary">OK</span>
                            : <span className="chip chip-gold">Pendente</span>}
                          </td>
                          <td className="text-xs text-muted-foreground">{it.obs || "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}

          <div className="text-xs text-muted-foreground p-3 border-t border-border">
            Regra do cálculo: valor em estoque = quantidade × preço unitário de venda. Itens sem preço definido não entram no total consolidado.
            <span className="ml-2">Linhas com faixa dourada indicam itens pendentes; faixa verde indica itens OK.</span>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function Kpi({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className={`kpi-card ${accent ? "accent" : ""}`}>
      <div className="kpi-label">{label}</div>
      <div className={`kpi-value ${accent ? "text-primary" : ""}`}>{value}</div>
    </div>
  );
}
