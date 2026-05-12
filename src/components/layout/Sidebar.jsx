import React from "react";
import {
  LayoutDashboard,
  Package,
  ClipboardList,
  ShoppingCart,
  ReceiptText,
  ClipboardMinus,
  Users,
  BarChart3,
  Building2,
  Truck,
  Settings,
  UserCog,
  X,
} from "lucide-react";

import {
  SidebarWrapper,
  SidebarHeader,
  Brand,
  BrandText,
  CloseButton,
  NavContent,
  NavSection,
  SectionTitle,
  NavItem,
} from "../ui/Sidebar.styles";

const sidebarSections = [
  {
    title: "Inicio",
    items: [
      { label: "Dashboard", icon: LayoutDashboard, active: true },
    ],
  },
  {
    title: "Inventario",
    items: [
      { label: "Productos", icon: Package },
      { label: "Kardex FV", icon: ClipboardList },
    ],
  },
  {
    title: "Ventas",
    items: [
      { label: "Carrito de Venta", icon: ShoppingCart },
      { label: "Comprobantes", icon: ReceiptText },
      { label: "Matriz de Ventas", icon: ClipboardMinus },
    ],
  },
  {
    title: "Administración",
    items: [
      { label: "Márgenes y Uti", icon: BarChart3 },
      { label: "Clientes", icon: Users },
      { label: "Sucursales", icon: Building2 },
      { label: "Transferencias", icon: Truck },
    ],
  },
  {
    title: "Configuración",
    items: [
      { label: "Usuarios", icon: UserCog },
      { label: "Sistema", icon: Settings },
    ],
  },
];

function Sidebar({ isOpen, onClose }) {
  return (
    <SidebarWrapper $isOpen={isOpen}>
      <SidebarHeader>
        <Brand>
          <BrandText>
            Megadis
          </BrandText>
        </Brand>

        <CloseButton type="button" onClick={onClose}>
          <X size={20} />
        </CloseButton>
      </SidebarHeader>

      <NavContent>
        {sidebarSections.map((section) => (
          <NavSection key={section.title}>
            <SectionTitle>{section.title}</SectionTitle>

            {section.items.map(({ label, icon: Icon, active }) => (
              <NavItem key={label} $active={active}>
                <Icon size={16} />
                <span>{label}</span>
              </NavItem>
            ))}
          </NavSection>
        ))}
      </NavContent>
    </SidebarWrapper>
  );
}

export default Sidebar;
