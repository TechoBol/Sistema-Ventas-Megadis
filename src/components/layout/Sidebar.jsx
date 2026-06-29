import React, { useMemo, useState, useEffect, useRef } from "react";
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
  FileText,
  ChevronDown,
  PackageOpen,
  Search,
  Check,
  Warehouse,
} from "lucide-react";

import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import MenuIcon from "@mui/icons-material/Menu";
import Tooltip from "@mui/material/Tooltip";
import { NavLink, useLocation } from "react-router-dom";

import { usePermissions } from "../../hooks/usePermissions";
import { actionTooltipProps } from "../ui/DataTable.styles";

import {
  SidebarWrapper,
  SidebarHeader,
  Brand,
  BrandText,
  CloseButton,
  CollapseButton,
  NavContent,
  NavSection,
  SectionTitle,
  NavItem,
  NavItemText,
  ToggleIcon,
  SubNavList,
  SubNavItem,
  SubNavItemText,
  BranchSelectorWrapper,
  BranchSelectorButton,
  ActiveBranchRow,
  ActiveBranchText,
  BranchDropdownIcon,
  BranchDropdown,
  BranchDropdownHeader,
  BranchOption,
  BranchOptionTop,
  BranchBadge,
  BranchGroupTitle,
  BranchSearchWrapper,
  BranchSearch,
  BranchSearchInput,
  BranchRegion,
  BranchRegionTitle,
  BranchGrid,
  BranchCard,
  BranchCardIcon,
  BranchCardName,
  BranchCardCode,
  BranchSelected,
  BranchDivider,
  EmptyBranchState,
} from "../ui/layout/Sidebar.styles";
import { useSucursales } from "../../hooks/useSucursales";
import { useLocationStore } from "../store/locationStore";
import { useLoginStore } from "../store/loginStore";

const GENERAL_LOCATION = { id: null, name: "General", type: "GENERAL", abbreviation: "ALL" };

const sidebarSections = [
  {
    //title: "Inicio",
    items: [
      {
        label: "Inicio",
        icon: LayoutDashboard,
        path: "/dashboard",
        permission: "canViewDashboard",
      },
    ],
  },

  {
    title: "Inventario",
    items: [
      {
        label: "Inventario",
        icon: Package,
        path: "/products",
        permission: "canViewProducts",
      },
      {
        label: "Kardex FV",
        icon: ClipboardList,
        path: "/kardex",
        permission: "canManageInventory",
      },
      {
        label: "Inventario Valorado",
        icon: ClipboardList,
        path: "/inventory-valorado",
        permission: "canManageInventory",
      },
    ],
  },

  {
    title: "Ventas",
    items: [
      {
        label: "Venta",
        icon: ShoppingCart,
        path: "/cart",
        permission: "canSell",
      },
      {
        label: "Recibos / Facturas",
        icon: ReceiptText,
        path: "/receipts",
        permission: "canViewReceipts",
      },
      {
        label: "Cotizaciones",
        icon: FileText,
        path: "/quotations",
        permission: "canViewQuotations",
      },
      {
        label: "Matriz de Ventas",
        icon: ClipboardMinus,
        path: "/sales-matrix",
        permission: "canManageSales",
      },
    ],
  },

  {
    title: "Administración",
    items: [
      {
        label: "Márgenes y Utilidades",
        icon: BarChart3,
        path: "/profits",
        permission: "canViewProfits", // SOLO ADMIN
      },
      {
        label: "Clientes",
        icon: Users,
        path: "/customer",
        permission: "canViewCustomers",
      },
      {
        label: "Importaciones",
        icon: PackageOpen,
        path: "/costs",
        permission: "canManageCosts",
      },
      {
        label: "Sucursales",
        icon: Building2,
        path: "/locations",
        permission: "canManageBranches",
      },
      {
        label: "Transferencias",
        icon: Truck,
        path: "/transfers",
        permission: "canManageTransfers",
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
        permission: "canManageUsers",
      },
      {
        label: "Sistema",
        icon: Settings,
        permission: "canManageRoles",
        children: [
          {
            label: "Roles",
            path: "/roles",
          },
          {
            label: "Marcas",
            path: "/brands",
          },
        ],
      },
    ],
  },
];

