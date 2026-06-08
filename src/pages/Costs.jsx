import React, { useMemo, useState } from "react";
import { Search, Plus, Eye, Pencil } from "lucide-react";
import DataTable from "../components/table/DataTable";
import ImportationWizard from "../components/forms/importationSteps/ImportationWizard";

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
  StatusBadge,
} from "../components/ui/Page.styles";

const mockImports = [
  {
    id: 1,
    supplier: "Proveedor Norte",
    reference: "IMP-2026-001",
    date: "2026-05-16",
    exchangeRate: 6.96,
    productCount: 8,
    status: "verificado",
    rawData: null,
  },
  {
    id: 2,
    supplier: "Importadora Central",
    reference: "IMP-2026-002",
    date: "2026-05-18",
    exchangeRate: 6.96,
    productCount: 5,
    status: "borrador",
    rawData: null,
  },
  {
    id: 3,
    supplier: "Distribuidora Andes",
    reference: "IMP-2026-003",
    date: "2026-05-20",
    exchangeRate: 6.96,
    productCount: 12,
    status: "verificado",
    rawData: null,
  },
];

const fechaHoy = () =>
  new Date().toLocaleDateString("es-BO", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

const formatDate = (value) => {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "-";

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

const formatExchangeRate = (value) => {
  if (!value) return "-";

  return Number(value).toLocaleString("es-BO", {
    minimumFractionDigits: 4,
    maximumFractionDigits: 4,
  });
};

const getStatusLabel = (status) => {
  if (status === "verificado") return "Verificado";
  return "Borrador";
};

function Costs() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [importations, setImportations] = useState(mockImports);

  const filteredImports = useMemo(() => {
    const value = searchTerm.trim().toLowerCase();

    if (!value) return importations;

    return importations.filter((item) =>
      [
        item.supplier,
        item.reference,
        item.date,
        item.exchangeRate,
        item.productCount,
        getStatusLabel(item.status),
      ]
        .join(" ")
        .toLowerCase()
        .includes(value)
    );
  }, [searchTerm, importations]);

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
        headerName: "Referencia / Factura",
        flex: 1.1,
        minWidth: 180,
      },
      {
        field: "date",
        headerName: "Fecha",
        flex: 0.9,
        minWidth: 130,
        valueFormatter: (value) => formatDate(value),
      },
      {
        field: "exchangeRate",
        headerName: "Tipo de cambio",
        flex: 0.9,
        minWidth: 150,
        valueFormatter: (value) => formatExchangeRate(value),
      },
      {
        field: "productCount",
        headerName: "Productos",
        flex: 0.8,
        minWidth: 120,
      },
      {
        field: "status",
        headerName: "Estado",
        flex: 0.9,
        minWidth: 140,
        sortable: false,
        filterable: false,
        renderCell: (params) => (
          <StatusBadge $status={params.value}>
            {getStatusLabel(params.value)}
          </StatusBadge>
        ),
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
          console.log("Ver detalle de importación:", importation);
        },
      },
      {
        key: "edit",
        title: "Editar importación",
        icon: Pencil,
        onClick: (importation) => {
          console.log("Editar importación:", importation);
        },
      },
    ],
    []
  );

  const handleOpenCreate = () => {
    setIsCreating(true);
  };

  const handleCloseCreate = () => {
    setIsCreating(false);
  };

  const handleSaveImportation = (payload) => {
    const newImportation = {
      id: Date.now(),
      supplier: payload.generalData.supplier || "Sin proveedor",
      reference: payload.generalData.reference || "Sin referencia",
      date: payload.generalData.date || "",
      exchangeRate: Number(payload.generalData.officialExchangeRate || 0),
      productCount: payload.products.length,
      status: payload.status || "borrador",
      rawData: payload,
    };

    setImportations((current) => [newImportation, ...current]);
    setIsCreating(false);
  };

  if (isCreating) {
    return (
      <PageSurface>
        <PageWrapper>
          <ImportationWizard
            onCancel={handleCloseCreate}
            onSubmit={handleSaveImportation}
          />
        </PageWrapper>
      </PageSurface>
    );
  }

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
              placeholder="Buscar proveedor, referencia, fecha o estado"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </SearchBox>

          <PrimaryActionButton type="button" onClick={handleOpenCreate}>
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
        />
      </PageWrapper>
    </PageSurface>
  );
}

export default Costs;
