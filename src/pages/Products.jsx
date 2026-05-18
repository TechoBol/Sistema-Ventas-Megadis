import React, { useMemo, useState } from "react";

import AppLayout from "../components/layout/AppLayout";
import ProductForm from "../components/forms/ProductForm";
import DataTable from "../components/table/DataTable";

import useInventory from "../hooks/useInventory";

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
} from "../components/ui/Products";
import { Pencil, Plus, Search } from "lucide-react";

const fechaHoy = () =>
  new Date().toLocaleDateString("es-BO", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

function Products() {
  const [showForm, setShowForm] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState(null);

  const { products, search, onFilterTextBoxChanged, isLoading } =
    useInventory();

  ////////////////////////////////////////////////////////////
  // EDITAR PRODUCTO
  ////////////////////////////////////////////////////////////

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setShowForm(true);
  };

  ////////////////////////////////////////////////////////////
  // COLUMNAS TABLA
  ////////////////////////////////////////////////////////////

  const columns = useMemo(
    () => [
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
        field: "line",
        headerName: "Línea",
        flex: 1.2,
        valueGetter: (_, row) => row?.line?.name || "-",
      },

      {
        field: "brandName",
        headerName: "Marca",
        flex: 1.2,
        valueGetter: (_, row) => row?.brandName || "-",
      },

      {
        field: "purchasePrice",
        headerName: "Costo",
        flex: 1,
        valueFormatter: (value) =>
          `${Number(value || 0).toFixed(2)}`,
      },

      {
        field: "salePrice",
        headerName: "Venta",
        flex: 1,
        valueFormatter: (value) =>
          `${Number(value || 0).toFixed(2)}`,
      },

      {
        field: "baseUnit",
        headerName: "Unidad Base",
        flex: 1,
        valueGetter: (_, row) => row?.baseUnit?.name || "-",
      },

      {
        field: "units",
        headerName: "Otras Unidades",
        flex: 2,
        valueGetter: (_, row) =>
          row?.productUnits
            ?.filter((u) => !u.isDefault)
            ?.map(
              (u) =>
                `${u.unit.name} (${u.equivalence})`
            )
            .join(", ") || "-",
      },

      {
        field: "stockTotal",
        headerName: "Stock",
        flex: 0.8,
        valueFormatter: (value) =>
          `${Number(value || 0).toFixed(2)}`,
      },
    ],
    []
  );

  ////////////////////////////////////////////////////////////
  // ACCIONES
  ////////////////////////////////////////////////////////////

  const actions = useMemo(
    () => [
      {
        key: "edit",
        title: "Editar producto",
        icon: Pencil,
        onClick: handleEditProduct,
      },
    ],
    []
  );

  ////////////////////////////////////////////////////////////
  // RENDER
  ////////////////////////////////////////////////////////////

  return (
    <AppLayout>
      <PageContainer>
        {!showForm ? (
          <>
            <PageHeader>
              <HeaderTitle>
                <Title>Productos</Title>

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

                <AddButton
                  type="button"
                  onClick={() => {
                    setSelectedProduct(null);
                    setShowForm(true);
                  }}
                >
                  Añadir Producto

                  <Plus size={18} strokeWidth={3} />
                </AddButton>
              </TopActions>
            </PageHeader>

            <DataTable
              rows={products || []}
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
      </PageContainer>
    </AppLayout>
  );
}

export default Products;