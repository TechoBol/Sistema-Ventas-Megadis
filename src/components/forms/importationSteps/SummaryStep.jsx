import React, { useMemo } from "react";

import {
  StepPanel,
  SectionHeader,
  StepPanelTitle,
  SummaryCardsGrid,
  SummaryCard,
  SummaryTableWrapper,
  SummaryTable,
  SummaryTableHead,
  SummaryTableRow,
  SummaryTableCell,
  SummaryTableFooter,
} from "../../ui/ImportationWizard.styles";

const roundToFourDecimals = (value) => {
  return Math.round((Number(value || 0) + Number.EPSILON) * 10000) / 10000;
};

const formatUsd = (value) =>
  `$ ${Number(value || 0).toLocaleString("en-US", {
    minimumFractionDigits: 4,
    maximumFractionDigits: 4,
  })}`;

const formatBs = (value) =>
  `Bs ${Number(value || 0).toLocaleString("es-BO", {
    minimumFractionDigits: 4,
    maximumFractionDigits: 4,
  })}`;

const formatQuantity = (value) =>
  Number(value || 0).toLocaleString("en-US", {
    minimumFractionDigits: 4,
    maximumFractionDigits: 4,
  });

const formatFactor = (value) =>
  Number(value || 0).toLocaleString("en-US", {
    minimumFractionDigits: 7,
    maximumFractionDigits: 7,
  });

