import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { AppShell, ModuleHeader } from "@/components/AppShell";
import { ExportBar } from "@/components/ExportBar";
import {
  defaultProdutos, defaultVendedores, loadLS, saveLS, PRODUTOS_KEY, VENDEDORES_KEY,
  type ProdutoMestre, type Vendedor, fmtBRL, fmtNum, fmtPct,
} from "@/lib/storage";
import { Trash2, Plus, EyeOff, Eye, Lock, Pencil, X } from "lucide-react";
import { format } from "date-fns";

export const Route = createFileRoute("/calculadora-preco")({
  head: () => ({
    meta: [
      { title: "Calculadora de Preço — Igarashi HF" },
      { name: "description", content: "Formação de preço, cotação e conferência entre esperado e realizado." },
    ],
  }),
  component: CalcPreco,
});

type Despesa = {
  id: string; nome: string; tipo: "reais" | "percentual"; valor: number; obs: string; doc: string;
};

type ProdutoCalc = {
  id: string;
  produtoId: string;
  frete: "CIF" | "FOB";
  pesoTotal: number;
  qtd: number;
  custoCompra: number;
  precoVenda: number;
  aplicado: boolean;
  despesas: Despesa[];
};

type ProdutoReal = {
  id: string;
  cotacaoId: string | null; // link ao produto da cotação
  produtoId: string;
  qtdReal: number;
  precoUnitReal: number;
  quebraPct: number;
  inserido: boolean;
};

const DESPESAS_PADRAO: { nome: string; tipo: "reais" | "percentual" }[] = [
  { nome: "Frete da produção", tipo: "reais" },
  { nome: "Frete para o cliente", tipo: "reais" },
  { nome: "Promotor", tipo: "reais" },
  { nome: "Descarga", tipo: "reais" },
  { nome: "Caixaria", tipo: "reais" },
  { nome: "Escolta", tipo: "reais" },
  { nome: "Desconto contratual", tipo: "percentual" },
  { nome: "Desconto financeiro", tipo: "percentual" },
  { nome: "Comissão do vendedor", tipo: "percentual" },
  { nome: "Seguro", tipo: "percentual" },
];

