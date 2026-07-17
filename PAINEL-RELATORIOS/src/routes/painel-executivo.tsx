import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useRef } from "react";
import { ArrowUpRight, CircleAlert, Target, TrendingUp } from "lucide-react";
import { AppShell, ModuleHeader, ReportBrandHead } from "@/components/AppShell";
import { ExportBar } from "@/components/ExportBar";
import { fmtBRL, fmtNum, fmtPct } from "@/lib/storage";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export const Route = createFileRoute("/painel-executivo")({
  head: () => ({
    meta: [
      { title: "Painel Executivo Acumulado — Igarashi HF" },
      {
        name: "description",
        content: "Acompanhamento do mês e do dia: faturamento, ranking, mix e evolução diária.",
      },
    ],
  }),
  component: PainelExecutivo,
});

// Mock data (source: sistema de vendas / Hortigestão)
const MES_REF = "Novembro/2026";
const DIAS_TRANSCORRIDOS = 18;
const DIAS_COMERCIAIS = 22;
const FATURAMENTO_ACUM = 4820150;
const PEDIDOS_ACUM = 612;
const CLIENTES_ATIVOS = 148;
const META_MES = 5800000;

const CLIENTES_MES = [
  { nome: "Rede Supermarket Nordeste", valor: 720450 },
  { nome: "Atacadão Recife Zona Sul", valor: 512300 },
  { nome: "Distribuidor Central PE", valor: 388900 },
  { nome: "Hortifruti Boa Vista", valor: 275180 },
  { nome: "Mercadinho São José", valor: 214760 },
  { nome: "Outros (143 clientes)", valor: 2708560 },
];

const MIX_MES = [
  { familia: "Batata", valor: 1720000 },
  { familia: "Cebola", valor: 942000 },
  { familia: "Cenoura", valor: 612500 },
  { familia: "Beterraba", valor: 384200 },
  { familia: "Repolho", valor: 298300 },
  { familia: "Alho", valor: 402100 },
  { familia: "Maçã", valor: 251400 },
  { familia: "Demais", valor: 209650 },
];

const FAT_DIA = 268320;
const PEDIDOS_DIA = 34;
const CLIENTES_DIA = 28;

const CLIENTES_DIA_LIST = [
  { nome: "Atacadão Recife Zona Sul", valor: 62400 },
  { nome: "Rede Supermarket Nordeste", valor: 48900 },
  { nome: "Hortifruti Boa Vista", valor: 32100 },
  { nome: "Mercadinho São José", valor: 21500 },
  { nome: "Outros (24 clientes)", valor: 103420 },
];

const MIX_DIA = [
  { familia: "Batata", valor: 98400 },
  { familia: "Cebola", valor: 52300 },
  { familia: "Cenoura", valor: 34200 },
  { familia: "Beterraba", valor: 21400 },
  { familia: "Repolho", valor: 18300 },
  { familia: "Alho", valor: 22600 },
  { familia: "Maçã", valor: 14200 },
  { familia: "Demais", valor: 6920 },
];

// evolução diária
const EVOLUCAO: { dia: number; valor: number }[] = [
  245, 268, 231, 289, 302, 254, 271, 295, 312, 278, 261, 288, 305, 269, 275, 293, 258, 268,
].map((v, i) => ({ dia: i + 1, valor: v * 1000 }));