function Sidebar({ isOpen, isCollapsed, onClose, onToggleCollapse }) {
  const location = useLocation();
  const permissions = usePermissions();
  const { data: locations } = useSucursales();
  const { location: userLocation } = useLoginStore();

  const { selectedLocation, setSelectedLocation, initialized, setInitialized } = useLocationStore();
  const canChangeLocation = permissions.isAdmin || permissions.isManager;

  const displayLocation =
    permissions.isAdmin || permissions.isManager
      ? (selectedLocation ?? GENERAL_LOCATION)
      : userLocation;

  
  useEffect(() => {
    if (!initialized && locations?.length) {
      const defaultLocation = canChangeLocation
        ? locations[0]
        : (locations.find((l) => l.id === userLocation?.id) || locations[0]);
      setSelectedLocation(defaultLocation);
      setInitialized();
    }
  }, [locations, initialized]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        branchDropdownRef.current &&
        !branchDropdownRef.current.contains(event.target)
      ) {
        closeLocationDropdown();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const [showLocations, setShowLocations] = useState(false);
  const [search, setSearch] = useState("");
  const branchDropdownRef = useRef(null);

  const closeLocationDropdown = () => {
    setSearch("");
    setShowLocations(false);
  };

  const defaultOpenMenus = useMemo(() => {
    const openMenus = {};

    sidebarSections.forEach((section) => {
      section.items.forEach((item) => {
        const hasActiveChild = item.children?.some(
          (child) => child.path === location.pathname,
        );

        if (hasActiveChild) {
          openMenus[item.label] = true;
        }
      });
    });

    return openMenus;
  }, [location.pathname]);

  const [openMenus, setOpenMenus] = useState(defaultOpenMenus);

  const closeOnMobile = () => {
    if (window.innerWidth < 900) {
      onClose?.();
    }
  };

  const toggleSubmenu = (label) => {
    if (isCollapsed) return;

    setOpenMenus((current) => ({
      ...current,
      [label]: !current[label],
    }));
  };

  const filteredSections = useMemo(() => {
    return sidebarSections
      .map((section) => ({
        ...section,
        items: section.items.filter((item) => {
          if (!item.permission) return true;
          return permissions[item.permission];
        }),
      }))
      .filter((section) => section.items.length > 0);
  }, [permissions]);

  const groupedLocations = useMemo(() => {
    const text = search.trim().toLowerCase();

    const filtered = locations.filter((location) => {
      if (!text) return true;

      return (
        location.name.toLowerCase().includes(text) ||
        location.abbreviation?.toLowerCase().includes(text) ||
        location.region?.toLowerCase().includes(text)
      );
    });

    return filtered.reduce((groups, location) => {
      const region = location.region?.trim() || "Sin región";

      if (!groups[region]) {
        groups[region] = [];
      }

      groups[region].push(location);

      return groups;
    }, {});
  }, [locations, search]);

  const LocationIcon = ({ type, size = 24 }) =>
    type === "WAREHOUSE" ? <Warehouse size={size} /> :
      type === "GENERAL" ? <LayoutDashboard size={size} /> :
        <Building2 size={size} />;

  return (
    <SidebarWrapper $isOpen={isOpen} $isCollapsed={isCollapsed}>
      <SidebarHeader $isCollapsed={isCollapsed}>
        <Brand>
          {!isCollapsed && (
            <BranchSelectorWrapper ref={branchDropdownRef}>
              {" "}
              <BranchSelectorButton
                onClick={() => {
                  if (!canChangeLocation) return;
                  setShowLocations((prev) => {
                    const next = !prev;
                    if (!next) closeLocationDropdown();
                    return next;
                  });
                }}
                style={{
                  cursor: canChangeLocation ? "pointer" : "default",
                }}
              >
                <BrandText>Megadis</BrandText>

                {displayLocation && (
                  <ActiveBranchRow>
                    <Building2 size={13} />

                    <ActiveBranchText>{displayLocation.name}</ActiveBranchText>

                    {(permissions.isAdmin || permissions.isManager) && (
                      <BranchDropdownIcon>
                        <ChevronDown
                          size={13}
                          style={{
                            transform: showLocations
                              ? "rotate(180deg)"
                              : "rotate(0deg)",
                            transition: "0.2s",
                          }}
                        />
                      </BranchDropdownIcon>
                    )}
                  </ActiveBranchRow>
                )}
              </BranchSelectorButton>
              {canChangeLocation && showLocations && (
                <BranchDropdown>
                  <BranchSearchWrapper>
                    <BranchSearch>
                      <Search size={18} />
                      <BranchSearchInput
                        placeholder="Buscar ubicación..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                      />
                    </BranchSearch>
                  </BranchSearchWrapper>

                  <BranchRegion>
                    <BranchGrid>
                      <BranchCard
                        $active={selectedLocation === null}
                        onClick={() => {
                          setSelectedLocation(null);
                          closeLocationDropdown();
                        }}
                      >
                        <BranchCardIcon $active={selectedLocation === null}>
                          <LayoutDashboard size={24} />
                        </BranchCardIcon>
                        <BranchCardName>General</BranchCardName>
                        <BranchCardCode>TODOS</BranchCardCode>
                        {selectedLocation === null && (
                          <BranchSelected><Check size={14} /></BranchSelected>
                        )}
                      </BranchCard>
                    </BranchGrid>
                  </BranchRegion>

                  <BranchDivider />
                  {Object.keys(groupedLocations).length === 0 ? (
                    <EmptyBranchState>
                      <Search size={34} />
                      <span>No se encontraron ubicaciones</span>
                      <p>Intenta con otro nombre.</p>
                    </EmptyBranchState>
                  ) : (
                    Object.entries(groupedLocations).map(([region, regionLocations], index) => (
                      <React.Fragment key={region}>
                        {index !== 0}
                        <BranchRegion>
                          <BranchRegionTitle>
                            {region}
                          </BranchRegionTitle>
                          <BranchGrid>
                            {regionLocations.map((location) => {
                              const active =
                                selectedLocation?.id === location.id;
                              return (
                                <BranchCard
                                  key={location.id}
                                  $active={active}
                                  onClick={() => {
                                    setSelectedLocation(location);
                                    closeLocationDropdown();
                                  }}
                                >
                                  <BranchCardIcon $active={active}>
                                    <LocationIcon type={location.type} />
                                  </BranchCardIcon>
                                  <BranchCardName>
                                    {location.name}
                                  </BranchCardName>
                                  {location.abbreviation && (
                                    <BranchCardCode>
                                      {location.abbreviation}
                                    </BranchCardCode>
                                  )}
                                  {active && (
                                    <BranchSelected>
                                      <Check size={14} />
                                    </BranchSelected>
                                  )}
                                </BranchCard>
                              );
                            })}
                          </BranchGrid>
                        </BranchRegion>
                      </React.Fragment>
                    ))
                  )}
                </BranchDropdown>
              )}
            </BranchSelectorWrapper>
          )}
        </Brand>

        <CollapseButton
          type="button"
          $isCollapsed={isCollapsed}
          onClick={onToggleCollapse}
        >
          {isCollapsed ? <MenuIcon size={18} /> : <MenuOpenIcon size={18} />}
        </CollapseButton>

        <CloseButton type="button" onClick={onClose}>
          <X size={20} />
        </CloseButton>
      </SidebarHeader>

      <NavContent $isCollapsed={isCollapsed}>
        {filteredSections.map((section) => (
          <NavSection key={section.title}>
            {!isCollapsed && <SectionTitle>{section.title}</SectionTitle>}

            {section.items.map((item) => {
              const Icon = item.icon;
              const hasChildren = Boolean(item.children?.length);
              const isSubmenuOpen = Boolean(openMenus[item.label]);
              const hasActiveChild = item.children?.some(
                (child) => child.path === location.pathname,
              );

              if (hasChildren) {
                return (
                  <div key={item.label}>
                    <Tooltip
                      title={isCollapsed ? item.label : ""}
                      {...actionTooltipProps}
                    >
                      <NavItem
                        as="button"
                        type="button"
                        $active={hasActiveChild}
                        $isCollapsed={isCollapsed}
                        onClick={() => toggleSubmenu(item.label)}
                      >
                        <Icon size={18} />

                        {!isCollapsed && (
                          <>
                            <NavItemText>{item.label}</NavItemText>
                            <ToggleIcon $isOpen={isSubmenuOpen}>
                              <ChevronDown size={16} />
                            </ToggleIcon>
                          </>
                        )}
                      </NavItem>
                    </Tooltip>

                    {!isCollapsed && isSubmenuOpen && (
                      <SubNavList>
                        {item.children.map((child) => (
                          <NavLink
                            key={child.label}
                            to={child.path}
                            style={{ textDecoration: "none" }}
                            onClick={closeOnMobile}
                          >
                            {({ isActive }) => (
                              <SubNavItem $active={isActive}>
                                <SubNavItemText>{child.label}</SubNavItemText>
                              </SubNavItem>
                            )}
                          </NavLink>
                        ))}
                      </SubNavList>
                    )}
                  </div>
                );
              }

              return (
                <NavLink
                  key={item.label}
                  to={item.path}
                  style={{ textDecoration: "none" }}
                  onClick={closeOnMobile}
                >
                  {({ isActive }) => (
                    <Tooltip
                      title={isCollapsed ? item.label : ""}
                      {...actionTooltipProps}
                    >
                      <NavItem $active={isActive} $isCollapsed={isCollapsed}>
                        <Icon size={18} />
                        {!isCollapsed && (
                          <NavItemText>{item.label}</NavItemText>
                        )}
                      </NavItem>
                    </Tooltip>
                  )}
                </NavLink>
              );
            })}
          </NavSection>
        ))}
      </NavContent>
    </SidebarWrapper>
  );
}

export default Sidebar;
