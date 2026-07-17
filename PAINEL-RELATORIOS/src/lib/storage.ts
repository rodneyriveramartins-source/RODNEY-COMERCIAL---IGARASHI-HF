export function loadLS<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function saveLS<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

export type Vendedor = {
  id: string;
  nome: string;
  funcao: string;
  whatsapp: string;
};

export type ProdutoMestre = {
  id: string;
  familia: string;
  classe: string;
  embalagem: string;
  pesoKg: number;
};

export const VENDEDORES_KEY = "igarashi.vendedores";
export const PRODUTOS_KEY = "igarashi.produtos";

export const defaultVendedores: Vendedor[] = [
  { id: "v1", nome: "Selecione um vendedor", funcao: "", whatsapp: "" },
];

export const defaultProdutos: ProdutoMestre[] = [
  { id: "p1", familia: "Batata", classe: "Especial", embalagem: "Saco", pesoKg: 25 },
  { id: "p2", familia: "Cebola", classe: "Nacional 3", embalagem: "Saco", pesoKg: 20 },
  { id: "p3", familia: "Cenoura", classe: "Extra", embalagem: "Caixa", pesoKg: 20 },
  { id: "p4", familia: "Beterraba", classe: "Extra", embalagem: "Saco", pesoKg: 20 },
  { id: "p5", familia: "Repolho", classe: "Verde", embalagem: "Saco", pesoKg: 20 },
  { id: "p6", familia: "Alho", classe: "Nacional 5", embalagem: "Caixa", pesoKg: 10 },
  { id: "p7", familia: "Maçã", classe: "Fuji", embalagem: "Caixa", pesoKg: 18 },
];

export function fmtBRL(n: number): string {
  if (!isFinite(n)) return "R$ 0,00";
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
export function fmtNum(n: number, digits = 0): string {
  if (!isFinite(n)) return "0";
  return n.toLocaleString("pt-BR", { minimumFractionDigits: digits, maximumFractionDigits: digits });
}
export function fmtPct(n: number, digits = 1): string {
  if (!isFinite(n)) return "0%";
  return `${(n * 100).toLocaleString("pt-BR", { minimumFractionDigits: digits, maximumFractionDigits: digits })}%`;
}
