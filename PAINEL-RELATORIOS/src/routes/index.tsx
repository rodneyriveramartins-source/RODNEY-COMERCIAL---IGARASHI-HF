import { createFileRoute, Link } from "@tanstack/react-router";
import {
  BarChart3,
  Users,
  Tag,
  FileMinus,
  Truck,
  Calculator,
  Boxes,
  ArrowRight,
  Activity,
  ExternalLink,
} from "lucide-react";
import { AppShell, LogoChip } from "@/components/AppShell";
import { PAINEL_CENTRAL_URL } from "@/lib/config";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Igarashi HF Recife — Sistema Comercial" },
      {
        name: "description",
        content: "Sistema integrado: painéis, cotações, calculadora, estoque e acertos.",
      },
    ],
  }),
  component: Home,
});

const MODULES = [
  {
    to: "/painel-executivo",
    icon: BarChart3,
    title: "Painel Executivo",
    desc: "Acumulado do mês, venda do dia, ranking de clientes, mix e evolução diária.",
    tag: "Relatório",
  },
  {
    to: "/painel-vendedores",
    icon: Users,
    title: "Painel de Vendedores",
    desc: "Comparativo de desempenho entre vendedores, canais e carteira.",
    tag: "Relatório",
  },
  {
    to: "/tabela-precos",
    icon: Tag,
    title: "Tabela de Preços",
    desc: "Cotação diária personalizada por cliente com vendedor responsável.",
    tag: "Documento",
  },
  {
    to: "/acerto-desconto",
    icon: FileMinus,
    title: "Acerto e Desconto",
    desc: "Registro formal de devoluções, avarias e descontos negociados.",
    tag: "Documento interno",
  },
  {
    to: "/cadastro-prestador",
    icon: Truck,
    title: "Cadastro de Prestador",
    desc: "Motorista, veículo, frete e envio padronizado via WhatsApp.",
    tag: "Formulário",
  },
  {
    to: "/calculadora-preco",
    icon: Calculator,
    title: "Calculadora de Preço",
    desc: "Formação de preço, cotação e conferência esperado × realizado.",
    tag: "Pricing",
  },
  {
    to: "/estoque-precos",
    icon: Boxes,
    title: "Estoque e Preços",
    desc: "Consolidado por categoria, valor a preço de venda e pendências.",
    tag: "Operacional",
  },
] as const;

function Home() {
  return (
    <AppShell>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-8 sm:py-10">
        <div className="flex items-center gap-4 sm:gap-5 mb-8 sm:mb-10">
          <LogoChip size="lg" />
          <div className="min-w-0">
            <div className="brand-signature">Sistema Comercial</div>
            <h1 className="module-title mt-1">Igarashi HF Recife</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Alimentando a família brasileira · Sete documentos, um único fluxo.
            </p>
          </div>
        </div>

        {PAINEL_CENTRAL_URL ? (
          <a
            href={PAINEL_CENTRAL_URL}
            target="_blank"
            rel="noreferrer"
            className="module-surface p-5 mb-6 flex items-center gap-4 border-gold/60 hover:border-gold transition-colors"
            style={{ borderWidth: 2 }}
          >
            <div className="h-12 w-12 rounded-xl bg-gold/15 border border-gold/50 flex items-center justify-center text-gold shrink-0">
              <Activity className="h-6 w-6" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[0.68rem] uppercase tracking-widest text-gold font-bold">
                Painel Central
              </div>
              <div className="text-lg font-bold">AO VIVO</div>
              <div className="text-xs text-muted-foreground">
                Abrir o dashboard central em nova aba.
              </div>
            </div>
            <ExternalLink className="h-5 w-5 text-gold shrink-0" />
          </a>
        ) : (
          <div
            className="module-surface p-5 mb-6 flex items-center gap-4 border-gold/40"
            style={{ borderWidth: 2 }}
          >
            <div className="h-12 w-12 rounded-xl bg-gold/10 border border-gold/40 flex items-center justify-center text-gold shrink-0">
              <Activity className="h-6 w-6" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[0.68rem] uppercase tracking-widest text-gold font-bold">
                Painel Central AO VIVO
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Configure <code className="text-gold">PAINEL_CENTRAL_URL</code> em{" "}
                <code>src/lib/config.ts</code>.
              </div>
            </div>
            <span className="chip chip-gold">configurar</span>
          </div>
        )}

        <div className="module-surface p-6 mb-8 bg-gradient-to-br from-primary-soft/60 to-transparent">
          <div className="section-title mb-2">Fluxo integrado</div>
          <p className="text-lg leading-relaxed">
            Cadastro → Compra → Formação de preço → Cotação → Venda → Estoque → Acerto → Análise →
            Relatório executivo.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Cada documento pode ser usado, preenchido, impresso e exportado individualmente.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {MODULES.map((m) => {
            const Icon = m.icon;
            return (
              <Link
                key={m.to}
                to={m.to}
                className="module-surface p-5 hover:border-primary/50 transition-colors group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="h-10 w-10 rounded-xl bg-primary-soft flex items-center justify-center text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="chip">{m.tag}</span>
                </div>
                <h3 className="font-semibold text-base mb-1">{m.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{m.desc}</p>
                <div className="mt-4 text-xs text-primary font-semibold flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  Abrir <ArrowRight className="h-3 w-3" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
