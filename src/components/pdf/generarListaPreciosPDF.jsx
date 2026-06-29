import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import dayjs from "dayjs";

export const generarListaPreciosPDF = (productos = []) => {
  const doc = new jsPDF("portrait");
  const pageWidth = doc.internal.pageSize.getWidth();

  const formatPrice = (value) =>
    Number(value || 0).toLocaleString("es-BO", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const productosOrdenados = [...productos].sort((a, b) => {
    const l = (a.line?.name || "").localeCompare(b.line?.name || "", "es", {
      sensitivity: "base",
    });
    if (l) return l;
    const m = (a.brandName || "").localeCompare(b.brandName || "", "es", {
      sensitivity: "base",
    });
    if (m) return m;
    return (a.name || "").localeCompare(b.name || "", "es", {
      sensitivity: "base",
    });
  });

  doc.setFillColor(192, 57, 43);
  doc.rect(0, 0, pageWidth, 28, "F");
  doc.setTextColor(255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("LISTA DE PRECIOS", pageWidth / 2, 12, { align: "center" });
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text(
    `Generado: ${dayjs().format("DD/MM/YYYY HH:mm")}`,
    pageWidth / 2,
    20,
    { align: "center" },
  );
  doc.setTextColor(40);

  const body = [];
  let lineaActual = "";
  let marcaActual = "";

  productosOrdenados.forEach((producto) => {
    if ((producto.line?.name || "") !== lineaActual) {
      lineaActual = producto.line?.name || "";
      marcaActual = "";
      body.push([
        {
          content: `Marca: ${lineaActual}`,
          colSpan: 5,
          styles: {
            fillColor: [192, 57, 43],
            textColor: 255,
            fontStyle: "bold",
            halign: "left",
            fontSize: 8,
          },
        },
      ]);
    }
    if ((producto.brandName || "") !== marcaActual) {
      marcaActual = producto.brandName || "";
      body.push([
        {
          content: `Línea: ${marcaActual}`,
          colSpan: 5,
          styles: {
            fillColor: [245, 245, 245],
            textColor: 40,
            fontStyle: "bold",
            halign: "left",
          },
        },
      ]);
    }

    (producto.productUnits || []).forEach((u, i) => {
      const precioVenta = Number(u.salePrice || 0);
      const precioVenta2 = precioVenta - Number(producto.quantityDiscount || 0);

      body.push([
        i === 0 ? producto.code : "",
        i === 0 ? producto.name : "",
        u.unit?.name || "",
        `Bs ${formatPrice(precioVenta)}`,
        `Bs ${formatPrice(precioVenta2)}`,
      ]);
    });
  });

  autoTable(doc, {
    startY: 35,
    theme: "grid",
    head: [
      ["Código", "Producto", "Presentación", "Precio Venta", "Precio Venta 2"],
    ],
    body,
    margin: { left: 12, right: 12 },
    headStyles: {
      fillColor: [192, 57, 43],
      textColor: 255,
      fontStyle: "bold",
      fontSize: 8,
      halign: "center",
      cellPadding: 3,
    },
    styles: {
      font: "helvetica",
      fontSize: 8,
      cellPadding: 2.5,
      lineColor: [230, 230, 230],
      lineWidth: 0.2,
      textColor: [40, 40, 40],
      valign: "middle",
    },
    alternateRowStyles: { fillColor: [250, 250, 250] },
    columnStyles: {
      0: { cellWidth: 25, halign: "center" },
      1: { cellWidth: 75 },
      2: { cellWidth: 32, halign: "center" },
      3: { cellWidth: 28, halign: "right" },
      4: { cellWidth: 28, halign: "right" },
    },
    didParseCell: (data) => {
      if (data.section !== "body") return;
      const raw = data.cell.raw;
      if (raw && typeof raw === "object" && raw.colSpan === 4) return;
      const row = body[data.row.index];
      if (Array.isArray(row) && row[0] !== "" && data.column.index <= 1) {
        data.cell.styles.fontStyle = "bold";
      }
    },
  });

  const blob = doc.output("blob");
  window.open(URL.createObjectURL(blob), "_blank");
};
