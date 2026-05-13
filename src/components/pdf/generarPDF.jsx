import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const numeroALetras = (num) => {
  const unidades = [
    "",
    "uno",
    "dos",
    "tres",
    "cuatro",
    "cinco",
    "seis",
    "siete",
    "ocho",
    "nueve",
    "diez",
    "once",
    "doce",
    "trece",
    "catorce",
    "quince",
    "dieciséis",
    "diecisiete",
    "dieciocho",
    "diecinueve",
  ];

  const decenas = [
    "",
    "",
    "veinte",
    "treinta",
    "cuarenta",
    "cincuenta",
    "sesenta",
    "setenta",
    "ochenta",
    "noventa",
  ];

  const centenas = [
    "",
    "cien",
    "doscientos",
    "trescientos",
    "cuatrocientos",
    "quinientos",
    "seiscientos",
    "setecientos",
    "ochocientos",
    "novecientos",
  ];

  if (num === 0)
    return "cero 00/100 bolivianos";

  const entero = Math.floor(num);

  const decimales = Math.round(
    (num - entero) * 100
  );

  const convertirGrupo = (n) => {
    if (n === 0) return "";

    if (n < 20) return unidades[n];

    if (n < 100) {
      const d = Math.floor(n / 10);

      const u = n % 10;

      if (n < 30) {
        return u === 0
          ? "veinte"
          : `veinti${unidades[u]}`;
      }

      return u === 0
        ? decenas[d]
        : `${decenas[d]} y ${unidades[u]}`;
    }

    if (n === 100) return "cien";

    const c = Math.floor(n / 100);

    const resto = n % 100;

    return resto === 0
      ? centenas[c]
      : `${centenas[c]} ${convertirGrupo(
          resto
        )}`;
  };

  const convertir = (n) => {
    if (n < 1000) return convertirGrupo(n);

    if (n < 1000000) {
      const miles = Math.floor(n / 1000);

      const resto = n % 1000;

      const prefijo =
        miles === 1
          ? "mil"
          : `${convertirGrupo(miles)} mil`;

      return resto === 0
        ? prefijo
        : `${prefijo} ${convertirGrupo(
            resto
          )}`;
    }

    return "";
  };

  return `${convertir(entero)} ${String(
    decimales
  ).padStart(2, "0")}/100 bolivianos`;
};