function SummaryStep({ generalData, products, expenses }) {
  const officialExchangeRate = Number(generalData.officialExchangeRate || 0);

  // Subtotal USD = Cantidad base * Precio USD
  const getProductSubtotal = (product) => {
    const baseQuantity = Number(product.baseQuantity || 0);
    const priceUsd = Number(product.priceUsd || 0);

    return roundToFourDecimals(baseQuantity * priceUsd);
  };

  // Total por grupo de gastos = suma de montos del grupo
  const getSectionTotal = (items = []) => {
    const total = items.reduce((acc, item) => acc + Number(item.amount || 0), 0);

    return roundToFourDecimals(total);
  };

  const totals = useMemo(() => {
    const totalProductsUsd = products.reduce(
      (acc, product) => acc + getProductSubtotal(product),
      0
    );

    const totalBaseQuantity = products.reduce(
      (acc, product) => acc + Number(product.baseQuantity || 0),
      0
    );

    const totalFreights = getSectionTotal(expenses.freights);
    const totalInsurances = getSectionTotal(expenses.insurances);
    const totalPortCosts = getSectionTotal(expenses.portCosts);
    const totalOtherCosts = getSectionTotal(expenses.otherCosts);

    const totalExpensesUsd = roundToFourDecimals(
      totalFreights + totalInsurances + totalPortCosts + totalOtherCosts
    );

    const totalEstimatedUsd = roundToFourDecimals(
      totalProductsUsd + totalExpensesUsd
    );

    const totalEstimatedBs = roundToFourDecimals(
      totalEstimatedUsd * officialExchangeRate
    );

    return {
      totalProductsUsd: roundToFourDecimals(totalProductsUsd),
      totalBaseQuantity,
      totalFreights,
      totalInsurances,
      totalPortCosts,
      totalOtherCosts,
      totalExpensesUsd,
      totalEstimatedUsd,
      totalEstimatedBs,
    };
  }, [products, expenses, officialExchangeRate]);

  const productSummary = useMemo(() => {
    return products.map((product, index) => {
      const baseQuantity = Number(product.baseQuantity || 0);
      const referenceQuantity = Number(product.referenceQuantity || 0);
      const subtotalUsd = getProductSubtotal(product);

      // Factor = Subtotal USD del producto / Total USD general
      const factor =
        totals.totalProductsUsd > 0 ? subtotalUsd / totals.totalProductsUsd : 0;

      const gaPercent = Number(product.gaPercent || 0);
      const gaRate = gaPercent / 100;

      // Gasto asignado = Total gastos importación * Factor
      const assignedExpenseUsd = roundToFourDecimals(
        totals.totalExpensesUsd * factor
      );

      // CIF estimado = Subtotal USD + gasto asignado
      const cifUsd = roundToFourDecimals(subtotalUsd + assignedExpenseUsd);

      // GA USD = CIF estimado * GA %
      const gaUsd = roundToFourDecimals(cifUsd * gaRate);

      // Costo total estimado = CIF estimado + GA
      const estimatedTotalUsd = roundToFourDecimals(cifUsd + gaUsd);

      // Para costo unitario por ahora usamos cantidad referencial si existe;
      // si no existe, usamos cantidad base.
      const quantityForUnitCost = referenceQuantity || baseQuantity;

      const estimatedUnitUsd =
        quantityForUnitCost > 0
          ? roundToFourDecimals(estimatedTotalUsd / quantityForUnitCost)
          : 0;

      const estimatedTotalBs = roundToFourDecimals(
        estimatedTotalUsd * officialExchangeRate
      );

      const estimatedUnitBs =
        quantityForUnitCost > 0
          ? roundToFourDecimals(estimatedTotalBs / quantityForUnitCost)
          : 0;

      return {
        id: index + 1,
        productName: product.productName || "Sin nombre",
        baseQuantity,
        referenceQuantity,
        quantityForUnitCost,
        subtotalUsd,
        factor,
        gaPercent,
        assignedExpenseUsd,
        cifUsd,
        gaUsd,
        estimatedTotalUsd,
        estimatedUnitUsd,
        estimatedTotalBs,
        estimatedUnitBs,
      };
    });
  }, [products, totals, officialExchangeRate]);

  return (
    <StepPanel>
      <SectionHeader>
        <StepPanelTitle>Resumen de importación</StepPanelTitle>
      </SectionHeader>

      <SummaryCardsGrid>
        <SummaryCard>
          <span>Proveedor</span>
          <strong>{generalData.supplier || "Sin proveedor"}</strong>
        </SummaryCard>

        <SummaryCard>
          <span>Referencia</span>
          <strong>{generalData.reference || "Sin referencia"}</strong>
        </SummaryCard>

        <SummaryCard>
          <span>Fecha</span>
          <strong>{generalData.date || "Sin fecha"}</strong>
        </SummaryCard>

        <SummaryCard>
          <span>Cantidad base total</span>
          <strong>{formatQuantity(totals.totalBaseQuantity)}</strong>
        </SummaryCard>

        <SummaryCard>
          <span>Total productos</span>
          <strong>{formatUsd(totals.totalProductsUsd)}</strong>
        </SummaryCard>

        <SummaryCard>
          <span>Total gastos</span>
          <strong>{formatUsd(totals.totalExpensesUsd)}</strong>
        </SummaryCard>

        <SummaryCard $highlight>
          <span>Total estimado USD</span>
          <strong>{formatUsd(totals.totalEstimatedUsd)}</strong>
        </SummaryCard>

        <SummaryCard $highlight>
          <span>Total estimado Bs</span>
          <strong>
            {officialExchangeRate > 0
              ? formatBs(totals.totalEstimatedBs)
              : "Sin tipo de cambio"}
          </strong>
        </SummaryCard>
      </SummaryCardsGrid>

      <SummaryTableWrapper>
        <SummaryTable>
          <SummaryTableHead>
            <span>Producto</span>
            <span>Cant. ref.</span>
            <span>Cant. base</span>
            <span>Subtotal USD</span>
            <span>Factor</span>
            <span>Gasto asignado</span>
            <span>CIF estimado</span>
            <span>GA %</span>
            <span>GA USD</span>
            <span>Costo total USD</span>
            <span>Costo unit. USD</span>
            <span>Costo total Bs</span>
            <span>Costo unit. Bs</span>
          </SummaryTableHead>

          {productSummary.map((item) => (
            <SummaryTableRow key={item.id}>
              <SummaryTableCell>{item.productName}</SummaryTableCell>

              <SummaryTableCell>
                {item.referenceQuantity > 0
                  ? formatQuantity(item.referenceQuantity)
                  : "-"}
              </SummaryTableCell>

              <SummaryTableCell>
                {formatQuantity(item.baseQuantity)}
              </SummaryTableCell>

              <SummaryTableCell>{formatUsd(item.subtotalUsd)}</SummaryTableCell>

              <SummaryTableCell>{formatFactor(item.factor)}</SummaryTableCell>

              <SummaryTableCell>
                {formatUsd(item.assignedExpenseUsd)}
              </SummaryTableCell>

              <SummaryTableCell>{formatUsd(item.cifUsd)}</SummaryTableCell>

              <SummaryTableCell>
                {Number(item.gaPercent || 0).toFixed(2)}%
              </SummaryTableCell>

              <SummaryTableCell>{formatUsd(item.gaUsd)}</SummaryTableCell>

              <SummaryTableCell>
                <strong>{formatUsd(item.estimatedTotalUsd)}</strong>
              </SummaryTableCell>

              <SummaryTableCell>
                <strong>{formatUsd(item.estimatedUnitUsd)}</strong>
              </SummaryTableCell>

              <SummaryTableCell>
                {officialExchangeRate > 0
                  ? formatBs(item.estimatedTotalBs)
                  : "-"}
              </SummaryTableCell>

              <SummaryTableCell>
                {officialExchangeRate > 0
                  ? formatBs(item.estimatedUnitBs)
                  : "-"}
              </SummaryTableCell>
            </SummaryTableRow>
          ))}

          <SummaryTableFooter>
            <span>Total</span>
            <span></span>
            <span>{formatQuantity(totals.totalBaseQuantity)}</span>
            <span>{formatUsd(totals.totalProductsUsd)}</span>
            <span></span>
            <span>{formatUsd(totals.totalExpensesUsd)}</span>
            <span></span>
            <span></span>
            <span></span>
            <span>{formatUsd(totals.totalEstimatedUsd)}</span>
            <span></span>
            <span>
              {officialExchangeRate > 0
                ? formatBs(totals.totalEstimatedBs)
                : "-"}
            </span>
            <span></span>
          </SummaryTableFooter>
        </SummaryTable>
      </SummaryTableWrapper>
    </StepPanel>
  );
}

export default SummaryStep;
