import React, { useMemo, useState } from "react";

import ProductForm from "../components/forms/ProductForm";
import DataTable from "../components/table/DataTable";
import { PriceCell } from "../components/modals/PriceCell";
import { StockCell } from "../components/modals/StockCell";
import { useLines } from "../hooks/useLine";
import useInventory from "../hooks/useInventory";
import { usePermissions } from "../hooks/usePermissions";
import {
  PageContainer,
  PageHeader,
  HeaderTitle,
  Title,
  Subtitle,
  AddButton,
  SearchInput,
  TopActions,
  SearchWrapper,
  FilterButtonGroup,
  FilterButton,
} from "../components/ui/Products";
import { Pencil, Plus, Search, Warehouse } from "lucide-react";
import { useLoginStore } from "../components/store/loginStore";
import { useLocationStore } from "../components/store/locationStore";
import { BranchesPopover } from "../components/modals/BranchesPopover";

const fechaHoy = () => {
  const fecha = new Date().toLocaleDateString("es-BO", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return fecha.charAt(0).toUpperCase() + fecha.slice(1);
};

function Products() {
  const [showForm, setShowForm] = useState(false);
  const [selectedLineId, setSelectedLineId] = useState("all");

  const [branchesAnchor, setBranchesAnchor] = useState(null);
  const [branchProductId, setBranchProductId] = useState(null);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const { location } = useLoginStore();
  const { selectedLocation } = useLocationStore();
  const permissions = usePermissions();
  const { canViewCosts } = usePermissions();
  const activeLocationId =
    permissions.isAdmin || permissions.isManager
      ? selectedLocation?.id
      : location?.id;

  const { products, search, onFilterTextBoxChanged, isLoading } = useInventory();
  const { lines } = useLines();
  ////////////////////////////////////////////////////////////
  // EDITAR PRODUCTO
  ////////////////////////////////////////////////////////////

  const handleEditProduct = (product) => {
    if (!permissions.canEditProduct) return;

    setSelectedProduct(product);
    setShowForm(true);
  };

  ////////////////////////////////////////////////////////////
  // COLUMNAS TABLA
  ////////////////////////////////////////////////////////////

  const columns = useMemo(() => {
    const baseColumns = [
      {
        field: "code",
        headerName: "Código",
        flex: 1,
      },
      {
        field: "name",
        headerName: "Nombre",
        flex: 1.5,
      },
      {
        field: "salePrice",
        headerName: "Precio Venta",
        renderCell: (params) => (
          <PriceCell
            price={params.row.salePrice}
            units={params.row.productUnits}
          />
        ),
      },
      {
        field: "baseUnit",
        headerName: "Unidad Base",
        flex: 1,
        valueGetter: (_, row) => row?.baseUnit?.name || "-",
      },
      {
        field: "stock",
        headerName: "Stock",
        flex: 1,
        renderCell: (params) => {
          const inventory = params.row?.inventories?.find(
            (inv) => inv.locationId === activeLocationId,
          );

          const stock = inventory?.quantity || 0;

          return <StockCell stock={stock} units={params.row.productUnits} />;
        },
      },
    ];

    if (canViewCosts) {
      baseColumns.splice(2, 0, {
        field: "purchasePrice",
        headerName: "Costo Unitario",
        flex: 1,
        valueFormatter: (value) => `${Number(value || 0).toFixed(2)}`,
      });

      baseColumns.push({
        field: "totalCost",
        headerName: "Costo Total",
        flex: 1,
        valueGetter: (_, row) => {
          const inventory = row?.inventories?.find(
            (inv) => inv.locationId === activeLocationId,
          );

          return (
            Number(row?.purchasePrice || 0) * Number(inventory?.quantity || 0)
          );
        },
        valueFormatter: (value) => Number(value || 0).toFixed(2),
      });
    }

    return baseColumns;
  }, [activeLocationId, canViewCosts]);

  ////////////////////////////////////////////////////////////
  // ACCIONES
  ////////////////////////////////////////////////////////////
  const actions = useMemo(() => {
    const list = [];

    list.push({
      key: "branches",
      title: "Stock por sucursal",
      icon: Warehouse,
      onClick: (row, event) => {
        setBranchProductId(row.id);
        setBranchesAnchor(event.currentTarget);
      },
    });

    if (permissions.canEditProduct) {
      list.push({
        key: "edit",
        title: "Editar producto",
        icon: Pencil,
        onClick: handleEditProduct,
      });
    }

    return list;
  }, [permissions]);

  ////////////////////////////////////////////////////
  // FILTROS
  ////////////////////////////////////////////////////

  const lineFilters = useMemo(() => {
    return [
      { id: "all", name: "TODOS" },
      ...lines.map((line) => ({
        id: String(line.id),
        name: line.name,
      })),
    ];
  }, [lines]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesLocation = product.inventories?.some(
        (inv) => inv.locationId === activeLocationId,
      );
      const matchesLine =
        selectedLineId === "all" || String(product.lineId) === selectedLineId;
      return matchesLocation && matchesLine;
    });
  }, [products, activeLocationId, selectedLineId]);

  ////////////////////////////////////////////////////////////
  // RENDER
  ////////////////////////////////////////////////////////////

  return (
    <>
      <PageContainer>
        {!showForm ? (
          <>
            <PageHeader>
              <HeaderTitle>
                <Title>Inventario</Title>

                <Subtitle>{fechaHoy()}</Subtitle>
              </HeaderTitle>

              <TopActions>
                <SearchWrapper>
                  <Search size={18} />
                  <SearchInput
                    value={search}
                    onChange={onFilterTextBoxChanged}
                    placeholder="Buscar producto..."
                  />
                </SearchWrapper>

                {permissions.canCreateProduct && (
                  <AddButton
                    type="button"
                    onClick={() => {
                      setSelectedProduct(null);
                      setShowForm(true);
                    }}
                  >
                    <Plus size={18} strokeWidth={3} />
                    Añadir Producto
                  </AddButton>
                )}
              </TopActions>
            </PageHeader>
            
            {/* FILTROS DE MARCAS */}
            <FilterButtonGroup>
              {lineFilters.map((line) => (
                <FilterButton
                  key={line.id}
                  type="button"
                  $active={selectedLineId === line.id}
                  onClick={() => setSelectedLineId(line.id)}
                >
                  {line.name}
                </FilterButton>
              ))}
            </FilterButtonGroup>

            <DataTable
              rows={filteredProducts || []}
              columns={columns}
              actions={actions}
              loading={isLoading}
              getRowId={(row) => row.id}
              pageSize={7}
              pageSizeOptions={[7, 10, 20]}
              noRowsLabel="No hay productos registrados"
            />
          </>
        ) : (
          <ProductForm
            product={selectedProduct}
            onBack={() => {
              setShowForm(false);
              setSelectedProduct(null);
            }}
          />
        )}
        <BranchesPopover
          productId={branchProductId}
          anchorEl={branchesAnchor}
          currentLocationId={activeLocationId}
          onClose={() => {
            setBranchesAnchor(null);
            setBranchProductId(null);
          }}
        />
      </PageContainer>
    </>
  );
}

export default Products;
