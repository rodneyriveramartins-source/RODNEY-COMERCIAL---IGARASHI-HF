import { Link, useRouterState } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import {
  LayoutDashboard,
  BarChart3,
  Users,
  Tag,
  FileMinus,
  Truck,
  Calculator,
  Boxes,
  Menu,
  X,
  Activity,
  ExternalLink,
} from "lucide-react";
import logo from "@/assets/igarashi-logo.asset.json";
import { PAINEL_CENTRAL_URL } from "@/lib/config";

const NAV = [
  { to: "/", label: "Início", icon: LayoutDashboard },
  { to: "/painel-executivo", label: "Painel Executivo", icon: BarChart3 },
  { to: "/painel-vendedores", label: "Painel de Vendedores", icon: Users },
  { to: "/tabela-precos", label: "Tabela de Preços", icon: Tag },
  { to: "/acerto-desconto", label: "Acerto e Desconto", icon: FileMinus },
  { to: "/cadastro-prestador", label: "Cadastro de Prestador", icon: Truck },
  { to: "/calculadora-preco", label: "Calculadora de Preço", icon: Calculator },
  { to: "/estoque-precos", label: "Estoque e Preços", icon: Boxes },
] as const;

export function LogoChip({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const h = size === "sm" ? "h-7" : size === "lg" ? "h-12" : "h-9";
  return (
    <span className="logo-chip shrink-0">
      <img src={logo.url} alt="Igarashi HF" className={`${h} w-auto object-contain`} />
    </span>
  );
}

function PainelCentralItem({ onClick }: { onClick?: () => void }) {
  const configured = !!PAINEL_CENTRAL_URL;
  const base =
    "flex items-center gap-3 px-3 py-2 rounded-[10px] text-sm font-semibold transition-colors border";
  const cls = configured
    ? `${base} border-gold/60 text-gold hover:bg-gold/10`
    : `${base} border-gold/30 text-gold/70 cursor-not-allowed`;
  if (!configured) {
    return (
      <div className={cls} title="Configure PAINEL_CENTRAL_URL em src/lib/config.ts">
        <Activity className="h-4 w-4 shrink-0" />
        <span className="flex-1">Painel Central AO VIVO</span>
        <span className="chip chip-gold text-[0.6rem]">configurar</span>
      </div>
    );
  }
  return (
    <a href={PAINEL_CENTRAL_URL} target="_blank" rel="noreferrer" onClick={onClick} className={cls}>
      <Activity className="h-4 w-4 shrink-0" />
      <span className="flex-1">Painel Central AO VIVO</span>
      <ExternalLink className="h-3.5 w-3.5 opacity-70" />
    </a>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const currentLabel = NAV.find((n) => n.to === pathname)?.label ?? "";

  return (
    <div className="min-h-screen flex bg-transparent text-foreground">
      <aside
        className={`${open ? "translate-x-0" : "-translate-x-full"} fixed inset-y-0 left-0 z-40 w-64 border-r border-border bg-surface transform transition-transform lg:translate-x-0 lg:static lg:z-auto flex flex-col`}
      >
        <div className="flex items-center gap-3 px-5 py-5 border-b border-border">
          <LogoChip />
          <div className="leading-tight min-w-0">
            <div className="text-[0.66rem] uppercase tracking-[0.14em] text-muted-foreground font-semibold">
              Igarashi HF
            </div>
            <div className="text-sm font-bold truncate">Recife</div>
          </div>
        </div>
        <nav className="p-3 space-y-1 flex-1 overflow-y-auto">
          <PainelCentralItem onClick={() => setOpen(false)} />
          <div className="h-px bg-border my-2" />
          {NAV.map((item) => {
            const active = pathname === item.to;
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded-[10px] text-sm font-medium transition-colors ${
                  active
                    ? "bg-primary-soft text-foreground border border-primary/40"
                    : "text-muted-foreground hover:text-foreground hover:bg-surface-2"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="px-5 py-4 border-t border-border text-[0.66rem] uppercase tracking-[0.12em] text-muted-foreground">
          Agricultura · Tecnologia · Precisão
        </div>
      </aside>

      {open && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setOpen(false)} />
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="lg:hidden grid grid-cols-[auto_1fr_auto] items-center gap-3 px-3 py-2 border-b border-border bg-surface">
          <button className="btn btn-ghost" aria-label="Abrir menu" onClick={() => setOpen(true)}>
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <div className="flex items-center gap-2 min-w-0">
            <LogoChip size="sm" />
            <span className="text-sm font-semibold truncate">{currentLabel || "Igarashi HF"}</span>
          </div>
          <div className="w-8" />
        </header>
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}

export function ModuleHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="module-header">
      <div className="min-w-0">
        {eyebrow && <div className="brand-signature mb-2">{eyebrow}</div>}
        <h1 className="module-title">{title}</h1>
        {description && <p className="module-description">{description}</p>}
      </div>
      {actions && <div className="module-actions">{actions}</div>}
    </div>
  );
}

/** Cabeçalho de marca dentro do relatório — entra no PDF/JPG/print. */
export function ReportBrandHead({
  title,
  subtitle,
  meta,
}: {
  title: string;
  subtitle?: string;
  meta?: ReactNode;
}) {
  return (
    <div className="module-surface p-5 report-brand">
      <div className="report-brand-id">
        <LogoChip size="lg" />
        <div className="min-w-0">
          <div className="brand-signature">Igarashi HF · Recife · CEASA Galpão 2.6</div>
          <div className="text-lg sm:text-xl font-bold mt-1 leading-tight">{title}</div>
          {subtitle && <div className="text-xs text-muted-foreground mt-1">{subtitle}</div>}
        </div>
      </div>
      {meta && <div className="report-brand-meta text-xs text-muted-foreground">{meta}</div>}
    </div>
  );
}
