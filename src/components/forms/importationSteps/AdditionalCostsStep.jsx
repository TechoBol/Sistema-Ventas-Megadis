import React, { useMemo } from "react";
import { Plus, Trash2 } from "lucide-react";

import {
  StepPanel,
  SectionHeader,
  StepPanelTitle,
  AddButton,
  AdditionalCostsTableWrapper,
  AdditionalCostsTableHeader,
  AdditionalCostsTableRow,
  WizardInput,
  WizardSelect,
  CreditCheckLabel,
  IconButton,
  AdditionalCostsTotals,
} from "../../ui/ImportationWizard.styles";

const emptyAdditionalCost = {
  concept: "",
  amount: "",
  currency: "USD",
  hasFiscalCredit: false,
  creditRate: "13",
};

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

function AdditionalCostsStep({
  additionalCosts,
  onChangeAdditionalCosts,
  officialExchangeRate,
}) {
  const exchangeRate = Number(officialExchangeRate || 0);

  const getCostCalculation = (cost) => {
    const amount = Number(cost.amount || 0);
    const creditRate = Number(cost.creditRate || 0) / 100;

    const amountUsd =
      cost.currency === "USD"
        ? roundToFourDecimals(amount)
        : exchangeRate > 0
          ? roundToFourDecimals(amount / exchangeRate)
          : 0;

    const amountBs =
      cost.currency === "BS"
        ? roundToFourDecimals(amount)
        : roundToFourDecimals(amount * exchangeRate);

    const fiscalCreditBs = cost.hasFiscalCredit
      ? roundToFourDecimals(amountBs * creditRate)
      : 0;

    const netAmountBs = roundToFourDecimals(amountBs - fiscalCreditBs);

    return {
      amountUsd,
      amountBs,
      fiscalCreditBs,
      netAmountBs,
    };
  };

  const totals = useMemo(() => {
    return additionalCosts.reduce(
      (acc, cost) => {
        const calculation = getCostCalculation(cost);

        return {
          amountUsd: roundToFourDecimals(acc.amountUsd + calculation.amountUsd),
          amountBs: roundToFourDecimals(acc.amountBs + calculation.amountBs),
          fiscalCreditBs: roundToFourDecimals(
            acc.fiscalCreditBs + calculation.fiscalCreditBs
          ),
          netAmountBs: roundToFourDecimals(
            acc.netAmountBs + calculation.netAmountBs
          ),
        };
      },
      {
        amountUsd: 0,
        amountBs: 0,
        fiscalCreditBs: 0,
        netAmountBs: 0,
      }
    );
  }, [additionalCosts, exchangeRate]);

  const handleChange = (index, field, value) => {
    const updatedCosts = additionalCosts.map((cost, costIndex) =>
      costIndex === index
        ? {
            ...cost,
            [field]: value,
          }
        : cost
    );

    onChangeAdditionalCosts(updatedCosts);
  };

  const handleCheckChange = (index, checked) => {
    const updatedCosts = additionalCosts.map((cost, costIndex) =>
      costIndex === index
        ? {
            ...cost,
            hasFiscalCredit: checked,
          }
        : cost
    );

    onChangeAdditionalCosts(updatedCosts);
  };

  const handleAddCost = () => {
    onChangeAdditionalCosts([...additionalCosts, { ...emptyAdditionalCost }]);
  };

  const handleRemoveCost = (index) => {
    if (additionalCosts.length === 1) return;

    const updatedCosts = additionalCosts.filter(
      (_, costIndex) => costIndex !== index
    );

    onChangeAdditionalCosts(updatedCosts);
  };

  return (
    <StepPanel>
      <SectionHeader>
        <div>
          <StepPanelTitle>Gastos adicionales de importación</StepPanelTitle>
        </div>

        <AddButton type="button" onClick={handleAddCost}>
          <Plus size={15} />
          Agregar gasto
        </AddButton>
      </SectionHeader>

      <AdditionalCostsTableWrapper>
        <AdditionalCostsTableHeader>
          <span>Concepto</span>
          <span>Monto</span>
          <span>Moneda</span>
          <span>Importe USD</span>
          <span>Importe Bs</span>
          <span>Crédito fiscal</span>
          <span>Crédito fiscal Bs</span>
          <span>Importe neto Bs</span>
          <span></span>
        </AdditionalCostsTableHeader>

        {additionalCosts.map((cost, index) => {
          const calculation = getCostCalculation(cost);

          return (
            <AdditionalCostsTableRow key={index}>
              <WizardInput
                type="text"
                placeholder="Concepto del gasto..."
                value={cost.concept}
                onChange={(event) =>
                  handleChange(index, "concept", event.target.value)
                }
              />

              <WizardInput
                type="number"
                min="0"
                step="0.0001"
                placeholder="0"
                value={cost.amount}
                onChange={(event) =>
                  handleChange(index, "amount", event.target.value)
                }
              />

              <WizardSelect
                value={cost.currency}
                onChange={(event) =>
                  handleChange(index, "currency", event.target.value)
                }
              >
                <option value="USD">USD</option>
                <option value="BS">Bs</option>
              </WizardSelect>

              <strong>{formatUsd(calculation.amountUsd)}</strong>

              <strong>{formatBs(calculation.amountBs)}</strong>

              <CreditCheckLabel>
                <input
                  type="checkbox"
                  checked={cost.hasFiscalCredit}
                  onChange={(event) =>
                    handleCheckChange(index, event.target.checked)
                  }
                />

                <span>Aplica</span>

                <WizardInput
                  type="number"
                  min="0"
                  step="0.01"
                  value={cost.creditRate}
                  disabled={!cost.hasFiscalCredit}
                  onChange={(event) =>
                    handleChange(index, "creditRate", event.target.value)
                  }
                />
              </CreditCheckLabel>

              <strong>{formatBs(calculation.fiscalCreditBs)}</strong>

              <strong>{formatBs(calculation.netAmountBs)}</strong>

              <IconButton
                type="button"
                title="Eliminar gasto"
                disabled={additionalCosts.length === 1}
                onClick={() => handleRemoveCost(index)}
              >
                <Trash2 size={16} />
              </IconButton>
            </AdditionalCostsTableRow>
          );
        })}
      </AdditionalCostsTableWrapper>

      <AdditionalCostsTotals>
        <div>
          <span>Total importe USD:</span>
          <strong>{formatUsd(totals.amountUsd)}</strong>
        </div>

        <div>
          <span>Total importe Bs:</span>
          <strong>{formatBs(totals.amountBs)}</strong>
        </div>

        <div>
          <span>Total crédito fiscal:</span>
          <strong>{formatBs(totals.fiscalCreditBs)}</strong>
        </div>

        <div className="highlight">
          <span>Total neto distribuible:</span>
          <strong>{formatBs(totals.netAmountBs)}</strong>
        </div>
      </AdditionalCostsTotals>
    </StepPanel>
  );
}

export default AdditionalCostsStep;
