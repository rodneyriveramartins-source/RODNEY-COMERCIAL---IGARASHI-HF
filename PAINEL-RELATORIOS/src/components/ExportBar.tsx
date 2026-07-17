import { FileImage, FileText, FileSpreadsheet, FileDown } from "lucide-react";
import { useState, type ReactNode } from "react";
import { exportElementAsJPG, exportElementAsPDF, sanitizeFilename } from "@/lib/export-utils";
import { exportSheetsXLSX, exportSheetCSV, type SheetSpec } from "@/lib/sheet-export";

export function ExportBar({
  targetRef,
  baseName,
  extra,
  sheets,
}: {
  targetRef: React.RefObject<HTMLElement | null>;
  baseName: string;
  extra?: ReactNode;
  /** Function returning current sheet snapshot(s). First sheet is used for CSV. */
  sheets?: () => SheetSpec[];
}) {
  const [busy, setBusy] = useState<null | "pdf" | "jpg" | "xlsx" | "csv">(null);

  const run = async (kind: "pdf" | "jpg" | "xlsx" | "csv") => {
    const name = sanitizeFilename(baseName);
    setBusy(kind);
    try {
      if (kind === "pdf" || kind === "jpg") {
        if (!targetRef.current) return;
        if (kind === "pdf") await exportElementAsPDF(targetRef.current, name);
        else await exportElementAsJPG(targetRef.current, name);
      } else if (kind === "xlsx" && sheets) {
        exportSheetsXLSX(sheets(), name);
      } else if (kind === "csv" && sheets) {
        const list = sheets();
        if (list.length) exportSheetCSV(list[0], name);
      }
    } catch (e) {
      console.error(e);
      alert("Falha ao exportar. Tente novamente.");
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {extra}
      {sheets && (
        <>
          <button className="btn btn-outline" onClick={() => run("csv")} disabled={busy !== null}>
            <FileDown className="h-4 w-4" />
            {busy === "csv" ? "..." : "CSV"}
          </button>
          <button className="btn btn-outline" onClick={() => run("xlsx")} disabled={busy !== null}>
            <FileSpreadsheet className="h-4 w-4" />
            {busy === "xlsx" ? "..." : "XLSX"}
          </button>
        </>
      )}
      <button className="btn btn-outline" onClick={() => run("jpg")} disabled={busy !== null}>
        <FileImage className="h-4 w-4" />
        {busy === "jpg" ? "..." : "JPG"}
      </button>
      <button className="btn btn-primary" onClick={() => run("pdf")} disabled={busy !== null}>
        <FileText className="h-4 w-4" />
        {busy === "pdf" ? "..." : "PDF"}
      </button>
    </div>
  );
}
