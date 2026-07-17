import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useRef } from "react";
import { AppShell, ModuleHeader, ReportBrandHead } from "@/components/AppShell";
import { ExportBar } from "@/components/ExportBar";
import { fmtBRL, fmtNum, fmtPct } from "@/lib/storage";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CircleAlert, Trophy, UsersRound } from "lucide-react";

export const Route = createFileRoute("/painel-vendedores")({
  head: () => ({
    meta: [
      { title: "Painel de Vendedores — Igarashi HF" },
      {
        name: "description",
        content:
          "Comparativo de desempenho comercial por vendedor: faturamento, clientes, ticket, mix e evolução.",
      },
    ],
  }),
  component: PainelVendedores,
});

type Vend = {
  nome: string;
  funcao: string;
  faturamento: number;
  clientes: number;
  pedidos: number;
  volumeBatata: number;
  unidade: string;
  precoMedio: number;
  concentracaoTop10: number;
  maiorCliente: { nome: string; pct: number };
  clientesRecorrentes: number;
  clientesRanking: {
    pos: number;
    nome: string;
    qtd: number;
    dias: number;
    pctVol: number;
    fat: number;
    pctFat: number;
  }[];
  semanas: number[];
  faturamentoDiaSemana: number[]; // seg-sab
};

const VENDEDORES: [Vend, Vend] = [
  {
    nome: "Carlos Menezes",
    funcao: "Balcão",
    faturamento: 1_284_500,
    clientes: 62,
    pedidos: 218,
    volumeBatata: 4820,
    unidade: "sc",
    precoMedio: 62.5,
    concentracaoTop10: 0.68,
    maiorCliente: { nome: "Rede Supermarket Nordeste", pct: 0.18 },
    clientesRecorrentes: 41,
    clientesRanking: [
      {
        pos: 1,
        nome: "Rede Supermarket Nordeste",
        qtd: 780,
        dias: 18,
        pctVol: 0.16,
        fat: 231_210,
        pctFat: 0.18,
      },
      {
        pos: 2,
        nome: "Atacadão Recife Zona Sul",
        qtd: 620,
        dias: 15,
        pctVol: 0.13,
        fat: 168_500,
        pctFat: 0.13,
      },
      {
        pos: 3,
        nome: "Hortifruti Boa Vista",
        qtd: 415,
        dias: 12,
        pctVol: 0.086,
        fat: 112_800,
        pctFat: 0.088,
      },
      {
        pos: 4,
        nome: "Distribuidor Central PE",
        qtd: 380,
        dias: 11,
        pctVol: 0.079,
        fat: 98_400,
        pctFat: 0.077,
      },
      {
        pos: 5,
        nome: "Mercadinho São José",
        qtd: 290,
        dias: 9,
        pctVol: 0.06,
        fat: 82_100,
        pctFat: 0.064,
      },
    ],
    semanas: [1020, 1150, 980, 1180, 1240, 1130, 1290, 1180],
    faturamentoDiaSemana: [212_000, 254_000, 228_000, 268_000, 235_000, 87_500],
  },
  {
    nome: "Ana Beatriz",
    funcao: "Varejo externo",
    faturamento: 942_800,
    clientes: 38,
    pedidos: 156,
    volumeBatata: 3120,
    unidade: "sc",
    precoMedio: 68.9,
    concentracaoTop10: 0.81,
    maiorCliente: { nome: "Feira Central Distribuição", pct: 0.24 },
    clientesRecorrentes: 24,
    clientesRanking: [
      {
        pos: 1,
        nome: "Feira Central Distribuição",
        qtd: 890,
        dias: 16,
        pctVol: 0.28,
        fat: 226_270,
        pctFat: 0.24,
      },
      {
        pos: 2,
        nome: "Mercado Verde Olinda",
        qtd: 520,
        dias: 13,
        pctVol: 0.166,
        fat: 148_400,
        pctFat: 0.157,
      },
      {
        pos: 3,
        nome: "Empório Boa Terra",
        qtd: 385,
        dias: 11,
        pctVol: 0.123,
        fat: 106_800,
        pctFat: 0.113,
      },
      {
        pos: 4,
        nome: "Rede Bom Preço PE",
        qtd: 340,
        dias: 10,
        pctVol: 0.109,
        fat: 92_100,
        pctFat: 0.098,
      },
      {
        pos: 5,
        nome: "Sacolão da Praça",
        qtd: 260,
        dias: 8,
        pctVol: 0.083,
        fat: 71_500,
        pctFat: 0.076,
      },
    ],
    semanas: [820, 940, 850, 1060, 990, 1180, 1220, 1120],
    faturamentoDiaSemana: [158_000, 182_000, 165_000, 194_000, 178_000, 65_800],
  },
];

