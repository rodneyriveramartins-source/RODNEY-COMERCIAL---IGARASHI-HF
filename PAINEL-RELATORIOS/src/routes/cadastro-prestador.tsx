import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { AppShell, ModuleHeader } from "@/components/AppShell";
import { ExportBar } from "@/components/ExportBar";
import { Copy, MessageCircle, ShieldCheck } from "lucide-react";
import { fmtBRL } from "@/lib/storage";

export const Route = createFileRoute("/cadastro-prestador")({
  head: () => ({
    meta: [
      { title: "Cadastro de Prestador — Igarashi HF" },
      { name: "description", content: "Cadastro padronizado de motorista, veículo, frete e pagamento com envio via WhatsApp." },
    ],
  }),
  component: CadastroPrestador,
});

type Form = {
  // motorista
  nome: string; cpf: string; whatsapp: string; cnh: string; cidade: string; estado: string;
  // veiculo
  placaCavalo: string; placaCarreta: string; rntrc: string; transportadora: string; autonomo: boolean;
  // frete
  valorFrete: number; freteTipo: "total" | "saco"; peso: number; pix: string; banco: string; titular: string;
};

const INIT: Form = {
  nome: "", cpf: "", whatsapp: "", cnh: "", cidade: "", estado: "",
  placaCavalo: "", placaCarreta: "", rntrc: "", transportadora: "", autonomo: true,
  valorFrete: 0, freteTipo: "total", peso: 0, pix: "", banco: "", titular: "",
};

const WPP_DESTINO = "5581999999999";

