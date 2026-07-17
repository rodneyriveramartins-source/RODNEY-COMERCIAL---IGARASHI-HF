import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { AppShell, ModuleHeader } from "@/components/AppShell";
import { ExportBar } from "@/components/ExportBar";
import {
  defaultProdutos, defaultVendedores, loadLS, saveLS,
  PRODUTOS_KEY, VENDEDORES_KEY, type ProdutoMestre, type Vendedor,
  fmtBRL,
} from "@/lib/storage";
import { Trash2, Plus, Eye, EyeOff, Lock, Pencil, X, Check } from "lucide-react";
import { format } from "date-fns";

export const Route = createFileRoute("/tabela-precos")({
  head: () => ({
    meta: [
      { title: "Editor de Tabela de Preços — Igarashi HF" },
      { name: "description", content: "Cotação diária personalizada por cliente com preço, mínimo, embalagem e vendedor responsável." },
    ],
  }),
  component: TabelaPrecos,
});

type Linha = {
  id: string;
  produtoId: string;
  frete: "CIF" | "FOB";
  preco: number;
  precoMin: number;
};

function TabelaPrecos() {
  const reportRef = useRef<HTMLDivElement>(null);
  const [produtos, setProdutos] = useState<ProdutoMestre[]>(() => loadLS(PRODUTOS_KEY, defaultProdutos));
  const [vendedores, setVendedores] = useState<Vendedor[]>(() => loadLS(VENDEDORES_KEY, defaultVendedores));

  useEffect(() => saveLS(PRODUTOS_KEY, produtos), [produtos]);
  useEffect(() => saveLS(VENDEDORES_KEY, vendedores), [vendedores]);

  const [data, setData] = useState(format(new Date(), "yyyy-MM-dd"));
  const [dataLocked, setDataLocked] = useState(true);

  const [cliente, setCliente] = useState("");
  const [clienteLocked, setClienteLocked] = useState(false);

  const [vendedorId, setVendedorId] = useState<string>("");
  const vendedor = vendedores.find((v) => v.id === vendedorId);

  const [linhas, setLinhas] = useState<Linha[]>([]);
  const [produtoSel, setProdutoSel] = useState<string>("");
  const [mostrarMin, setMostrarMin] = useState(true);

  const [novoProduto, setNovoProduto] = useState<{ familia: string; classe: string; embalagem: string; pesoKg: string } | null>(null);
  const [novoVend, setNovoVend] = useState<{ nome: string; funcao: string; whatsapp: string } | null>(null);

  const addProduto = () => {
    if (!produtoSel) return;
    setLinhas((ls) => [...ls, { id: crypto.randomUUID(), produtoId: produtoSel, frete: "CIF", preco: 0, precoMin: 0 }]);
  };
  const addAll = () => {
    setLinhas(produtos.map((p) => ({ id: crypto.randomUUID(), produtoId: p.id, frete: "CIF", preco: 0, precoMin: 0 })));
  };
  const clearAll = () => setLinhas([]);
  const rmLinha = (id: string) => setLinhas((ls) => ls.filter((l) => l.id !== id));
  const updateLinha = (id: string, patch: Partial<Linha>) =>
    setLinhas((ls) => ls.map((l) => (l.id === id ? { ...l, ...patch } : l)));

  const salvarNovoProduto = () => {
    if (!novoProduto?.familia) return;
    const p: ProdutoMestre = {
      id: crypto.randomUUID(),
      familia: novoProduto.familia,
      classe: novoProduto.classe,
      embalagem: novoProduto.embalagem,
      pesoKg: Number(novoProduto.pesoKg) || 0,
    };
    setProdutos((ps) => [...ps, p]);
    setNovoProduto(null);
  };

  const salvarNovoVend = () => {
    if (!novoVend?.nome) return;
    const v: Vendedor = { id: crypto.randomUUID(), ...novoVend };
    setVendedores((vs) => [...vs, v]);
    setVendedorId(v.id);
    setNovoVend(null);
  };

  const podeExportar = clienteLocked && !!vendedor && linhas.length > 0;

  return (
    <AppShell>
      <div className="px-6 lg:px-10 py-8 max-w-6xl mx-auto">
        <ModuleHeader
          eyebrow="Documento comercial"
          title="Editor de Tabela de Preços"
          description="Cotação diária personalizada. Confirme cliente e vendedor antes de exportar."
          actions={
            <ExportBar
              targetRef={reportRef}
              baseName={`tabela_precos_${cliente || "cliente"}_${data}`}
              extra={
                <button
                  className="btn btn-outline"
                  onClick={() => setMostrarMin((m) => !m)}
                >
                  {mostrarMin ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  {mostrarMin ? "Ocultar mínimo" : "Mostrar mínimo"}
                </button>
              }
            />
          }
        />

        {!podeExportar && (
          <div className="module-surface p-3 mb-4 border-warning/50 text-xs text-warning">
            Confirme cliente, vendedor e adicione pelo menos um produto antes de exportar.
          </div>
        )}

        {/* Controles */}
        <div className="module-surface p-4 mb-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="field-label">Data da cotação</label>
              <div className="flex gap-1">
                <input
                  type="date" value={data} disabled={dataLocked}
                  onChange={(e) => setData(e.target.value)}
                  className="input-base"
                />
                <button className="btn btn-outline" onClick={() => setDataLocked((l) => !l)}>
                  {dataLocked ? <Pencil className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="field-label">Cliente</label>
              <div className="flex gap-1">
                <input
                  className="input-base"
                  placeholder="Nome do cliente"
                  value={cliente}
                  disabled={clienteLocked}
                  onChange={(e) => setCliente(e.target.value)}
                />
                {clienteLocked ? (
                  <>
                    <button className="btn btn-outline" onClick={() => setClienteLocked(false)}><Pencil className="h-4 w-4" /></button>
                    <button className="btn btn-danger" onClick={() => { setCliente(""); setClienteLocked(false); }}><X className="h-4 w-4" /></button>
                  </>
                ) : (
                  <button className="btn btn-primary" onClick={() => cliente && setClienteLocked(true)}><Lock className="h-4 w-4" />Aplicar</button>
                )}
              </div>
            </div>

            <div>
              <label className="field-label">Vendedor responsável</label>
              <div className="flex gap-1">
                <select className="input-base" value={vendedorId} onChange={(e) => setVendedorId(e.target.value)}>
                  <option value="">Selecione</option>
                  {vendedores.filter(v => v.nome !== "Selecione um vendedor").map((v) => (
                    <option key={v.id} value={v.id}>{v.nome} · {v.funcao}</option>
                  ))}
                </select>
                <button className="btn btn-outline" onClick={() => setNovoVend({ nome: "", funcao: "", whatsapp: "" })}><Plus className="h-4 w-4" /></button>
              </div>
            </div>
          </div>

          {novoVend && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2 p-3 rounded-md border border-dashed border-primary/50">
              <input className="input-base" placeholder="Nome" value={novoVend.nome} onChange={(e) => setNovoVend({ ...novoVend, nome: e.target.value })} />
              <input className="input-base" placeholder="Função" value={novoVend.funcao} onChange={(e) => setNovoVend({ ...novoVend, funcao: e.target.value })} />
              <input className="input-base" placeholder="WhatsApp" value={novoVend.whatsapp} onChange={(e) => setNovoVend({ ...novoVend, whatsapp: e.target.value })} />
              <div className="flex gap-1">
                <button className="btn btn-primary flex-1" onClick={salvarNovoVend}>Cadastrar vendedor</button>
                <button className="btn btn-ghost" onClick={() => setNovoVend(null)}><X className="h-4 w-4" /></button>
              </div>
            </div>
          )}

          <div className="flex flex-wrap items-end gap-2 pt-3 border-t border-border">
            <div className="flex-1 min-w-[200px]">
              <label className="field-label">Produto (lista mestre)</label>
              <select className="input-base" value={produtoSel} onChange={(e) => setProdutoSel(e.target.value)}>
                <option value="">Selecione um produto</option>
                {produtos.map((p) => (
                  <option key={p.id} value={p.id}>{p.familia} · {p.classe} · {p.embalagem} {p.pesoKg}kg</option>
                ))}
              </select>
            </div>
            <button className="btn btn-primary" onClick={addProduto}><Plus className="h-4 w-4" />Adicionar produto</button>
            <button className="btn btn-outline" onClick={addAll}>Carregar todos</button>
            <button className="btn btn-danger" onClick={clearAll}>Limpar tabela</button>
            <button className="btn btn-outline" onClick={() => setNovoProduto({ familia: "", classe: "", embalagem: "", pesoKg: "" })}>
              <Plus className="h-4 w-4" />Cadastrar produto
            </button>
          </div>

          {novoProduto && (
            <div className="grid grid-cols-1 md:grid-cols-5 gap-2 p-3 rounded-md border border-dashed border-primary/50">
              <input className="input-base" placeholder="Família" value={novoProduto.familia} onChange={(e) => setNovoProduto({ ...novoProduto, familia: e.target.value })} />
              <input className="input-base" placeholder="Classe" value={novoProduto.classe} onChange={(e) => setNovoProduto({ ...novoProduto, classe: e.target.value })} />
              <input className="input-base" placeholder="Embalagem" value={novoProduto.embalagem} onChange={(e) => setNovoProduto({ ...novoProduto, embalagem: e.target.value })} />
              <input className="input-base" placeholder="Peso (kg)" type="number" value={novoProduto.pesoKg} onChange={(e) => setNovoProduto({ ...novoProduto, pesoKg: e.target.value })} />
              <div className="flex gap-1">
                <button className="btn btn-primary flex-1" onClick={salvarNovoProduto}>Salvar</button>
                <button className="btn btn-ghost" onClick={() => setNovoProduto(null)}><X className="h-4 w-4" /></button>
              </div>
            </div>
          )}
        </div>

        {/* Documento */}
        <div ref={reportRef} className="module-surface p-6 bg-background">
          <div className="flex flex-wrap justify-between items-start gap-4 border-b border-border pb-4 mb-4">
            <div>
              <div className="text-[0.68rem] uppercase tracking-wider text-primary font-semibold">Igarashi HF · Recife</div>
              <h2 className="text-xl font-bold mt-1">Tabela de Preços</h2>
              <div className="text-sm text-muted-foreground mt-1">
                Cliente: <b className="text-foreground">{cliente || "—"}</b>
              </div>
            </div>
            <div className="text-right text-xs">
              <div className="text-muted-foreground">Data</div>
              <div className="font-semibold text-sm">{format(new Date(data + "T00:00"), "dd/MM/yyyy")}</div>
              <div className="chip chip-gold mt-2">Válida somente para o dia</div>
            </div>
          </div>

          {linhas.length === 0 ? (
            <div className="text-center text-muted-foreground text-sm py-10">
              Adicione produtos para montar a cotação.
            </div>
          ) : (
            <div className="table-scroll"><table className="table-clean">
              <thead>
                <tr>
                  <th>Produto</th>
                  <th>Tipo</th>
                  <th>Embalagem</th>
                  <th>Frete</th>
                  <th className="text-right">Preço</th>
                  {mostrarMin && <th className="text-right">Mínimo</th>}
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {linhas.map((l) => {
                  const p = produtos.find((x) => x.id === l.produtoId)!;
                  return (
                    <tr key={l.id}>
                      <td className="font-medium">{p.familia}</td>
                      <td>{p.classe}</td>
                      <td className="text-xs text-muted-foreground">{p.embalagem} · {p.pesoKg}kg</td>
                      <td>
                        <select className="input-base py-1" value={l.frete} onChange={(e) => updateLinha(l.id, { frete: e.target.value as "CIF" | "FOB" })}>
                          <option>CIF</option><option>FOB</option>
                        </select>
                      </td>
                      <td className="text-right">
                        <input type="number" step="0.01" className="input-base py-1 text-right w-28" value={l.preco || ""} onChange={(e) => updateLinha(l.id, { preco: Number(e.target.value) })} />
                      </td>
                      {mostrarMin && (
                        <td className="text-right">
                          <input type="number" step="0.01" className="input-base py-1 text-right w-28" value={l.precoMin || ""} onChange={(e) => updateLinha(l.id, { precoMin: Number(e.target.value) })} />
                        </td>
                      )}
                      <td className="text-right">
                        <button className="btn btn-ghost" onClick={() => rmLinha(l.id)}><Trash2 className="h-4 w-4" /></button>
                      </td>
                    </tr>
                  );
                })}
                {/* Read-only summary line for exported clarity */}
                <tr className="bg-surface">
                  <td colSpan={mostrarMin ? 4 : 4} className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Preços em BRL</td>
                  <td className="text-right text-xs text-muted-foreground">
                    Referência: {fmtBRL(linhas.reduce((s, l) => s + l.preco, 0) / (linhas.length || 1))}
                  </td>
                  {mostrarMin && <td />}
                  <td />
                </tr>
              </tbody>
            </table></div>
          )}

          <div className="mt-6 pt-4 border-t border-border flex flex-wrap justify-between items-end gap-4">
            <div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider">Vendedor responsável</div>
              {vendedor ? (
                <div className="mt-1">
                  <div className="font-semibold">{vendedor.nome}</div>
                  <div className="text-xs text-muted-foreground">{vendedor.funcao} · WhatsApp {vendedor.whatsapp}</div>
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">Selecione um vendedor</div>
              )}
            </div>
            <div className="text-xs text-muted-foreground max-w-xs text-right">
              Os preços podem variar sem aviso prévio. Cotação válida para o dia indicado.
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