function CalcPreco() {
  const [tab, setTab] = useState<"cotacao" | "realizado">("cotacao");
  const cotacaoRef = useRef<HTMLDivElement>(null);
  const realRef = useRef<HTMLDivElement>(null);

  const [produtosM] = useState<ProdutoMestre[]>(() => loadLS(PRODUTOS_KEY, defaultProdutos));
  const [vendedores, setVendedores] = useState<Vendedor[]>(() => loadLS(VENDEDORES_KEY, defaultVendedores));
  useEffect(() => saveLS(VENDEDORES_KEY, vendedores), [vendedores]);

  const [cliente, setCliente] = useState(""); const [cLock, setCLock] = useState(false);
  const [tipoCli, setTipoCli] = useState<"varejo" | "atacadista" | "lojista">("varejo");
  const [custoBoxPct, setCustoBoxPct] = useState(5);
  const [vendedorId, setVendedorId] = useState("");
  const vendedor = vendedores.find((v) => v.id === vendedorId);
  const [novoVend, setNovoVend] = useState<{ nome: string; funcao: string; whatsapp: string } | null>(null);
  const [mostrarQtd, setMostrarQtd] = useState(true);

  const [produtos, setProdutos] = useState<ProdutoCalc[]>([]);
  const addProdutoCalc = () => {
    if (produtosM.length === 0) return;
    setProdutos((ps) => [...ps, {
      id: crypto.randomUUID(), produtoId: produtosM[0].id, frete: "CIF",
      pesoTotal: 0, qtd: 0, custoCompra: 0, precoVenda: 0, aplicado: false, despesas: [],
    }]);
  };
  const updP = (id: string, p: Partial<ProdutoCalc>) => setProdutos((ps) => ps.map((x) => x.id === id ? { ...x, ...p } : x));
  const rmP = (id: string) => setProdutos((ps) => ps.filter((x) => x.id !== id));
  const addDespesa = (pid: string) =>
    updP(pid, {
      despesas: [...(produtos.find((x) => x.id === pid)?.despesas ?? []),
      { id: crypto.randomUUID(), nome: "Nova despesa", tipo: "reais", valor: 0, obs: "", doc: "" }],
    });
  const updDesp = (pid: string, did: string, patch: Partial<Despesa>) => {
    const p = produtos.find((x) => x.id === pid);
    if (!p) return;
    updP(pid, { despesas: p.despesas.map((d) => d.id === did ? { ...d, ...patch } : d) });
  };
  const rmDesp = (pid: string, did: string) => {
    const p = produtos.find((x) => x.id === pid);
    if (!p) return;
    updP(pid, { despesas: p.despesas.filter((d) => d.id !== did) });
  };

  // Cálculos por produto
  const calcs = useMemo(() => produtos.map((p) => {
    const pm = produtosM.find((x) => x.id === p.produtoId)!;
    const qtdAuto = pm.pesoKg > 0 ? p.pesoTotal / pm.pesoKg : 0;
    const qtd = p.qtd > 0 ? p.qtd : qtdAuto;
    const despReaisTotal = p.despesas.filter(d => d.tipo === "reais").reduce((s, d) => s + d.valor, 0);
    const despReaisUnit = qtd > 0 ? despReaisTotal / qtd : 0;
    const despPctTotal = p.despesas.filter(d => d.tipo === "percentual").reduce((s, d) => s + d.valor, 0) / 100;
    const despPctUnit = p.precoVenda * despPctTotal;
    const custoBoxUnit = p.precoVenda * (custoBoxPct / 100);
    const custoTotalUnit = p.custoCompra + despReaisUnit + despPctUnit + custoBoxUnit;
    const resultUnit = p.precoVenda - custoTotalUnit;
    const resultTot = resultUnit * qtd;
    const resultKg = pm.pesoKg > 0 ? resultUnit / pm.pesoKg : 0;
    const precoKg = pm.pesoKg > 0 ? p.precoVenda / pm.pesoKg : 0;
    const margem = p.precoVenda > 0 ? resultUnit / p.precoVenda : 0;
    const markup = custoTotalUnit > 0 ? resultUnit / custoTotalUnit : 0;
    return { ...p, pm, qtd, despReaisUnit, despPctUnit, custoBoxUnit, custoTotalUnit, resultUnit, resultTot, resultKg, precoKg, margem, markup };
  }), [produtos, produtosM, custoBoxPct]);

  const consol = useMemo(() => {
    let fat = 0, custo = 0, resultado = 0, qtd = 0, peso = 0;
    for (const c of calcs) {
      fat += c.precoVenda * c.qtd;
      custo += c.custoTotalUnit * c.qtd;
      resultado += c.resultTot;
      qtd += c.qtd;
      peso += c.pm.pesoKg * c.qtd;
    }
    return {
      fat, custo, resultado, qtd, peso,
      resultUnit: qtd > 0 ? resultado / qtd : 0,
      resultKg: peso > 0 ? resultado / peso : 0,
      margem: fat > 0 ? resultado / fat : 0,
      markup: custo > 0 ? resultado / custo : 0,
    };
  }, [calcs]);

  // Realizado
  const [reais, setReais] = useState<ProdutoReal[]>([]);
  const [dataEntrega, setDataEntrega] = useState(format(new Date(), "yyyy-MM-dd"));
  const [pedidoNum, setPedidoNum] = useState("");
  const [loja, setLoja] = useState("");

  const atualizarDoAmb1 = () => {
    setReais(calcs.map((c) => ({
      id: crypto.randomUUID(), cotacaoId: c.id, produtoId: c.produtoId,
      qtdReal: c.qtd, precoUnitReal: c.precoVenda, quebraPct: 0, inserido: false,
    })));
  };
  const addProdutoReal = () => {
    if (produtosM.length === 0) return;
    setReais((rs) => [...rs, { id: crypto.randomUUID(), cotacaoId: null, produtoId: produtosM[0].id, qtdReal: 0, precoUnitReal: 0, quebraPct: 0, inserido: false }]);
  };
  const updR = (id: string, p: Partial<ProdutoReal>) => setReais((rs) => rs.map((x) => x.id === id ? { ...x, ...p } : x));
  const rmR = (id: string) => setReais((rs) => rs.filter((x) => x.id !== id));

  const realCalcs = useMemo(() => reais.map((r) => {
    const pm = produtosM.find((x) => x.id === r.produtoId)!;
    const cot = calcs.find((c) => c.id === r.cotacaoId);
    const fixasUnit = cot ? (cot.despReaisUnit + cot.custoBoxUnit) : 0;
    const pctTotal = cot ? cot.despesas.filter(d => d.tipo === "percentual").reduce((s, d) => s + d.valor, 0) / 100 : 0;
    const despPctUnitReal = r.precoUnitReal * pctTotal;
    const quebraUnit = r.precoUnitReal * (r.quebraPct / 100);
    const despRealUnit = fixasUnit + despPctUnitReal + quebraUnit;
    const custoCompra = cot ? cot.custoCompra : 0;
    const resultRealUnit = r.precoUnitReal - custoCompra - despRealUnit;
    const faturamento = r.precoUnitReal * r.qtdReal;
    const resultRealKg = pm.pesoKg > 0 ? resultRealUnit / pm.pesoKg : 0;
    const precoKg = pm.pesoKg > 0 ? r.precoUnitReal / pm.pesoKg : 0;
    return { ...r, pm, cot, despRealUnit, resultRealUnit, faturamento, resultRealKg, precoKg };
  }), [reais, calcs, produtosM]);

  const consolReal = useMemo(() => {
    const inseridos = realCalcs.filter((r) => r.inserido);
    let fat = 0, resultado = 0, qtd = 0, peso = 0, custo = 0;
    for (const c of inseridos) {
      fat += c.faturamento;
      resultado += c.resultRealUnit * c.qtdReal;
      qtd += c.qtdReal;
      peso += c.pm.pesoKg * c.qtdReal;
      const totCusto = (c.cot?.custoCompra ?? 0) + c.despRealUnit;
      custo += totCusto * c.qtdReal;
    }
    return {
      fat, resultado, qtd, peso, custo,
      resultUnit: qtd > 0 ? resultado / qtd : 0,
      resultKg: peso > 0 ? resultado / peso : 0,
      margem: fat > 0 ? resultado / fat : 0,
      markup: custo > 0 ? resultado / custo : 0,
    };
  }, [realCalcs]);

  const salvarNovoVend = () => {
    if (!novoVend?.nome) return;
    const v: Vendedor = { id: crypto.randomUUID(), ...novoVend };
    setVendedores((vs) => [...vs, v]);
    setVendedorId(v.id);
    setNovoVend(null);
  };

  const podeExportar = calcs.every(c => c.aplicado) && (tab === "cotacao" || realCalcs.every(r => r.inserido));

  return (
    <AppShell>
      <div className="px-6 lg:px-10 py-8 max-w-[1400px] mx-auto">
        <ModuleHeader
          eyebrow="Ferramenta de pricing"
          title="Calculadora de Preço"
          description="Formação de preço, cotação comercial e conferência esperado × realizado."
          actions={
            <ExportBar
              targetRef={tab === "cotacao" ? cotacaoRef : realRef}
              baseName={`${format(new Date(), "yyyyMMdd")}_${cliente || "cliente"}_cotacao_x_realizado_${tab}`}
              sheets={() => tab === "cotacao"
                ? [{
                    name: "Cotacao",
                    colWidths: [22, 12, 8, 8, 10, 12, 12, 12, 10, 10],
                    rows: [
                      ["Produto", "Classe", "Embal.", "Frete", "Qtd", "Custo/un", "Preço/un", "Preço/kg", "Result/un", "Margem"],
                      ...calcs.map((c) => [c.pm.familia, c.pm.classe, `${c.pm.embalagem} ${c.pm.pesoKg}kg`, c.frete,
                        c.qtd, c.custoCompra, c.precoVenda, c.precoKg, c.resultUnit, c.margem]),
                      [],
                      ["CONSOLIDADO", "", "", "", consol.qtd, "", consol.fat, "", consol.resultado, consol.margem],
                    ],
                  }]
                : [{
                    name: "Realizado",
                    colWidths: [22, 10, 12, 10, 12, 12, 12],
                    rows: [
                      ["Produto", "Qtd real", "Preço/un", "Quebra %", "Fatur.", "Result/un", "Result/kg"],
                      ...realCalcs.map((r) => [r.pm.familia, r.qtdReal, r.precoUnitReal, r.quebraPct,
                        r.faturamento, r.resultRealUnit, r.resultRealKg]),
                      [],
                      ["Esperado", "", "", "", consol.fat, consol.resultUnit, consol.resultKg],
                      ["Realizado", "", "", "", consolReal.fat, consolReal.resultUnit, consolReal.resultKg],
                    ],
                  }]}
            />
          }
        />

        {!podeExportar && (
          <div className="module-surface p-3 mb-4 border-warning/50 text-xs text-warning">
            Aplique todos os produtos antes de exportar. No ambiente Realizado, todos os itens devem estar inseridos na conferência.
          </div>
        )}

        {/* Config geral */}
        <div className="module-surface p-4 mb-4 grid grid-cols-1 md:grid-cols-5 gap-3">
          <div className="md:col-span-2">
            <label className="field-label">Cliente</label>
            <div className="flex gap-1">
              <input className="input-base" value={cliente} disabled={cLock} onChange={(e) => setCliente(e.target.value)} />
              {cLock ? (
                <button className="btn btn-outline" onClick={() => setCLock(false)}><Pencil className="h-4 w-4" /></button>
              ) : (
                <button className="btn btn-primary" onClick={() => cliente && setCLock(true)}><Lock className="h-4 w-4" /></button>
              )}
            </div>
          </div>
          <div>
            <label className="field-label">Tipo de cliente</label>
            <select className="input-base" value={tipoCli} onChange={(e) => setTipoCli(e.target.value as any)}>
              <option value="varejo">Varejo</option>
              <option value="atacadista">Atacadista</option>
              <option value="lojista">Lojista</option>
            </select>
          </div>
          <div>
            <label className="field-label">Custo do box (%)</label>
            <input type="number" step="0.1" className="input-base" value={custoBoxPct} onChange={(e) => setCustoBoxPct(Number(e.target.value))} />
          </div>
          <div>
            <label className="field-label">Vendedor</label>
            <div className="flex gap-1">
              <select className="input-base" value={vendedorId} onChange={(e) => setVendedorId(e.target.value)}>
                <option value="">Selecione</option>
                {vendedores.filter(v => v.nome !== "Selecione um vendedor").map((v) => <option key={v.id} value={v.id}>{v.nome}</option>)}
              </select>
              <button className="btn btn-outline" onClick={() => setNovoVend({ nome: "", funcao: "", whatsapp: "" })}><Plus className="h-4 w-4" /></button>
            </div>
          </div>
          {novoVend && (
            <div className="md:col-span-5 grid grid-cols-1 md:grid-cols-4 gap-2 p-3 border border-dashed border-primary/50 rounded-md">
              <input className="input-base" placeholder="Nome" value={novoVend.nome} onChange={(e) => setNovoVend({ ...novoVend, nome: e.target.value })} />
              <input className="input-base" placeholder="Função" value={novoVend.funcao} onChange={(e) => setNovoVend({ ...novoVend, funcao: e.target.value })} />
              <input className="input-base" placeholder="WhatsApp" value={novoVend.whatsapp} onChange={(e) => setNovoVend({ ...novoVend, whatsapp: e.target.value })} />
              <div className="flex gap-1">
                <button className="btn btn-primary flex-1" onClick={salvarNovoVend}>Cadastrar</button>
                <button className="btn btn-ghost" onClick={() => setNovoVend(null)}><X className="h-4 w-4" /></button>
              </div>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-4">
          <button className={`btn ${tab === "cotacao" ? "btn-primary" : "btn-outline"}`} onClick={() => setTab("cotacao")}>1 · Cotação</button>
          <button className={`btn ${tab === "realizado" ? "btn-primary" : "btn-outline"}`} onClick={() => setTab("realizado")}>2 · Realizado</button>
          <div className="grow" />
          {tab === "cotacao" && (
            <>
              <button className="btn btn-primary" onClick={addProdutoCalc}><Plus className="h-4 w-4" />Adicionar produto</button>
              <button className="btn btn-outline" onClick={() => setMostrarQtd((m) => !m)}>{mostrarQtd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}Qtd cliente</button>
            </>
          )}
          {tab === "realizado" && (
            <>
              <button className="btn btn-outline" onClick={atualizarDoAmb1}>Atualizar do Amb. 1</button>
              <button className="btn btn-primary" onClick={addProdutoReal}><Plus className="h-4 w-4" />Adicionar produto</button>
            </>
          )}
        </div>

        {tab === "cotacao" ? (
          <div ref={cotacaoRef} className="space-y-4 bg-background p-6 rounded-lg">
            <div className="module-surface p-5">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="text-[0.68rem] uppercase tracking-wider text-primary font-semibold">Igarashi HF · Recife</div>
                  <div className="text-lg font-bold mt-1">Cotação · {cliente || "—"}</div>
                  <div className="text-xs text-muted-foreground">{tipoCli} · {format(new Date(), "dd/MM/yyyy")}</div>
                </div>
                {vendedor && <div className="text-right text-xs"><div className="font-semibold text-sm">{vendedor.nome}</div><div className="text-muted-foreground">{vendedor.funcao} · {vendedor.whatsapp}</div></div>}
              </div>
            </div>

            {calcs.length === 0 && (
              <div className="module-surface p-10 text-center text-muted-foreground text-sm">
                Adicione produtos para começar a formação de preço.
              </div>
            )}

            {calcs.map((c) => (
              <div key={c.id} className={`module-surface p-5 ${c.aplicado ? "border-primary/40" : ""}`}>
                <div className="flex flex-col sm:flex-row sm:flex-wrap sm:justify-between sm:items-start gap-3 mb-3">
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-muted-foreground">Produto</div>
                    <select className="input-base mt-1" disabled={c.aplicado} value={c.produtoId} onChange={(e) => updP(c.id, { produtoId: e.target.value })}>
                      {produtosM.map((p) => <option key={p.id} value={p.id}>{p.familia} · {p.classe} · {p.embalagem} {p.pesoKg}kg</option>)}
                    </select>
                  </div>
                  <div className="flex gap-1 sm:pt-6 flex-wrap">
                    {c.aplicado
                      ? <button className="btn btn-outline" onClick={() => updP(c.id, { aplicado: false })}><Pencil className="h-4 w-4" />Editar</button>
                      : <button className="btn btn-primary" onClick={() => updP(c.id, { aplicado: true })}><Lock className="h-4 w-4" />Aplicar produto</button>}
                    <button className="btn btn-danger" onClick={() => rmP(c.id)}><Trash2 className="h-4 w-4" /></button>
                  </div>
                </div>

                <fieldset disabled={c.aplicado} className="contents">
                  <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-4">
                    <div><label className="field-label">Frete</label>
                      <select className="input-base" value={c.frete} onChange={(e) => updP(c.id, { frete: e.target.value as any })}><option>CIF</option><option>FOB</option></select>
                    </div>
                    <div><label className="field-label">Peso total (kg)</label><input type="number" className="input-base" value={c.pesoTotal || ""} onChange={(e) => updP(c.id, { pesoTotal: Number(e.target.value) })} /></div>
                    <div><label className="field-label">Qtd (auto: {fmtNum(c.pm.pesoKg > 0 ? c.pesoTotal / c.pm.pesoKg : 0, 1)})</label><input type="number" className="input-base" value={c.qtd || ""} onChange={(e) => updP(c.id, { qtd: Number(e.target.value) })} /></div>
                    <div><label className="field-label">Custo compra / un</label><input type="number" step="0.01" className="input-base" value={c.custoCompra || ""} onChange={(e) => updP(c.id, { custoCompra: Number(e.target.value) })} /></div>
                    <div><label className="field-label">Preço venda / un</label><input type="number" step="0.01" className="input-base" value={c.precoVenda || ""} onChange={(e) => updP(c.id, { precoVenda: Number(e.target.value) })} /></div>
                    <div><label className="field-label">Preço / kg</label><div className="input-base bg-surface text-primary font-semibold">{fmtBRL(c.precoKg)}</div></div>
                  </div>

                  {/* Despesas */}
                  <div className="border-t border-border pt-3">
                    <div className="flex justify-between items-center mb-2">
                      <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Despesas da operação</div>
                      <button className="btn btn-ghost text-xs" onClick={() => addDespesa(c.id)}><Plus className="h-3 w-3" />Adicionar</button>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {DESPESAS_PADRAO.map((d) => (
                        <button key={d.nome} className="chip hover:border-primary" onClick={() => updP(c.id, {
                          despesas: [...c.despesas, { id: crypto.randomUUID(), nome: d.nome, tipo: d.tipo, valor: 0, obs: "", doc: "" }]
                        })}>+ {d.nome}</button>
                      ))}
                    </div>
                    {c.despesas.length > 0 && (
                      <div className="table-scroll">
                      <table className="table-clean">
                        <thead><tr><th>Nome</th><th>Tipo</th><th className="text-right">Valor</th><th>Obs.</th><th>Doc.</th><th className="text-right">Impacto / un</th><th></th></tr></thead>
                        <tbody>
                          {c.despesas.map((d) => {
                            const imp = d.tipo === "reais" ? (c.qtd > 0 ? d.valor / c.qtd : 0) : c.precoVenda * (d.valor / 100);
                            return (
                              <tr key={d.id}>
                                <td><input className="input-base py-1 min-w-[8rem]" value={d.nome} onChange={(e) => updDesp(c.id, d.id, { nome: e.target.value })} /></td>
                                <td><select className="input-base py-1" value={d.tipo} onChange={(e) => updDesp(c.id, d.id, { tipo: e.target.value as any })}><option value="reais">R$</option><option value="percentual">%</option></select></td>
                                <td><input type="number" step="0.01" className="input-base py-1 text-right w-24" value={d.valor || ""} onChange={(e) => updDesp(c.id, d.id, { valor: Number(e.target.value) })} /></td>
                                <td><input className="input-base py-1 min-w-[8rem]" value={d.obs} onChange={(e) => updDesp(c.id, d.id, { obs: e.target.value })} /></td>
                                <td><input className="input-base py-1 w-24" value={d.doc} onChange={(e) => updDesp(c.id, d.id, { doc: e.target.value })} /></td>
                                <td className="text-right font-semibold">{fmtBRL(imp)}</td>
                                <td><button className="btn btn-ghost" onClick={() => rmDesp(c.id, d.id)}><Trash2 className="h-4 w-4" /></button></td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                      </div>
                    )}
                  </div>
                </fieldset>

                {/* Resultados */}
                <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-2 p-3 bg-surface rounded-md">
                  <Stat label="Custo total / un" value={fmtBRL(c.custoTotalUnit)} />
                  <Stat label="Resultado / un" value={fmtBRL(c.resultUnit)} positive={c.resultUnit >= 0} />
                  <Stat label="Resultado / kg" value={fmtBRL(c.resultKg)} positive={c.resultKg >= 0} />
                  <Stat label="Margem" value={fmtPct(c.margem)} positive={c.margem >= 0} />
                  <Stat label="Markup" value={fmtPct(c.markup)} positive={c.markup >= 0} />
                </div>
              </div>
            ))}

            {/* Consolidação */}
            {calcs.length > 0 && (
              <div className="module-surface p-5 border-primary/40">
                <div className="text-xs uppercase tracking-wider text-primary font-semibold mb-3">Consolidação da cotação</div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <Stat label="Faturamento total" value={fmtBRL(consol.fat)} big />
                  <Stat label="Custo total" value={fmtBRL(consol.custo)} big />
                  <Stat label="Resultado total" value={fmtBRL(consol.resultado)} big positive={consol.resultado >= 0} />
                  <Stat label="Peso total" value={`${fmtNum(consol.peso, 1)} kg`} big />
                  <Stat label="Resultado / un" value={fmtBRL(consol.resultUnit)} />
                  <Stat label="Resultado / kg" value={fmtBRL(consol.resultKg)} />
                  <Stat label="Margem" value={fmtPct(consol.margem)} />
                  <Stat label="Markup" value={fmtPct(consol.markup)} />
                </div>
              </div>
            )}

            {/* Documento cliente */}
            {calcs.length > 0 && (
              <div className="module-surface p-5">
                <div className="text-xs uppercase tracking-wider text-primary font-semibold mb-3">Documento comercial (versão para cliente)</div>
                <div className="table-scroll">
                <table className="table-clean">
                  <thead>
                    <tr><th>Produto</th><th>Classe</th><th>Embalagem</th><th>Frete</th>{mostrarQtd && <th className="text-right">Qtd</th>}<th className="text-right">Preço / un</th><th className="text-right">Preço / kg</th></tr>
                  </thead>
                  <tbody>
                    {calcs.map((c) => (
                      <tr key={c.id}>
                        <td className="font-medium">{c.pm.familia}</td>
                        <td>{c.pm.classe}</td>
                        <td className="text-xs text-muted-foreground">{c.pm.embalagem} · {c.pm.pesoKg}kg</td>
                        <td>{c.frete}</td>
                        {mostrarQtd && <td className="text-right">{fmtNum(c.qtd, 1)}</td>}
                        <td className="text-right font-semibold">{fmtBRL(c.precoVenda)}</td>
                        <td className="text-right">{fmtBRL(c.precoKg)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div ref={realRef} className="space-y-4 bg-background p-6 rounded-lg">
            <div className="module-surface p-5">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-[0.68rem] uppercase tracking-wider text-primary font-semibold">Igarashi HF · Recife</div>
                  <div className="text-lg font-bold mt-1">Realizado e Conferência · {cliente || "—"}</div>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
                <div><label className="field-label">Loja / Unidade</label><input className="input-base" value={loja} onChange={(e) => setLoja(e.target.value)} /></div>
                <div><label className="field-label">Data de entrega</label><input type="date" className="input-base" value={dataEntrega} onChange={(e) => setDataEntrega(e.target.value)} /></div>
                <div><label className="field-label">Nº do pedido</label><input className="input-base" value={pedidoNum} onChange={(e) => setPedidoNum(e.target.value)} /></div>
              </div>
            </div>

            {realCalcs.length === 0 && (
              <div className="module-surface p-10 text-center text-muted-foreground text-sm">
                Clique em <b>Atualizar do Ambiente 1</b> para importar a cotação, ou adicione produtos manualmente.
              </div>
            )}

            {realCalcs.map((r) => (
              <div key={r.id} className={`module-surface p-5 ${r.inserido ? "border-primary/40" : ""}`}>
                <div className="flex flex-col sm:flex-row sm:flex-wrap sm:justify-between sm:items-start gap-3 mb-3">
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-muted-foreground">
                      Produto {r.cotacaoId ? "(vinculado à cotação)" : "(adicional)"}
                    </div>
                    <select className="input-base mt-1" disabled={r.inserido} value={r.produtoId} onChange={(e) => updR(r.id, { produtoId: e.target.value })}>
                      {produtosM.map((p) => <option key={p.id} value={p.id}>{p.familia} · {p.classe} · {p.embalagem} {p.pesoKg}kg</option>)}
                    </select>
                  </div>
                  <div className="flex gap-1 sm:pt-6 flex-wrap">
                    {r.inserido
                      ? <button className="btn btn-outline" onClick={() => updR(r.id, { inserido: false })}><Pencil className="h-4 w-4" />Editar</button>
                      : <button className="btn btn-primary" onClick={() => r.qtdReal > 0 && updR(r.id, { inserido: true })}><Lock className="h-4 w-4" />Inserir</button>}
                    <button className="btn btn-danger" onClick={() => rmR(r.id)}><Trash2 className="h-4 w-4" /></button>
                  </div>
                </div>

                <fieldset disabled={r.inserido} className="contents">
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    <div><label className="field-label">Qtd realizada</label><input type="number" className="input-base" value={r.qtdReal || ""} onChange={(e) => updR(r.id, { qtdReal: Number(e.target.value) })} /></div>
                    <div><label className="field-label">Preço / un</label>
                      <input type="number" step="0.01" className="input-base" value={r.precoUnitReal || ""} onChange={(e) => updR(r.id, { precoUnitReal: Number(e.target.value) })} />
                    </div>
                    <div><label className="field-label">Preço / kg</label>
                      <input type="number" step="0.01" className="input-base" value={r.pm.pesoKg > 0 ? (r.precoUnitReal / r.pm.pesoKg).toFixed(2) : 0}
                        onChange={(e) => updR(r.id, { precoUnitReal: Number(e.target.value) * r.pm.pesoKg })} />
                    </div>
                    <div><label className="field-label">Quebra (%)</label><input type="number" step="0.1" className="input-base" value={r.quebraPct || ""} onChange={(e) => updR(r.id, { quebraPct: Number(e.target.value) })} /></div>
                    <div><label className="field-label">Faturamento</label><div className="input-base bg-surface font-semibold text-primary">{fmtBRL(r.faturamento)}</div></div>
                  </div>
                </fieldset>

                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2 p-3 bg-surface rounded-md">
                  <Stat label="Despesas / un (real)" value={fmtBRL(r.despRealUnit)} />
                  <Stat label="Result. esperado / un" value={fmtBRL(r.cot?.resultUnit ?? 0)} />
                  <Stat label="Result. realizado / un" value={fmtBRL(r.resultRealUnit)} positive={r.resultRealUnit >= 0} />
                  <Stat label="Result. realizado / kg" value={fmtBRL(r.resultRealKg)} positive={r.resultRealKg >= 0} />
                </div>
              </div>
            ))}

            {/* Comparativo */}
            {realCalcs.some(r => r.inserido) && (
              <div className="module-surface p-5">
                <div className="text-xs uppercase tracking-wider text-primary font-semibold mb-4">Esperado × Realizado</div>
                <div className="table-scroll">
                <table className="table-clean">
                  <thead><tr><th>Indicador</th><th className="text-right">Esperado</th><th className="text-right">Realizado</th><th className="text-right">Δ</th></tr></thead>
                  <tbody>
                    <CompareRow label="Faturamento total" e={consol.fat} r={consolReal.fat} money />
                    <CompareRow label="Resultado total" e={consol.resultado} r={consolReal.resultado} money />
                    <CompareRow label="Resultado / un" e={consol.resultUnit} r={consolReal.resultUnit} money />
                    <CompareRow label="Resultado / kg" e={consol.resultKg} r={consolReal.resultKg} money />
                    <CompareRow label="Margem" e={consol.margem} r={consolReal.margem} pct />
                    <CompareRow label="Markup" e={consol.markup} r={consolReal.markup} pct />
                  </tbody>
                </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </AppShell>
  );
}

function Stat({ label, value, positive, big }: { label: string; value: string; positive?: boolean; big?: boolean }) {
  const color = positive === undefined ? "" : positive ? "text-success" : "text-destructive";
  return (
    <div>
      <div className="text-[0.65rem] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className={`font-bold tabular ${big ? "text-lg" : "text-sm"} ${color}`}>{value}</div>
    </div>
  );
}
function CompareRow({ label, e, r, money, pct }: { label: string; e: number; r: number; money?: boolean; pct?: boolean }) {
  const fmt = money ? fmtBRL : pct ? (v: number) => fmtPct(v) : (v: number) => fmtNum(v, 2);
  const delta = r - e;
  const pos = delta >= 0;
  return (
    <tr>
      <td className="font-medium">{label}</td>
      <td className="text-right">{fmt(e)}</td>
      <td className="text-right font-semibold">{fmt(r)}</td>
      <td className={`text-right font-bold ${pos ? "text-success" : "text-destructive"}`}>{pos ? "+" : ""}{fmt(delta)}</td>
    </tr>
  );
}