function CadastroPrestador() {
  const reportRef = useRef<HTMLDivElement>(null);
  const [f, setF] = useState<Form>(INIT);
  const upd = (p: Partial<Form>) => setF((prev) => ({ ...prev, ...p }));

  const camposFaltando = () => {
    const missing: string[] = [];
    if (!f.nome) missing.push("Nome");
    if (!f.cpf) missing.push("CPF");
    if (!f.whatsapp) missing.push("WhatsApp");
    if (!f.cnh) missing.push("CNH");
    if (!f.placaCavalo) missing.push("Placa do cavalo");
    return missing;
  };

  const montarMensagem = () => {
    return `*Cadastro de Prestador · Igarashi HF*
━━━━━━━━━━━━━━━━━
👤 *Motorista*
Nome: ${f.nome}
CPF: ${f.cpf}
WhatsApp: ${f.whatsapp}
CNH: ${f.cnh}
Cidade/UF: ${f.cidade}${f.estado ? "/" + f.estado : ""}

🚛 *Veículo*
Cavalo: ${f.placaCavalo}
Carreta: ${f.placaCarreta || "—"}
RNTRC/ANTT: ${f.rntrc || "—"}
${f.autonomo ? "Transportador autônomo" : "Transportadora: " + f.transportadora}

💰 *Frete e Pagamento*
Valor: ${fmtBRL(f.valorFrete)} (${f.freteTipo === "saco" ? "por saco" : "total"})
Peso: ${f.peso} kg
PIX: ${f.pix}
Banco: ${f.banco}${f.titular ? " · Titular: " + f.titular : ""}

📎 Enviar em seguida: foto da CNH, documento do caminhão${f.placaCarreta ? " e da carreta" : ""}.`;
  };

  const enviarWpp = () => {
    const faltando = camposFaltando();
    if (faltando.length) {
      alert("Preencha os obrigatórios: " + faltando.join(", "));
      return;
    }
    const msg = encodeURIComponent(montarMensagem());
    window.open(`https://wa.me/${WPP_DESTINO}?text=${msg}`, "_blank");
  };

  const copiar = async () => {
    await navigator.clipboard.writeText(montarMensagem());
    alert("Mensagem copiada para a área de transferência.");
  };

  return (
    <AppShell>
      <div className="px-6 lg:px-10 py-8 max-w-5xl mx-auto">
        <ModuleHeader
          eyebrow="Formulário operacional"
          title="Cadastro de Prestador de Serviço"
          description="Motorista, veículo, frete e pagamento. Envio padronizado via WhatsApp."
          actions={
            <ExportBar
              targetRef={reportRef}
              baseName={`prestador_${f.nome || "motorista"}`}
              extra={
                <>
                  <button className="btn btn-outline" onClick={copiar}><Copy className="h-4 w-4" />Copiar texto</button>
                  <button className="btn btn-gold" onClick={enviarWpp}><MessageCircle className="h-4 w-4" />Enviar pelo WhatsApp</button>
                </>
              }
            />
          }
        />

        <div ref={reportRef} className="space-y-4 bg-background p-6 rounded-lg">
          <div className="module-surface p-5">
            <div className="text-xs uppercase tracking-wider text-primary font-semibold mb-4">Motorista</div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Field label="Nome completo *" value={f.nome} onChange={(v) => upd({ nome: v })} />
              <Field label="CPF *" value={f.cpf} onChange={(v) => upd({ cpf: v })} placeholder="000.000.000-00" />
              <Field label="WhatsApp *" value={f.whatsapp} onChange={(v) => upd({ whatsapp: v })} placeholder="(00) 00000-0000" />
              <Field label="CNH *" value={f.cnh} onChange={(v) => upd({ cnh: v })} />
              <Field label="Cidade" value={f.cidade} onChange={(v) => upd({ cidade: v })} />
              <Field label="UF" value={f.estado} onChange={(v) => upd({ estado: v })} placeholder="PE" />
            </div>
          </div>

          <div className="module-surface p-5">
            <div className="text-xs uppercase tracking-wider text-primary font-semibold mb-4">Veículo e transporte</div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Field label="Placa do cavalo *" value={f.placaCavalo} onChange={(v) => upd({ placaCavalo: v.toUpperCase() })} />
              <Field label="Placa da carreta" value={f.placaCarreta} onChange={(v) => upd({ placaCarreta: v.toUpperCase() })} />
              <Field label="RNTRC / ANTT" value={f.rntrc} onChange={(v) => upd({ rntrc: v })} />
              <div className="md:col-span-2">
                <label className="field-label">Transportadora</label>
                <input className="input-base" value={f.transportadora} disabled={f.autonomo} onChange={(e) => upd({ transportadora: e.target.value })} />
              </div>
              <div>
                <label className="field-label">Tipo</label>
                <label className="flex items-center gap-2 mt-2 text-sm">
                  <input type="checkbox" checked={f.autonomo} onChange={(e) => upd({ autonomo: e.target.checked })} className="accent-primary" />
                  Transportador autônomo
                </label>
              </div>
            </div>
          </div>

          <div className="module-surface p-5">
            <div className="text-xs uppercase tracking-wider text-primary font-semibold mb-4">Frete e pagamento</div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="field-label">Valor do frete</label>
                <input type="number" step="0.01" className="input-base" value={f.valorFrete || ""} onChange={(e) => upd({ valorFrete: Number(e.target.value) })} />
              </div>
              <div>
                <label className="field-label">Forma</label>
                <select className="input-base" value={f.freteTipo} onChange={(e) => upd({ freteTipo: e.target.value as any })}>
                  <option value="total">Total</option><option value="saco">Por saco</option>
                </select>
              </div>
              <div>
                <label className="field-label">Peso da carga (kg)</label>
                <input type="number" className="input-base" value={f.peso || ""} onChange={(e) => upd({ peso: Number(e.target.value) })} />
              </div>
              <Field label="Chave PIX" value={f.pix} onChange={(v) => upd({ pix: v })} />
              <Field label="Banco" value={f.banco} onChange={(v) => upd({ banco: v })} />
              <Field label="Titular (se diferente)" value={f.titular} onChange={(v) => upd({ titular: v })} />
            </div>
          </div>

          <div className="module-surface p-4 border-gold/40 flex items-start gap-3">
            <ShieldCheck className="h-5 w-5 text-gold shrink-0 mt-0.5" />
            <div className="text-xs text-muted-foreground leading-relaxed">
              Os dados coletados são utilizados exclusivamente para operação de carga, descarga, transporte e pagamento de frete, conforme a LGPD.
              Após o envio, encaminhe também: foto da CNH e documento do caminhão{f.placaCarreta ? " e da carreta" : ""}.
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div>
      <label className="field-label">{label}</label>
      <input className="input-base" placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}
