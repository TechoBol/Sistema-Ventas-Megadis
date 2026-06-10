import React from "react";
import {
  ShoppingCart,
  FileText,
  ArrowLeftRight,
  PackageOpen,
} from "lucide-react";

export const NOTIF_TYPES = {
  SALE: {
    label:       "Venta",
    iconBg:      "#FCEBEB",
    iconColor:   "#A32D2D",
    accentColor: "#E24B4A",
    badgeBg:     "#FCEBEB",
    badgeColor:  "#A32D2D",
    Icon:        ShoppingCart,
  },
  QUOTATION: {
    label:       "Cotización",
    iconBg:      "#E6F1FB",
    iconColor:   "#185FA5",
    accentColor: "#378ADD",
    badgeBg:     "#E6F1FB",
    badgeColor:  "#185FA5",
    Icon:        FileText,
  },
  TRANSFER: {
    label:       "Transferencia",
    iconBg:      "#FFF7ED",
    iconColor:   "#C2410C",
    accentColor: "#FB923C",
    badgeBg:     "#FFF7ED",
    badgeColor:  "#C2410C",
    Icon:        ArrowLeftRight,
  },
  IMPORTACION: {
    label:       "Importación",
    iconBg:      "#EAF3DE",
    iconColor:   "#3B6D11",
    accentColor: "#639922",
    badgeBg:     "#EAF3DE",
    badgeColor:  "#3B6D11",
    Icon:        PackageOpen,
  },
};

/**
 * Construye un objeto de notificación con ícono y colores según el tipo.
 *
 * @param {{ id: string, type: keyof typeof NOTIF_TYPES, title: string, body: string, createdAt: Date, read: boolean }} params
 */
export function buildNotification({ type, title, body, ...rest }) {
  const cfg = NOTIF_TYPES[type] ?? NOTIF_TYPES.venta;
  const { Icon, iconBg, iconColor } = cfg;

  return {
    type,
    title,
    body,
    iconBg,
    icon: <Icon size={16} color={iconColor} />,
    ...rest,
  };
}