function PainelExecutivo() {
  const reportRef = useRef<HTMLDivElement>(null);

  const mediaDiaria = FATURAMENTO_ACUM / DIAS_TRANSCORRIDOS;
  const projecao = mediaDiaria * DIAS_COMERCIAIS;
  const ticketMedio = FATURAMENTO_ACUM / PEDIDOS_ACUM;
  const vsMeta = FATURAMENTO_ACUM / META_MES;
  const metaEsperadaHoje = META_MES * (DIAS_TRANSCORRIDOS / DIAS_COMERCIAIS);
  const ritmoVsMeta = (FATURAMENTO_ACUM - metaEsperadaHoje) / metaEsperadaHoje;
  const gapProjetado = projecao - META_MES;
  const diaVsMedia = (FAT_DIA - mediaDiaria) / mediaDiaria;
  const totalMes = useMemo(() => CLIENTES_MES.reduce((s, c) => s + c.valor, 0), []);
  const totalMix = useMemo(() => MIX_MES.reduce((s, c) => s + c.valor, 0), []);
  const totalMixDia = useMemo(() => MIX_DIA.reduce((s, c) => s + c.valor, 0), []);
  const totalClientesDia = useMemo(() => CLIENTES_DIA_LIST.reduce((s, c) => s + c.valor, 0), []);
  const maxEvo = Math.max(...EVOLUCAO.map((e) => e.valor));
  const mediaEvo = EVOLUCAO.reduce((s, e) => s + e.valor, 0) / EVOLUCAO.length;
  const posicaoDia = EVOLUCAO.filter((e) => e.valor <= FAT_DIA).length;

  const dataAtualizacao = format(new Date(), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });

  return (
    <AppShell>
      <div className="report-page max-w-[1480px] mx-auto">
        <ModuleHeader
          eyebrow="Relatório executivo comercial"
          title="Painel Executivo Acumulado"
          description="Precisão comercial para uma operação agrícola de liderança nacional, tecnologia e alta produtividade."
          actions={
            <ExportBar
              targetRef={reportRef}
              baseName={`painel_executivo_${MES_REF.replace("/", "_")}`}
              sheets={() => [
                {
                  name: "Resumo mes",
                  colWidths: [30, 20],
                  rows: [
                    ["Indicador", "Valor"],
                    ["Mês de referência", MES_REF],
                    ["Faturamento acumulado", FATURAMENTO_ACUM],
                    ["Média diária", mediaDiaria],
                    ["Projeção de fechamento", projecao],
                    ["Meta do mês", META_MES],
                    ["% da meta", vsMeta],
                    ["Ticket médio", ticketMedio],
                    ["Pedidos", PEDIDOS_ACUM],
                    ["Clientes ativos", CLIENTES_ATIVOS],
                    [],
                    ["Faturamento do dia", FAT_DIA],
                    ["Pedidos do dia", PEDIDOS_DIA],
                    ["Clientes atendidos", CLIENTES_DIA],
                  ],
                },
                {
                  name: "Clientes mes",
                  colWidths: [30, 18, 12],
                  rows: [
                    ["Cliente", "Faturamento", "% total"],
                    ...CLIENTES_MES.map((c) => [c.nome, c.valor, c.valor / totalMes]),
                  ],
                },
                {
                  name: "Mix mes",
                  colWidths: [18, 18, 12],
                  rows: [
                    ["Família", "Valor", "% total"],
                    ...MIX_MES.map((m) => [m.familia, m.valor, m.valor / totalMix]),
                  ],
                },
                {
                  name: "Evolucao diaria",
                  colWidths: [8, 18],
                  rows: [["Dia", "Faturamento"], ...EVOLUCAO.map((e) => [e.dia, e.valor])],
                },
              ]}
            />
          }
        />

        <div ref={reportRef} className="report-content space-y-6">
          {/* Header do relatório — marca entra no PDF/JPG */}
          <ReportBrandHead
            title={`Painel Executivo · ${MES_REF}`}
            subtitle={`Data de referência: ${format(new Date(), "dd/MM/yyyy", { locale: ptBR })} · Atualizado em ${dataAtualizacao}`}
            meta={
              <div>
                <div>Fonte</div>
                <div className="text-sm font-semibold text-foreground">
                  Inteligência comercial · Sistema de vendas
                </div>
                <div className="mt-1">
                  Dia {DIAS_TRANSCORRIDOS} de {DIAS_COMERCIAIS} dias comerciais
                </div>
              </div>
            }
          />

          <div className="decision-strip">
            <div className="decision-primary">
              <div className="decision-icon">
                <TrendingUp className="h-5 w-5" />
              </div>
              <div>
                <div className="decision-kicker">Situação do mês</div>
                <div className="decision-title">
                  {gapProjetado >= 0
                    ? "Fechamento acima da meta"
                    : "Aceleração necessária para atingir a meta"}
                </div>
                <div className="decision-copy">
                  Projeção de <strong>{fmtBRL(projecao)}</strong> ·{" "}
                  {gapProjetado >= 0 ? "superávit" : "diferença"} de{" "}
                  <strong>{fmtBRL(Math.abs(gapProjetado))}</strong>
                </div>
              </div>
            </div>
            <div className="decision-stat">
              <Target className="h-4 w-4" />
              <div>
                <span>Ritmo esperado até hoje</span>
                <strong className={ritmoVsMeta >= 0 ? "text-success" : "text-warning"}>
                  {ritmoVsMeta >= 0 ? "+" : ""}
                  {fmtPct(ritmoVsMeta)}
                </strong>
              </div>
            </div>
            <div className="decision-action">
              {gapProjetado >= 0 ? (
                <ArrowUpRight className="h-4 w-4" />
              ) : (
                <CircleAlert className="h-4 w-4" />
              )}
              <div>
                <span>Prioridade gerencial</span>
                <strong>
                  {gapProjetado >= 0 ? "Proteger margem e mix" : "Recuperar volume diário"}
                </strong>
              </div>
            </div>
          </div>

          {/* KPIs Acumulado */}
          <div>
            <div className="section-title">Desempenho acumulado do mês</div>
            <div className="kpi-grid">
              <Kpi
                label="Faturamento acumulado"
                value={fmtBRL(FATURAMENTO_ACUM)}
                accent
                featured
                sub={`${fmtPct(vsMeta)} da meta mensal`}
              />
              <Kpi label="Média diária" value={fmtBRL(mediaDiaria)} />
              <Kpi
                label="Projeção de fechamento"
                value={fmtBRL(projecao)}
                sub={`vs meta ${fmtPct(vsMeta)}`}
              />
              <Kpi
                label="Ticket médio"
                value={fmtBRL(ticketMedio)}
                sub={`${PEDIDOS_ACUM} pedidos · ${CLIENTES_ATIVOS} clientes`}
              />
            </div>
          </div>

          {/* Clientes + Mix mês */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="module-surface p-5">
              <div className="section-title">Principais clientes do mês</div>
              <RankingList
                items={CLIENTES_MES.slice(0, 5).map((c, i) => ({
                  pos: i + 1,
                  nome: c.nome,
                  valor: c.valor,
                  pct: c.valor / totalMes,
                }))}
              />
            </div>
            <div className="module-surface p-5">
              <div className="section-title">Mix de vendas acumulado</div>
              <MixList
                items={MIX_MES.map((m) => ({
                  nome: m.familia,
                  valor: m.valor,
                  pct: m.valor / totalMix,
                }))}
              />
            </div>
          </div>

          {/* Venda do dia */}
          <div>
            <div className="section-title">Venda do dia</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <Kpi label="Faturamento do dia" value={fmtBRL(FAT_DIA)} accent />
              <Kpi
                label="Comparativo com a média"
                value={`${diaVsMedia >= 0 ? "+" : ""}${fmtPct(diaVsMedia)}`}
                sub={diaVsMedia >= 0 ? "Acima da média" : "Abaixo da média"}
              />
              <Kpi
                label="Pedidos"
                value={fmtNum(PEDIDOS_DIA)}
                sub={`Ticket médio ${fmtBRL(FAT_DIA / PEDIDOS_DIA)}`}
              />
              <Kpi
                label="Clientes atendidos"
                value={fmtNum(CLIENTES_DIA)}
                sub={`Posição ${posicaoDia}º de ${EVOLUCAO.length} dias`}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="module-surface p-5">
              <div className="section-title">Principais clientes do dia</div>
              <RankingList
                items={CLIENTES_DIA_LIST.map((c, i) => ({
                  pos: i + 1,
                  nome: c.nome,
                  valor: c.valor,
                  pct: c.valor / totalClientesDia,
                }))}
              />
            </div>
            <div className="module-surface p-5">
              <div className="section-title">Mix do dia × acumulado</div>
              <div className="table-scroll">
                <table className="table-clean">
                  <thead>
                    <tr>
                      <th>Família</th>
                      <th className="text-right">Dia</th>
                      <th className="text-right">% dia</th>
                      <th className="text-right">Δ vs mês</th>
                    </tr>
                  </thead>
                  <tbody>
                    {MIX_DIA.map((m) => {
                      const pctDia = m.valor / totalMixDia;
                      const mesItem = MIX_MES.find((x) => x.familia === m.familia)!;
                      const pctMes = mesItem.valor / totalMix;
                      const delta = pctDia - pctMes;
                      return (
                        <tr key={m.familia}>
                          <td className="font-medium">{m.familia}</td>
                          <td className="text-right">{fmtBRL(m.valor)}</td>
                          <td className="text-right">{fmtPct(pctDia)}</td>
                          <td
                            className={`text-right font-semibold ${delta >= 0 ? "text-success" : "text-destructive"}`}
                          >
                            {delta >= 0 ? "+" : ""}
                            {fmtPct(delta)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Evolução diária */}
          <div className="module-surface p-5">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <div className="section-title mb-0">Evolução diária do faturamento</div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-1 bg-primary rounded" />
                  Acima da média
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-1 bg-muted-foreground rounded" />
                  Abaixo
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-1 bg-gold rounded" />
                  Hoje
                </span>
                <span>
                  Média: <b className="text-gold">{fmtBRL(mediaEvo)}</b>
                </span>
              </div>
            </div>
            <div className="flex items-end gap-1.5 h-48 border-b border-border pb-1 relative">
              <div
                className="absolute left-0 right-0 border-t border-dashed border-gold/60"
                style={{ bottom: `${(mediaEvo / maxEvo) * 100}%` }}
              />
              {EVOLUCAO.map((e) => {
                const h = (e.valor / maxEvo) * 100;
                const isToday = e.dia === DIAS_TRANSCORRIDOS;
                const above = e.valor >= mediaEvo;
                return (
                  <div key={e.dia} className="flex-1 h-full flex flex-col justify-end items-center gap-1 min-w-0">
                    <div
                      className={`w-full rounded-t ${isToday ? "bg-gold" : above ? "bg-primary" : "bg-muted-foreground/40"}`}
                      style={{ height: `${h}%` }}
                      title={`Dia ${e.dia}: ${fmtBRL(e.valor)}`}
                    />
                    <div
                      className={`text-[0.6rem] ${isToday ? "text-gold font-bold" : "text-muted-foreground"}`}
                    >
                      {e.dia}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Leitura executiva */}
          <div className="module-surface p-5 border-l-4 border-gold">
            <div className="section-title">Leitura executiva</div>
            <ul className="space-y-2 text-sm leading-relaxed">
              <li>
                • Acumulado de <b>{fmtBRL(FATURAMENTO_ACUM)}</b> em {DIAS_TRANSCORRIDOS} dias, ritmo
                projeta fechamento em <b>{fmtBRL(projecao)}</b> ({fmtPct(vsMeta)} da meta).
              </li>
              <li>
                • Venda do dia {diaVsMedia >= 0 ? "acima" : "abaixo"} da média em{" "}
                <b>{fmtPct(Math.abs(diaVsMedia))}</b> — posição {posicaoDia}º entre os{" "}
                {EVOLUCAO.length} dias transcorridos.
              </li>
              <li>
                • Batata segue liderando o mix ({fmtPct(MIX_MES[0].valor / totalMix)} do
                faturamento). Atenção a mudanças no mix do dia frente ao acumulado.
              </li>
              <li>
                • Os 5 maiores clientes concentram{" "}
                <b>
                  {fmtPct(CLIENTES_MES.slice(0, 5).reduce((s, c) => s + c.valor, 0) / totalMes)}
                </b>{" "}
                do faturamento — monitorar dependência.
              </li>
              <li>
                • Recomendação: reforçar cobertura de médios clientes e ampliar mix em cebola e
                cenoura.
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
  sub,
  accent,
  featured,
}: {
  label: string;
  value: string;
  sub?: string;
  accent?: boolean;
  featured?: boolean;
}) {
  return (
    <div className={`kpi-card ${accent ? "accent" : ""} ${featured ? "featured" : ""}`}>
      <div className="kpi-label">{label}</div>
      <div className={`kpi-value mt-1 ${accent ? "text-primary" : ""}`}>{value}</div>
      {sub && <div className="text-xs text-muted-foreground mt-1">{sub}</div>}
    </div>
  );
}

function RankingList({
  items,
}: {
  items: { pos: number; nome: string; valor: number; pct: number }[];
}) {
  const max = Math.max(...items.map((i) => i.pct));
  return (
    <div className="space-y-2">
      {items.map((it) => (
        <div key={it.pos}>
          <div className="flex justify-between items-baseline gap-3 text-sm">
            <div className="flex items-center gap-2 min-w-0">
              <span className="chip chip-primary shrink-0">#{it.pos}</span>
              <span className="truncate font-medium">{it.nome}</span>
            </div>
            <div className="text-right shrink-0">
              <div className="font-semibold">{fmtBRL(it.valor)}</div>
              <div className="text-xs text-muted-foreground">{fmtPct(it.pct)}</div>
            </div>
          </div>
          <div className="h-1 bg-surface-2 rounded mt-1.5 overflow-hidden">
            <div className="h-full bg-primary" style={{ width: `${(it.pct / max) * 100}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function MixList({ items }: { items: { nome: string; valor: number; pct: number }[] }) {
  return (
    <div className="space-y-1.5">
      {items.map((it) => (
        <div key={it.nome} className="flex items-center gap-3 text-sm">
          <span className="w-20 shrink-0 font-medium">{it.nome}</span>
          <div className="flex-1 h-2 bg-surface-2 rounded overflow-hidden">
            <div className="h-full bg-primary" style={{ width: `${it.pct * 100}%` }} />
          </div>
          <span className="w-24 text-right text-xs text-muted-foreground">{fmtBRL(it.valor)}</span>
          <span className="w-12 text-right font-semibold text-xs">{fmtPct(it.pct)}</span>
        </div>
      ))}
    </div>
  );
}
