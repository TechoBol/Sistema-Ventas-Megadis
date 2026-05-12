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

import { NavLink } from "react-router-dom";

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
      {
        label: "Dashboard",
        icon: LayoutDashboard,
        path: "/dashboard",
      },
    ],
  },
  {
    title: "Inventario",
    items: [
      {
        label: "Productos",
        icon: Package,
        path: "/products",
      },
      {
        label: "Kardex FV",
        icon: ClipboardList,
        path: "/kardex",
      },
    ],
  },
  {
    title: "Ventas",
    items: [
      {
        label: "Carrito de Venta",
        icon: ShoppingCart,
        path: "/cart",
      },
      {
        label: "Comprobantes",
        icon: ReceiptText,
        path: "/receipts",
      },
    ],
  },
  {
    title: "Administración",
    items: [
      {
        label: "Márgenes y Uti.",
        icon: BarChart3,
        path: "/profits",
      },
      {
        label: "Clientes",
        icon: Users,
        path: "/clients",
      },
      {
        label: "Reportes de Ventas",
        icon: BarChart3,
        path: "/sales-reports",
      },
    ],
  },
  {
    title: "Configuración",
    items: [
      {
        label: "Usuarios",
        icon: UserCog,
        path: "/users",
      },
      {
        label: "Sistema",
        icon: Settings,
        path: "/settings",
      },
    ],
  },
];

function Sidebar({ isOpen, onClose }) {
  return (
    <SidebarWrapper $isOpen={isOpen}>
      <SidebarHeader>
        <Brand>
          <BrandText>Meggadis</BrandText>
        </Brand>

        <CloseButton type="button" onClick={onClose}>
          <X size={20} />
        </CloseButton>
      </SidebarHeader>

      <NavContent>
        {sidebarSections.map((section) => (
          <NavSection key={section.title}>
            <SectionTitle>{section.title}</SectionTitle>

            {section.items.map(({ label, icon: Icon, path }) => (
              <NavLink
                key={label}
                to={path}
                style={{
                  textDecoration: "none",
                }}
              >
                {({ isActive }) => (
                  <NavItem $active={isActive}>
                    <Icon size={16} />
                    <span>{label}</span>
                  </NavItem>
                )}
              </NavLink>
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