const DIAS = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

function PainelVendedores() {
  const reportRef = useRef<HTMLDivElement>(null);

  const totalFat = VENDEDORES[0].faturamento + VENDEDORES[1].faturamento;
  const totalPedidos = VENDEDORES[0].pedidos + VENDEDORES[1].pedidos;
  const totalBatata = VENDEDORES[0].volumeBatata + VENDEDORES[1].volumeBatata;
  const maxSemana = useMemo(() => Math.max(...VENDEDORES[0].semanas, ...VENDEDORES[1].semanas), []);
  const semanas = VENDEDORES[0].semanas.length;

  return (
    <AppShell>
      <div className="report-page max-w-[1480px] mx-auto">
        <ModuleHeader
          eyebrow="Relatório de desempenho comercial"
          title="Painel de Vendedores"
          description="Desempenho comercial com disciplina, precisão e leitura objetiva da operação."
          actions={
            <ExportBar
              targetRef={reportRef}
              baseName="painel_vendedores"
              sheets={() => [
                {
                  name: "Comparativo",
                  colWidths: [20, 20, 20],
                  rows: [
                    ["Indicador", VENDEDORES[0].nome, VENDEDORES[1].nome],
                    ["Faturamento", VENDEDORES[0].faturamento, VENDEDORES[1].faturamento],
                    ["Clientes ativos", VENDEDORES[0].clientes, VENDEDORES[1].clientes],
                    ["Pedidos", VENDEDORES[0].pedidos, VENDEDORES[1].pedidos],
                    [
                      "Ticket médio",
                      VENDEDORES[0].faturamento / VENDEDORES[0].pedidos,
                      VENDEDORES[1].faturamento / VENDEDORES[1].pedidos,
                    ],
                    ["Volume batata (sc)", VENDEDORES[0].volumeBatata, VENDEDORES[1].volumeBatata],
                    ["Preço médio", VENDEDORES[0].precoMedio, VENDEDORES[1].precoMedio],
                    [
                      "Top 10 (%)",
                      VENDEDORES[0].concentracaoTop10,
                      VENDEDORES[1].concentracaoTop10,
                    ],
                    [
                      "Recorrentes",
                      VENDEDORES[0].clientesRecorrentes,
                      VENDEDORES[1].clientesRecorrentes,
                    ],
                  ],
                },
                ...VENDEDORES.map((v) => ({
                  name: `Top 5 ${v.nome.split(" ")[0]}`,
                  colWidths: [4, 30, 10, 8, 10, 14, 10],
                  rows: [
                    ["#", "Cliente", "Qtd", "Dias", "% Vol", "Faturamento", "% Fat"],
                    ...v.clientesRanking.map((c) => [
                      c.pos,
                      c.nome,
                      c.qtd,
                      c.dias,
                      c.pctVol,
                      c.fat,
                      c.pctFat,
                    ]),
                  ],
                })),
                {
                  name: "Semanas",
                  colWidths: [12, 18, 18],
                  rows: [
                    ["Semana", VENDEDORES[0].nome, VENDEDORES[1].nome],
                    ...VENDEDORES[0].semanas.map((s, i) => [
                      `Semana ${i + 1}`,
                      s,
                      VENDEDORES[1].semanas[i],
                    ]),
                  ],
                },
              ]}
            />
          }
        />
        <div ref={reportRef} className="report-content space-y-6">
          {/* Header do relatório — marca entra no PDF/JPG */}
          <ReportBrandHead
            title={`Comparativo Comercial · ${semanas} semanas`}
            subtitle={`Atualizado em ${format(new Date(), "dd/MM/yyyy HH:mm", { locale: ptBR })} · Fonte: Sistema de vendas`}
            meta={
              <p className="max-w-xs">
                <b className="text-warning">Aviso:</b> sem dados de custos, a análise representa
                receita e volume, não rentabilidade.
              </p>
            }
          />

          <div className="decision-strip">
            <div className="decision-primary">
              <div className="decision-icon">
                <Trophy className="h-5 w-5" />
              </div>
              <div>
                <div className="decision-kicker">Liderança comercial</div>
                <div className="decision-title">{VENDEDORES[0].nome} lidera o faturamento</div>
                <div className="decision-copy">
                  <strong>{fmtBRL(VENDEDORES[0].faturamento)}</strong> ·{" "}
                  {fmtPct(VENDEDORES[0].faturamento / totalFat)} do resultado analisado
                </div>
              </div>
            </div>
            <div className="decision-stat">
              <UsersRound className="h-4 w-4" />
              <div>
                <span>Maior recorrência</span>
                <strong>
                  {VENDEDORES[0].nome.split(" ")[0]} ·{" "}
                  {fmtPct(VENDEDORES[0].clientesRecorrentes / VENDEDORES[0].clientes)}
                </strong>
              </div>
            </div>
            <div className="decision-action warning">
              <CircleAlert className="h-4 w-4" />
              <div>
                <span>Atenção gerencial</span>
                <strong>Concentração de {fmtPct(VENDEDORES[1].concentracaoTop10)}</strong>
              </div>
            </div>
          </div>

          {/* KPIs combinados */}
          <div className="kpi-grid">
            <Kpi label="Faturamento total" value={fmtBRL(totalFat)} accent featured />
            <Kpi label="Pedidos totais" value={fmtNum(totalPedidos)} />
            <Kpi label="Volume batata" value={`${fmtNum(totalBatata)} sc`} />
            <Kpi
              label="Clientes únicos"
              value={fmtNum(VENDEDORES[0].clientes + VENDEDORES[1].clientes)}
            />
          </div>

          {/* Comparativo por vendedor */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {VENDEDORES.map((v) => (
              <div key={v.nome} className="module-surface p-5">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wider">
                      {v.funcao}
                    </div>
                    <div className="text-lg font-bold">{v.nome}</div>
                  </div>
                  <span className="chip chip-primary">
                    {fmtPct(v.faturamento / totalFat)} do total
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <Metric label="Faturamento" value={fmtBRL(v.faturamento)} />
                  <Metric label="Clientes ativos" value={fmtNum(v.clientes)} />
                  <Metric label="Pedidos" value={fmtNum(v.pedidos)} />
                  <Metric label="Ticket médio" value={fmtBRL(v.faturamento / v.pedidos)} />
                  <Metric label="Volume batata" value={`${fmtNum(v.volumeBatata)} ${v.unidade}`} />
                  <Metric label="Preço médio" value={fmtBRL(v.precoMedio) + ` / ${v.unidade}`} />
                  <Metric label="Top 10 clientes" value={fmtPct(v.concentracaoTop10)} />
                  <Metric label="Recorrentes" value={`${v.clientesRecorrentes} / ${v.clientes}`} />
                </div>
                <div className="mt-3 pt-3 border-t border-border text-xs text-muted-foreground">
                  Maior cliente: <b className="text-foreground">{v.maiorCliente.nome}</b> ·{" "}
                  {fmtPct(v.maiorCliente.pct)}
                </div>
              </div>
            ))}
          </div>

          {/* Rankings */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {VENDEDORES.map((v) => (
              <div key={v.nome} className="module-surface p-5">
                <div className="section-title">Top 5 clientes · {v.nome}</div>
                <div className="table-scroll">
                  <table className="table-clean">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Cliente</th>
                        <th className="text-right">Qtd</th>
                        <th className="text-right">Dias</th>
                        <th className="text-right">% Vol</th>
                        <th className="text-right">Faturamento</th>
                      </tr>
                    </thead>
                    <tbody>
                      {v.clientesRanking.map((c) => (
                        <tr key={c.pos}>
                          <td className="font-bold text-gold">{c.pos}</td>
                          <td className="font-medium">{c.nome}</td>
                          <td className="text-right">{fmtNum(c.qtd)}</td>
                          <td className="text-right">{c.dias}</td>
                          <td className="text-right">{fmtPct(c.pctVol)}</td>
                          <td className="text-right font-semibold">{fmtBRL(c.fat)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>

          {/* Evolução semanal */}
          <div className="module-surface p-5">
            <div className="section-title">Evolução semanal de volume (batata em sacos)</div>
            <div className="space-y-3">
              {Array.from({ length: semanas }).map((_, i) => {
                const s1 = VENDEDORES[0].semanas[i];
                const s2 = VENDEDORES[1].semanas[i];
                return (
                  <div
                    key={i}
                    className="grid grid-cols-[64px_minmax(0,1fr)_56px] sm:grid-cols-[80px_1fr_80px] gap-3 items-center text-xs"
                  >
                    <div className="text-muted-foreground font-medium">Sem {i + 1}</div>
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-14 sm:w-16 text-right text-primary font-semibold shrink-0">
                          {fmtNum(s1)}
                        </div>
                        <div className="flex-1 min-w-0 h-3 bg-surface-2 rounded overflow-hidden">
                          <div
                            className="h-full bg-primary"
                            style={{ width: `${(s1 / maxSemana) * 100}%` }}
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-14 sm:w-16 text-right text-gold font-semibold shrink-0">
                          {fmtNum(s2)}
                        </div>
                        <div className="flex-1 min-w-0 h-3 bg-surface-2 rounded overflow-hidden">
                          <div
                            className="h-full bg-gold"
                            style={{ width: `${(s2 / maxSemana) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                    <div
                      className={`text-right font-semibold ${s1 > s2 ? "text-primary" : "text-gold"}`}
                    >
                      {s1 > s2 ? "+" : "−"}
                      {fmtNum(Math.abs(s1 - s2))}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex gap-4 mt-4 text-xs flex-wrap">
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 bg-primary rounded" />
                {VENDEDORES[0].nome}
              </span>
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 bg-gold rounded" />
                {VENDEDORES[1].nome}
              </span>
            </div>
          </div>

          {/* Dia da semana */}
          <div className="module-surface p-5">
            <div className="section-title">Faturamento por dia da semana</div>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {DIAS.map((d, i) => {
                const v1 = VENDEDORES[0].faturamentoDiaSemana[i];
                const v2 = VENDEDORES[1].faturamentoDiaSemana[i];
                const max = Math.max(
                  ...VENDEDORES[0].faturamentoDiaSemana,
                  ...VENDEDORES[1].faturamentoDiaSemana,
                );
                return (
                  <div key={d} className="min-w-0">
                    <div className="text-center text-xs text-muted-foreground mb-2 font-semibold">
                      {d}
                    </div>
                    <div className="flex items-end gap-1 h-32">
                      <div
                        className="flex-1 bg-primary rounded-t"
                        style={{ height: `${(v1 / max) * 100}%` }}
                      />
                      <div
                        className="flex-1 bg-gold rounded-t"
                        style={{ height: `${(v2 / max) * 100}%` }}
                      />
                    </div>
                    <div className="text-center text-[0.65rem] text-muted-foreground mt-2 truncate">
                      {fmtBRL(v1 + v2)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Diagnóstico */}
          <div className="module-surface p-5 border-l-4 border-gold">
            <div className="section-title">Leitura executiva</div>
            <ul className="space-y-2 text-sm leading-relaxed">
              <li>
                •{" "}
                <b>
                  {VENDEDORES[0].faturamento > VENDEDORES[1].faturamento
                    ? VENDEDORES[0].nome
                    : VENDEDORES[1].nome}
                </b>{" "}
                lidera o faturamento;{" "}
                <b>
                  {VENDEDORES[0].precoMedio > VENDEDORES[1].precoMedio
                    ? VENDEDORES[1].nome
                    : VENDEDORES[0].nome}
                </b>{" "}
                pratica preço médio menor.
              </li>
              <li>
                • Ticket médio: {fmtBRL(VENDEDORES[0].faturamento / VENDEDORES[0].pedidos)} ×{" "}
                {fmtBRL(VENDEDORES[1].faturamento / VENDEDORES[1].pedidos)}.
              </li>
              <li>
                • Concentração top 10 de <b>{VENDEDORES[1].nome}</b> em{" "}
                {fmtPct(VENDEDORES[1].concentracaoTop10)} indica dependência elevada — mitigar.
              </li>
              <li>
                • Recorrência da base:{" "}
                {fmtPct(VENDEDORES[0].clientesRecorrentes / VENDEDORES[0].clientes)} ×{" "}
                {fmtPct(VENDEDORES[1].clientesRecorrentes / VENDEDORES[1].clientes)}.
              </li>
              <li>
                • Próximos passos: expandir carteira do vendedor externo e aumentar frequência do
                balcão nos dias fracos.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function Kpi({
  label,
  value,
  accent,
  featured,
}: {
  label: string;
  value: string;
  accent?: boolean;
  featured?: boolean;
}) {
  return (
    <div className={`kpi-card ${accent ? "accent" : ""} ${featured ? "featured" : ""}`}>
      <div className="kpi-label">{label}</div>
      <div className={`kpi-value mt-1 ${accent ? "text-primary" : ""}`}>{value}</div>
    </div>
  );
}
function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-2 py-1 border-b border-border/50 last:border-0">
      <span className="text-muted-foreground text-xs">{label}</span>
      <span className="font-semibold tabular">{value}</span>
    </div>
  );
}
