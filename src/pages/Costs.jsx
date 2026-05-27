import React, { useMemo, useState } from "react";
import { Search, Plus, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

import DataTable from "../components/table/DataTable";

import {
  PageSurface,
  PageWrapper,
  HeaderTitle,
  Title,
  Subtitle,
  Toolbar,
  SearchBox,
  SearchInput,
  PrimaryActionButton,
} from "../components/ui/Page.styles";

const fechaHoy = () => {
  const fecha = new Date().toLocaleDateString("es-BO", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return fecha.charAt(0).toUpperCase() + fecha.slice(1);
};

const mockImports = [
  {
    id: 1,
    supplier: "Proveedor Norte",
    reference: "IMP-2026-001",
    date: "2026-05-18",
    quantity: 120,
    totalUsd: 3500,
    products: 8,
  },
  {
    id: 2,
    supplier: "Importadora Central",
    reference: "IMP-2026-002",
    date: "2026-05-20",
    quantity: 85,
    totalUsd: 2140.5,
    products: 5,
  },
  {
    id: 3,
    supplier: "Distribuidora Andes",
    reference: "IMP-2026-003",
    date: "2026-05-22",
    quantity: 240,
    totalUsd: 7200,
    products: 12,
  },
];

const formatUsd = (value) =>
  `$ ${Number(value || 0).toLocaleString("es-BO", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const formatDate = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

function Costs() {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");

  const filteredImports = useMemo(() => {
    const value = searchTerm.trim().toLowerCase();

    if (!value) return mockImports;

    return mockImports.filter((item) =>
      [item.supplier, item.reference, item.date, item.quantity, item.totalUsd]
        .join(" ")
        .toLowerCase()
        .includes(value)
    );
  }, [searchTerm]);

  const importColumns = useMemo(
    () => [
      {
        field: "supplier",
        headerName: "Proveedor",
        flex: 1.4,
        minWidth: 190,
      },
      {
        field: "reference",
        headerName: "Referencia",
        flex: 1,
        minWidth: 150,
      },
      {
        field: "date",
        headerName: "Fecha",
        flex: 0.9,
        minWidth: 130,
        valueFormatter: (value) => formatDate(value),
      },
      {
        field: "quantity",
        headerName: "Cantidad",
        flex: 0.8,
        minWidth: 120,
        type: "number",
      },
      {
        field: "totalUsd",
        headerName: "Total USD",
        flex: 1,
        minWidth: 150,
        valueFormatter: (value) => formatUsd(value),
      },
      {
        field: "products",
        headerName: "Productos",
        flex: 0.9,
        minWidth: 130,
        valueFormatter: (value) => Number(value || 0),
      },
    ],
    []
  );

  const importActions = useMemo(
    () => [
      {
        key: "detail",
        title: "Ver detalle",
        icon: Eye,
        onClick: (importation) => {
          navigate(`/costs/${importation.id}`);
        },
      },
    ],
    [navigate]
  );

  const handleAddImportation = () => {
    console.log("Añadir importación");
    // Después podemos cambiar esto por:
    // navigate("/costs/new");
  };

  return (
    <PageSurface>
      <PageWrapper>
        <HeaderTitle>
          <Title>Importaciones</Title>
          <Subtitle>{fechaHoy()}</Subtitle>
        </HeaderTitle>

        <Toolbar>
          <SearchBox>
            <Search size={18} />

            <SearchInput
              type="text"
              placeholder="Buscar proveedor, referencia o fecha"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </SearchBox>

          <PrimaryActionButton type="button" onClick={handleAddImportation}>
            <Plus size={17} />
            Añadir importación
          </PrimaryActionButton>
        </Toolbar>

        <DataTable
          rows={filteredImports}
          columns={importColumns}
          actions={importActions}
          pageSize={7}
          pageSizeOptions={[7, 10, 20]}
          noRowsLabel="No hay importaciones registradas"
        />
      </PageWrapper>
    </PageSurface>
  );
}

export default Costs;
