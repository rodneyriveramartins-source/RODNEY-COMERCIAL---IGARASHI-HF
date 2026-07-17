import * as XLSX from "xlsx";
import { sanitizeFilename } from "./export-utils";

export type SheetSpec = {
  name: string;
  rows: (string | number | null | undefined)[][]; // first row = header
  colWidths?: number[]; // in characters
};

function normalize(rows: SheetSpec["rows"]) {
  return rows.map((r) => r.map((c) => (c === null || c === undefined ? "" : c)));
}

export function exportSheetsXLSX(sheets: SheetSpec[], filename: string) {
  const wb = XLSX.utils.book_new();
  for (const s of sheets) {
    const ws = XLSX.utils.aoa_to_sheet(normalize(s.rows));
    if (s.colWidths) ws["!cols"] = s.colWidths.map((w) => ({ wch: w }));
    // Bold header
    const range = XLSX.utils.decode_range(ws["!ref"] || "A1");
    for (let c = range.s.c; c <= range.e.c; c++) {
      const addr = XLSX.utils.encode_cell({ r: 0, c });
      const cell = ws[addr];
      if (cell) {
        cell.s = { font: { bold: true }, fill: { fgColor: { rgb: "0D5C4A" } } };
      }
    }
    XLSX.utils.book_append_sheet(wb, ws, s.name.slice(0, 31));
  }
  const name = sanitizeFilename(filename);
  XLSX.writeFile(wb, name.endsWith(".xlsx") ? name : `${name}.xlsx`);
}

export function exportSheetCSV(sheet: SheetSpec, filename: string) {
  const ws = XLSX.utils.aoa_to_sheet(normalize(sheet.rows));
  const csv = XLSX.utils.sheet_to_csv(ws, { FS: ";" });
  // BOM for Excel PT-BR
  const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  const name = sanitizeFilename(filename);
  a.download = name.endsWith(".csv") ? name : `${name}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
