import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export async function captureElement(el: HTMLElement): Promise<HTMLCanvasElement> {
  document.body.classList.add("exporting");
  try {
    // Force a background so oklch transparent parents don't leak
    const canvas = await html2canvas(el, {
      backgroundColor: "#1c2626",
      scale: 2,
      useCORS: true,
      windowWidth: el.scrollWidth,
      windowHeight: el.scrollHeight,
    });
    return canvas;
  } finally {
    document.body.classList.remove("exporting");
  }
}

export async function exportElementAsJPG(el: HTMLElement, filename: string) {
  const canvas = await captureElement(el);
  const url = canvas.toDataURL("image/jpeg", 0.95);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename.endsWith(".jpg") ? filename : `${filename}.jpg`;
  a.click();
}

export async function exportElementAsPDF(el: HTMLElement, filename: string) {
  const canvas = await captureElement(el);
  const imgData = canvas.toDataURL("image/jpeg", 0.95);

  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageW = pdf.internal.pageSize.getWidth();
  const pageH = pdf.internal.pageSize.getHeight();

  const imgW = pageW;
  const imgH = (canvas.height * imgW) / canvas.width;

  if (imgH <= pageH) {
    pdf.addImage(imgData, "JPEG", 0, 0, imgW, imgH);
  } else {
    // Slice canvas into page-sized chunks
    const pxPerMm = canvas.width / pageW;
    const pageHpx = pageH * pxPerMm;
    let y = 0;
    let page = 0;
    while (y < canvas.height) {
      const sliceH = Math.min(pageHpx, canvas.height - y);
      const slice = document.createElement("canvas");
      slice.width = canvas.width;
      slice.height = sliceH;
      const ctx = slice.getContext("2d")!;
      ctx.fillStyle = "#1c2626";
      ctx.fillRect(0, 0, slice.width, slice.height);
      ctx.drawImage(canvas, 0, y, canvas.width, sliceH, 0, 0, canvas.width, sliceH);
      const sliceData = slice.toDataURL("image/jpeg", 0.95);
      if (page > 0) pdf.addPage();
      const sliceMmH = (sliceH * pageW) / canvas.width;
      pdf.addImage(sliceData, "JPEG", 0, 0, pageW, sliceMmH);
      y += sliceH;
      page++;
    }
  }
  pdf.save(filename.endsWith(".pdf") ? filename : `${filename}.pdf`);
}

export function sanitizeFilename(input: string): string {
  return (input || "documento")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9-_ ]/g, "")
    .trim()
    .replace(/\s+/g, "_");
}

export function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}