export const generarPDF = (venta) => {
  const doc = new jsPDF(
    "p",
    "mm",
    "letter"
  );

  const pageWidth =
    doc.internal.pageSize.getWidth();

  // =====================================================
  // EMPRESA
  // =====================================================

  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);

  doc.text("TECHO BOL S.R.L.", 14, 18);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);

  doc.text(
    "Av. La Juventud s/n Zona El Abra - Cochabamba - Bolivia",
    14,
    28
  );

  doc.text(
    "Teléfono: 69415220",
    14,
    34
  );

  doc.text(
    "Cochabamba - Bolivia",
    14,
    40
  );

  // =====================================================
  // TITULO FACTURA
  // =====================================================

  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);

  doc.text(
    "FACTURA",
    pageWidth / 2,
    54,
    {
      align: "center",
    }
  );

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);

  doc.text(
    "(Con Derecho a Crédito Fiscal)",
    pageWidth / 2,
    63,
    {
      align: "center",
    }
  );

  // =====================================================
  // DATOS FACTURA
  // =====================================================

  const labelX = 120;
  const valueX = 178;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);

  doc.text("NIT:", labelX, 76);

  doc.text(
    "FACTURA N°:",
    labelX,
    84
  );

  doc.text(
    "CÓD. AUTORIZACIÓN:",
    labelX,
    92
  );

  doc.setFont("helvetica", "normal");

  doc.text(
    "123456789",
    valueX,
    76,
    {
      align: "right",
    }
  );

  doc.text(
    venta.code || "-",
    valueX,
    84,
    {
      align: "right",
    }
  );

  doc.text(
    "ABCDE123456789",
    valueX,
    92,
    {
      align: "right",
    }
  );

  // =====================================================
  // CLIENTE
  // =====================================================

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);

  doc.text(
    "Nombre/Razón Social:",
    14,
    108
  );

  doc.setFont("helvetica", "normal");

  doc.text(
    venta.customer?.name || "S/N",
    56,
    108
  );

  doc.setFont("helvetica", "bold");

  doc.text("NIT/CI:", 128, 108);

  doc.setFont("helvetica", "normal");

  doc.text(
    venta.customer?.nitCi || "0",
    152,
    108
  );

  doc.setFont("helvetica", "bold");

  doc.text("Fecha:", 14, 118);

  doc.setFont("helvetica", "normal");

  doc.text(
    new Date(venta.date).toLocaleString(
      "es-BO"
    ),
    56,
    118
  );

  // =====================================================
  // TABLA PRODUCTOS
  // =====================================================

  const body = venta.details.map(
    (item) => [
      item.product.code,
      item.quantity,
      "Pza",
      item.product.name,
      Number(item.unitPrice).toFixed(
        2
      ),
      Number(
        item.itemDiscount || 0
      ).toFixed(2),
      Number(item.subtotal).toFixed(2),
    ]
  );

  autoTable(doc, {
    startY: 132,

    head: [[
      "CÓDIGO",
      "CANT.",
      "UNIDAD",
      "DESCRIPCIÓN",
      "P. UNIT.",
      "DESC.",
      "SUBTOTAL",
    ]],

    body,

    theme: "plain",

    styles: {
      fontSize: 8,
      cellPadding: 3,
      textColor: [0, 0, 0],
    },

    headStyles: {
      fontStyle: "bold",
      fontSize: 8,
      fillColor: [255, 255, 255],
      textColor: [0, 0, 0],
    },

    columnStyles: {
      0: { cellWidth: 24 },
      1: { cellWidth: 18 },
      2: { cellWidth: 22 },
      3: { cellWidth: 52 },
      4: { cellWidth: 22 },
      5: { cellWidth: 20 },
      6: { cellWidth: 24 },
    },

    didDrawCell: (data) => {
      const { cell, row } = data;

      doc.setDrawColor(0);
      doc.setLineWidth(0.2);

      // encabezado
      if (row.section === "head") {
        doc.line(
          cell.x,
          cell.y,
          cell.x + cell.width,
          cell.y
        );

        doc.line(
          cell.x,
          cell.y + cell.height,
          cell.x + cell.width,
          cell.y + cell.height
        );
      }

      // filas
      if (row.section === "body") {
        doc.line(
          cell.x,
          cell.y + cell.height,
          cell.x + cell.width,
          cell.y + cell.height
        );
      }
    },
  });

  const finalY =
    doc.lastAutoTable.finalY;

  // =====================================================
  // CUADRO TOTALES
  // =====================================================

  const boxX = 128;
  const boxY = finalY + 10;

  const labelWidth = 32;
  const valueWidth = 22;
  const rowHeight = 8;

  doc.setLineWidth(0.2);

  // borde externo
  doc.rect(
    boxX,
    boxY,
    labelWidth + valueWidth,
    rowHeight * 3
  );

  // líneas horizontales
  doc.line(
    boxX,
    boxY + rowHeight,
    boxX + labelWidth + valueWidth,
    boxY + rowHeight
  );

  doc.line(
    boxX,
    boxY + rowHeight * 2,
    boxX + labelWidth + valueWidth,
    boxY + rowHeight * 2
  );

  // línea vertical
  doc.line(
    boxX + labelWidth,
    boxY,
    boxX + labelWidth,
    boxY + rowHeight * 3
  );

  // textos
  doc.setFontSize(8);

  doc.setFont("helvetica", "normal");

  doc.text(
    "SUBTOTAL Bs",
    boxX + 5,
    boxY + 5.5
  );

  doc.text(
    Number(venta.subtotal).toFixed(2),
    boxX +
      labelWidth +
      valueWidth -
      4,
    boxY + 5.5,
    {
      align: "right",
    }
  );

  doc.text(
    "DESCUENTO Bs",
    boxX + 4,
    boxY + 13.5
  );

  doc.text(
    Number(venta.discount).toFixed(2),
    boxX +
      labelWidth +
      valueWidth -
      4,
    boxY + 13.5,
    {
      align: "right",
    }
  );

  doc.setFont("helvetica", "bold");

  doc.text(
    "TOTAL Bs",
    boxX + 8,
    boxY + 21.5
  );

  doc.text(
    Number(venta.total).toFixed(2),
    boxX +
      labelWidth +
      valueWidth -
      4,
    boxY + 21.5,
    {
      align: "right",
    }
  );

  // =====================================================
  // LITERAL
  // =====================================================

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);

  doc.text(
    `SON: ${numeroALetras(
      venta.total
    ).toUpperCase()}`,
    14,
    boxY + 36
  );

  // =====================================================
  // LEYENDAS
  // =====================================================

  doc.setFontSize(9);

  doc.text(
    "ESTA FACTURA CONTRIBUYE AL DESARROLLO DEL PAÍS.",
    14,
    boxY + 54
  );

  doc.text(
    "EL USO ILÍCITO SERÁ SANCIONADO PENALMENTE.",
    14,
    boxY + 62
  );

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);

  doc.text(
    "Ley N° 453: Está prohibido importar, distribuir o comercializar productos expirados o próximos a expirar.",
    14,
    boxY + 78,
    {
      maxWidth: 180,
    }
  );

  return doc.output("blob");
};