import React, { useMemo, useState } from "react";
import { Search } from "lucide-react";

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
  FilterButtonGroup,
  FilterButton,
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

const mockBrands = [
  {
    id: "all",
    name: "Todos",
  },
  {
    id: 1,
    name: "Guantes",
  },
  {
    id: 2,
    name: "Plásticas",
  },
  {
    id: 3,
    name: "Autoperforantes",
  },
  {
    id: 4,
    name: "Clavos",
  },
  {
    id: 5,
    name: "Policarbonatos",
  },
  {
    id: 6,
    name: "Electrodos",
  },
  {
    id: 7,
    name: "Ganchos",
  },
];

const mockRows = [
  {
    id: 1,
    brandId: 1,
    brand: "Guantes",
    line: "Canguro",
    product: "Guante naranja liso",
    stock: 1020,
    unitCost: 572.27,
    costIva: 658,
    executivePercent: 50,
    executivePrice: 987,
    quantityPercent: 48,
    quantityPrice: 977,
    bossPercent: 45,
    bossPrice: 952,
  },
  {
    id: 2,
    brandId: 1,
    brand: "Guantes",
    line: "Canguro",
    product: "Guante azul liso",
    stock: 253,
    unitCost: 546.7,
    costIva: 628,
    executivePercent: 60,
    executivePrice: 1005,
    quantityPercent: 58,
    quantityPrice: 995,
    bossPercent: 56,
    bossPrice: 980,
  },
  {
    id: 3,
    brandId: 1,
    brand: "Guantes",
    line: "Canguro",
    product: "Guante negro liso",
    stock: 180,
    unitCost: 546.79,
    costIva: 628,
    executivePercent: 60,
    executivePrice: 1006,
    quantityPercent: 58,
    quantityPrice: 996,
    bossPercent: 56,
    bossPrice: 981,
  },
  {
    id: 4,
    brandId: 5,
    brand: "Policarbonatos",
    line: "Ecoceramica",
    product: "Amarillo 3*0.9 ondulado",
    stock: 1491,
    unitCost: 84.33,
    costIva: 97,
    executivePercent: 65,
    executivePrice: 160,
    quantityPercent: 64,
    quantityPrice: 159,
    bossPercent: 63,
    bossPrice: 158,
  },
  {
    id: 5,
    brandId: 5,
    brand: "Policarbonatos",
    line: "Ecocristal",
    product: "Transparente 4*0.9 ondulado",
    stock: 1010,
    unitCost: 106.16,
    costIva: 122,
    executivePercent: 66,
    executivePrice: 203,
    quantityPercent: 65,
    quantityPrice: 202,
    bossPercent: 64,
    bossPrice: 201,
  },
];

const formatMoney = (value) =>
  `Bs ${Number(value || 0).toLocaleString("es-BO", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const formatPercent = (value) => `${Number(value || 0)}%`;

function MarginProfit(

) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBrandId, setSelectedBrandId] = useState("all");

  const filteredRows = useMemo(() => {
    const value = searchTerm.trim().toLowerCase();

    return mockRows.filter((row) => {
      const matchesBrand =
        selectedBrandId === "all" || row.brandId === selectedBrandId;

      const matchesSearch =
        !value ||
        [row.brand, row.line, row.product]
          .join(" ")
          .toLowerCase()
          .includes(value);

      return matchesBrand && matchesSearch;
    });
  }, [searchTerm, selectedBrandId]);

  const columns = useMemo(
    () => [
      {
        field: "brand",
        headerName: "Marca",
        flex: 1,
        minWidth: 150,
      },
      {
        field: "line",
        headerName: "Línea",
        flex: 1,
        minWidth: 150,
      },
      {
        field: "product",
        headerName: "Nombre del producto",
        flex: 1.7,
        minWidth: 260,
      },
      {
        field: "stock",
        headerName: "Stock en almacén",
        flex: 0.9,
        minWidth: 150,
        type: "number",
      },
      {
        field: "unitCost",
        headerName: "Costo unit.",
        flex: 1,
        minWidth: 140,
        valueFormatter: (value) => formatMoney(value),
      },
      {
        field: "costIva",
        headerName: "Costo + IVA",
        flex: 1,
        minWidth: 140,
        valueFormatter: (value) => formatMoney(value),
      },
      {
        field: "executivePercent",
        headerName: "% Ejecutivo",
        flex: 0.9,
        minWidth: 130,
        editable: true,
        valueFormatter: (value) => formatPercent(value),
      },
      {
        field: "executivePrice",
        headerName: "Precio ejecutivo",
        flex: 1,
        minWidth: 160,
        valueFormatter: (value) => formatMoney(value),
      },
      {
        field: "quantityPercent",
        headerName: "% Cantidad",
        flex: 0.9,
        minWidth: 130,
        valueFormatter: (value) => formatPercent(value),
      },
      {
        field: "quantityPrice",
        headerName: "Precio cantidad",
        flex: 1,
        minWidth: 160,
        valueFormatter: (value) => formatMoney(value),
      },
      {
        field: "bossPercent",
        headerName: "% Jefe",
        flex: 0.9,
        minWidth: 120,
        valueFormatter: (value) => formatPercent(value),
      },
      {
        field: "bossPrice",
        headerName: "Precio jefe",
        flex: 1,
        minWidth: 150,
        valueFormatter: (value) => formatMoney(value),
      },
    ],
    []
  );

  return (
    <PageSurface>
      <PageWrapper>
        <HeaderTitle>
          <Title>Márgenes y Utilidades</Title>
          <Subtitle>{fechaHoy()}</Subtitle>
        </HeaderTitle>

        <Toolbar>
          <SearchBox>
            <Search size={18} />

            <SearchInput
              type="text"
              placeholder="Buscar producto, marca o línea"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </SearchBox>
        </Toolbar>

        <FilterButtonGroup>
          {mockBrands.map((brand) => (
            <FilterButton
              key={brand.id}
              type="button"
              $active={selectedBrandId === brand.id}
              onClick={() => setSelectedBrandId(brand.id)}
            >
              {brand.name}
            </FilterButton>
          ))}
        </FilterButtonGroup>

        <DataTable
          rows={filteredRows}
          columns={columns}
          pageSize={7}
          pageSizeOptions={[7, 10, 20]}
          noRowsLabel="No hay productos para mostrar"
        />
      </PageWrapper>
    </PageSurface>
  );
}

export default MarginProfit;
