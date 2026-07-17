import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { AppShell, ModuleHeader } from "@/components/AppShell";
import { ExportBar } from "@/components/ExportBar";
import {
  defaultVendedores, loadLS, saveLS, VENDEDORES_KEY, type Vendedor, fmtBRL,
} from "@/lib/storage";
import { Trash2, Plus, Lock, Pencil, X, Check } from "lucide-react";
import { format } from "date-fns";

export const Route = createFileRoute("/acerto-desconto")({
  head: () => ({
    meta: [
      { title: "Acerto e Desconto — Igarashi HF" },
      { name: "description", content: "Documento interno de acerto, devolução e desconto com cálculo automático de valor a receber." },
    ],
  }),
  component: AcertoDesconto,
});

type ItemAcerto = {
  id: string;
  pedido: string;
  produto: string;
  devolucao: boolean;
  qtdOriginal: number;
  precoUnit: number;
  qtdDesconto: number;
};

const FIELD = (v: string, s: (v: string) => void, locked: boolean, setLocked: (b: boolean) => void, placeholder: string) => ({
  v, s, locked, setLocked, placeholder,
});

function AcertoDesconto() {
  const reportRef = useRef<HTMLDivElement>(null);
  const [vendedores, setVendedores] = useState<Vendedor[]>(() => loadLS(VENDEDORES_KEY, defaultVendedores));
  useEffect(() => saveLS(VENDEDORES_KEY, vendedores), [vendedores]);

  const [cliente, setCliente] = useState(""); const [cLock, setCLock] = useState(false);
  const [praca, setPraca] = useState("Recife"); const [pLock, setPLock] = useState(true);
  const [data, setData] = useState(format(new Date(), "yyyy-MM-dd")); const [dLock, setDLock] = useState(true);
  const [motivo, setMotivo] = useState(""); const [mLock, setMLock] = useState(false);
  const [vendedorId, setVendedorId] = useState<string>("");
  const [novoVend, setNovoVend] = useState<{ nome: string; funcao: string; whatsapp: string } | null>(null);

  const vendedor = vendedores.find((v) => v.id === vendedorId);

  const [itens, setItens] = useState<ItemAcerto[]>([
    { id: crypto.randomUUID(), pedido: "", produto: "", devolucao: false, qtdOriginal: 0, precoUnit: 0, qtdDesconto: 0 },
  ]);

  const addLinha = () => setItens((is) => [...is, { id: crypto.randomUUID(), pedido: "", produto: "", devolucao: false, qtdOriginal: 0, precoUnit: 0, qtdDesconto: 0 }]);
  const rmLinha = (id: string) => setItens((is) => is.filter((i) => i.id !== id));
  const limparLinhas = () => setItens([{ id: crypto.randomUUID(), pedido: "", produto: "", devolucao: false, qtdOriginal: 0, precoUnit: 0, qtdDesconto: 0 }]);
  const upd = (id: string, p: Partial<ItemAcerto>) => setItens((is) => is.map((i) => (i.id === id ? { ...i, ...p } : i)));

  const totais = useMemo(() => {
    let orig = 0, desc = 0;
    for (const i of itens) {
      orig += i.qtdOriginal * i.precoUnit;
      desc += i.qtdDesconto * i.precoUnit;
    }
    return { orig, desc, final: orig - desc };
  }, [itens]);

  const salvarNovoVend = () => {
    if (!novoVend?.nome) return;
    const v: Vendedor = { id: crypto.randomUUID(), ...novoVend };
    setVendedores((vs) => [...vs, v]);
    setVendedorId(v.id);
    setNovoVend(null);
  };

  return (
    <AppShell>
      <div className="px-6 lg:px-10 py-8 max-w-6xl mx-auto">
        <ModuleHeader
          eyebrow="Documento interno · Acerto comercial"
          title="Acerto e Desconto"
          description="Registro formal de devolução, avaria, desconto negociado e valor a receber."
          actions={<ExportBar
            targetRef={reportRef}
            baseName={`acerto_${cliente || "cliente"}_${data}`}
            sheets={() => [{
              name: "Acerto",
              colWidths: [4, 10, 26, 8, 10, 12, 12, 10, 12, 12],
              rows: [
                ["#", "Pedido", "Produto", "Devol.", "Qtd orig.", "Preço unit.", "Total orig.", "Qtd desc.", "Desconto", "A receber"],
                ...itens.map((it, i) => {
                  const totOrig = it.qtdOriginal * it.precoUnit;
                  const totDesc = it.qtdDesconto * it.precoUnit;
                  return [i + 1, it.pedido, it.produto, it.devolucao ? "Sim" : "Não",
                    it.qtdOriginal, it.precoUnit, totOrig, it.qtdDesconto, totDesc, totOrig - totDesc];
                }),
                [],
                ["", "", "", "", "", "TOTAIS", totais.orig, "", totais.desc, totais.final],
                [],
                ["Cliente", cliente], ["Praça", praca], ["Data", data],
                ["Vendedor", vendedor?.nome ?? ""], ["Motivo", motivo],
              ],
            }]}
          />}
        />

        {/* Cabeçalho editável */}
        <div className="module-surface p-4 mb-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <LockField label="Cliente" value={cliente} setValue={setCliente} locked={cLock} setLocked={setCLock} placeholder="Nome do cliente" />
          <LockField label="Praça / Unidade" value={praca} setValue={setPraca} locked={pLock} setLocked={setPLock} placeholder="Recife" />
          <div>
            <label className="field-label">Data</label>
            <div className="flex gap-1">
              <input type="date" className="input-base" value={data} disabled={dLock} onChange={(e) => setData(e.target.value)} />
              <button className="btn btn-outline" onClick={() => setDLock(!dLock)}>{dLock ? <Pencil className="h-4 w-4" /> : <Check className="h-4 w-4" />}</button>
            </div>
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
            <div className="md:col-span-2 lg:col-span-4 grid grid-cols-1 md:grid-cols-4 gap-2 p-3 rounded-md border border-dashed border-primary/50">
              <input className="input-base" placeholder="Nome" value={novoVend.nome} onChange={(e) => setNovoVend({ ...novoVend, nome: e.target.value })} />
              <input className="input-base" placeholder="Função" value={novoVend.funcao} onChange={(e) => setNovoVend({ ...novoVend, funcao: e.target.value })} />
              <input className="input-base" placeholder="WhatsApp" value={novoVend.whatsapp} onChange={(e) => setNovoVend({ ...novoVend, whatsapp: e.target.value })} />
              <div className="flex gap-1">
                <button className="btn btn-primary flex-1" onClick={salvarNovoVend}>Salvar vendedor</button>
                <button className="btn btn-ghost" onClick={() => setNovoVend(null)}><X className="h-4 w-4" /></button>
              </div>
            </div>
          )}

          <div className="md:col-span-2 lg:col-span-4">
            <label className="field-label">Motivo do desconto</label>
            <div className="flex gap-1">
              <textarea
                className="input-base" rows={2}
                placeholder="Avaria, devolução, acordo comercial, diferença de qualidade..."
                value={motivo} disabled={mLock}
                onChange={(e) => setMotivo(e.target.value)}
              />
              {mLock
                ? <button className="btn btn-outline" onClick={() => setMLock(false)}><Pencil className="h-4 w-4" /></button>
                : <button className="btn btn-primary" onClick={() => motivo && setMLock(true)}><Lock className="h-4 w-4" />Aplicar</button>}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <button className="btn btn-primary" onClick={addLinha}><Plus className="h-4 w-4" />Inserir linha</button>
          <button className="btn btn-outline" onClick={limparLinhas}>Limpar linhas</button>
        </div>

        {/* Documento */}
        <div ref={reportRef} className="module-surface p-6 bg-background">
          <div className="flex justify-between items-start border-b border-border pb-4 mb-4">
            <div>
              <div className="text-[0.68rem] uppercase tracking-wider text-primary font-semibold">Igarashi HF · {praca}</div>
              <h2 className="text-xl font-bold mt-1">Documento de Acerto e Desconto</h2>
              <div className="text-sm text-muted-foreground mt-1">Cliente: <b className="text-foreground">{cliente || "—"}</b></div>
            </div>
            <div className="text-right text-xs">
              <div className="text-muted-foreground">Data</div>
              <div className="font-semibold text-sm">{format(new Date(data + "T00:00"), "dd/MM/yyyy")}</div>
              {vendedor && <div className="text-muted-foreground mt-1">Vendedor: <b className="text-foreground">{vendedor.nome}</b></div>}
            </div>
          </div>

          {motivo && (
            <div className="mb-4 p-3 rounded-md bg-surface border-l-2 border-gold">
              <div className="text-xs uppercase tracking-wider text-gold font-semibold mb-1">Motivo</div>
              <div className="text-sm">{motivo}</div>
            </div>
          )}

          <div className="table-scroll">
            <table className="table-clean">
              <thead>
                <tr>
                  <th>#</th><th>Pedido</th><th>Produto</th><th className="text-center">Devolução</th>
                  <th className="text-right">Qtd orig.</th>
                  <th className="text-right">Preço unit.</th>
                  <th className="text-right">Total orig.</th>
                  <th className="text-right">Qtd desc.</th>
                  <th className="text-right">Desconto</th>
                  <th className="text-right">A receber</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {itens.map((it, i) => {
                  const totOrig = it.qtdOriginal * it.precoUnit;
                  const totDesc = it.qtdDesconto * it.precoUnit;
                  const receber = totOrig - totDesc;
                  return (
                    <tr key={it.id}>
                      <td>{i + 1}</td>
                      <td><input className="input-base py-1 w-24" value={it.pedido} onChange={(e) => upd(it.id, { pedido: e.target.value })} /></td>
                      <td><input className="input-base py-1 min-w-[10rem]" value={it.produto} onChange={(e) => upd(it.id, { produto: e.target.value })} /></td>
                      <td className="text-center">
                        <select className="input-base py-1" value={it.devolucao ? "S" : "N"} onChange={(e) => upd(it.id, { devolucao: e.target.value === "S" })}>
                          <option value="N">Não</option><option value="S">Sim</option>
                        </select>
                      </td>
                      <td><input type="number" className="input-base py-1 text-right w-20" value={it.qtdOriginal || ""} onChange={(e) => upd(it.id, { qtdOriginal: Number(e.target.value) })} /></td>
                      <td><input type="number" step="0.01" className="input-base py-1 text-right w-24" value={it.precoUnit || ""} onChange={(e) => upd(it.id, { precoUnit: Number(e.target.value) })} /></td>
                      <td className="text-right font-semibold">{fmtBRL(totOrig)}</td>
                      <td><input type="number" className="input-base py-1 text-right w-20" value={it.qtdDesconto || ""} onChange={(e) => upd(it.id, { qtdDesconto: Number(e.target.value) })} /></td>
                      <td className="text-right text-destructive font-semibold">−{fmtBRL(totDesc)}</td>
                      <td className="text-right font-semibold text-primary">{fmtBRL(receber)}</td>
                      <td><button className="btn btn-ghost" onClick={() => rmLinha(it.id)}><Trash2 className="h-4 w-4" /></button></td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="bg-surface">
                  <td colSpan={6} className="text-right font-semibold text-xs uppercase tracking-wider text-muted-foreground">Totais</td>
                  <td className="text-right font-bold">{fmtBRL(totais.orig)}</td>
                  <td />
                  <td className="text-right font-bold text-destructive">−{fmtBRL(totais.desc)}</td>
                  <td className="text-right font-bold text-primary text-base">{fmtBRL(totais.final)}</td>
                  <td />
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Assinaturas */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            {["Vendedor", "Gerente Comercial", "Gerente Administrativo"].map((r) => (
              <div key={r} className="text-center">
                <div className="border-t border-border-strong pt-2 text-xs text-muted-foreground uppercase tracking-wider">{r}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function LockField({ label, value, setValue, locked, setLocked, placeholder }: {
  label: string; value: string; setValue: (v: string) => void; locked: boolean; setLocked: (b: boolean) => void; placeholder: string;
}) {
  return (
    <div>
      <label className="field-label">{label}</label>
      <div className="flex gap-1">
        <input className="input-base" placeholder={placeholder} value={value} disabled={locked} onChange={(e) => setValue(e.target.value)} />
        {locked ? (
          <>
            <button className="btn btn-outline" onClick={() => setLocked(false)}><Pencil className="h-4 w-4" /></button>
            <button className="btn btn-danger" onClick={() => { setValue(""); setLocked(false); }}><X className="h-4 w-4" /></button>
          </>
        ) : (
          <button className="btn btn-primary" onClick={() => value && setLocked(true)}><Lock className="h-4 w-4" /></button>
        )}
      </div>
    </div>
  );
}
