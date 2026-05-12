import React from "react";
import {
  LayoutDashboard,
  Package,
  ClipboardList,
  ShoppingCart,
  ReceiptText,
  Users,
  BarChart3,
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
  UserBox,
  UserAvatar,
  UserInfo,
  UserName,
  UserRole,
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
    ],
  },
  {
    title: "Administración",
    items: [
      { label: "Márgenes y Uti.", icon: BarChart3 },
      { label: "Clientes", icon: Users },
      { label: "Reportes de Ventas", icon: BarChart3 },
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
            Meggadis
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

      <UserBox>
        <UserAvatar />
        <UserInfo>
          <UserName>Carlos Mendoza</UserName>
          <UserRole>Administrador</UserRole>
        </UserInfo>
      </UserBox>
    </SidebarWrapper>
  );
}

export default Sidebar;
