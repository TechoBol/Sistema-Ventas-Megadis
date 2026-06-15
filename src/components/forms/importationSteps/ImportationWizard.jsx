import React, { useState } from "react";
import { ArrowLeft, Check, ChevronLeft, ChevronRight } from "lucide-react";
import GeneralDataStep from "./GeneralDataStep";
import ProductsStep from "./ProductsStep";
import ExpensesStep from "./ExpensesStep";
import SummaryStep from "./SummaryStep";
import BanksStep, { emptyBankPayment } from "./BanksStep";
import AdditionalCostsStep from "./AdditionalCostsStep";
import FinalCostStep from "./FinalCostStep";
import {
  WizardCard,
  WizardHeader,
  WizardHeaderLeft,
  WizardBackButton,
  WizardTitle,
  WizardTitleBlock,
  WizardSubtitle,
  StepperWrapper,
  StepItem,
  StepCircle,
  StepLabel,
  StepConnector,
  StepContent,
  StepActions,
  StepActionsRight,
  StepSecondaryButton,
  StepPrimaryButton,
  ConfirmOverlay,
  ConfirmDialog,
  ConfirmTitle,
  ConfirmText,
  ConfirmActions,
} from "../../ui/ImportationWizard.styles";

const STEPS = [
  "Datos generales",
  "Productos",
  "Gastos base",
  "Base imponible e impuestos",
  "Pagos bancarios",
  "Gastos adicionales",
  "Costo final",
];

const emptyProduct = {
  productId: null,
  productCode: "",
  productName: "",
  referenceQuantity: "",
  baseQuantity: "",
  priceUsd: "",
  gaPercent: "",
};

const createDefaultExpenses = () => ({
  freights: [
    { name: "Flete Naviero (FLETE I)", amount: "" },
    { name: "Flete terrestre Frontera FLETE(II)", amount: "" },
  ],
  insurances: [{ name: "Seguro", amount: "" }],
  portCosts: [{ name: "", amount: "" }],
  otherCosts: [{ name: "", amount: "" }],
});

const createDefaultAdditionalCosts = () => [
  {
    concept: "Comisión aduana por despacho",
    amount: "",
    currency: "USD",
    hasFiscalCredit: false,
    creditRate: "13",
    source: "MANUAL",
  },
  {
    concept: "Impuestos globales",
    amount: "",
    currency: "USD",
    hasFiscalCredit: false,
    creditRate: "13",
    source: "MANUAL",
  },
  {
    concept: "Flete PISIGA-CBBA",
    amount: "",
    currency: "USD",
    hasFiscalCredit: false,
    creditRate: "13",
    source: "MANUAL",
  },
  {
    concept: "SAMC",
    amount: "",
    currency: "BS",
    hasFiscalCredit: false,
    creditRate: "13",
    source: "MANUAL",
  },
  {
    concept: "Gate In devolución",
    amount: "",
    currency: "BS",
    hasFiscalCredit: false,
    creditRate: "13",
    source: "MANUAL",
  },
  {
    concept: "Emisión de documentos",
    amount: "",
    currency: "USD",
    hasFiscalCredit: false,
    creditRate: "13",
    source: "MANUAL",
  },
  {
    concept: "Pago transporte interno diferencia",
    amount: "",
    currency: "USD",
    hasFiscalCredit: false,
    creditRate: "13",
    source: "MANUAL",
  },
];

const createDefaultBankPayments = () => [
  {
    ...emptyBankPayment,
    bankExchangeRate: "",
  },
];

const createDefaultBankFiscalCredit = () => ({
  commission: {
    hasFiscalCredit: false,
    creditRate: "13",
  },
  itf: {
    hasFiscalCredit: false,
    creditRate: "13",
  },
  /* tipo de cambio */
  exchangeDifference: {
    hasFiscalCredit: false,
    creditRate: "13",
  },
});

const getDateInputValue = (value) => {
  if (!value) return "";
  const [datePart] = String(value).split("T");
  return datePart || "";
};

const mapApiDataToWizardState = (importation) => {
  const snapshot = importation?.snapshot ?? {};

  const officialExchangeRate = importation?.officialExchangeRate
    ? String(importation.officialExchangeRate)
    : "6.96";

  const savedProducts = Array.isArray(snapshot.products)
    ? snapshot.products
    : [];

  const savedBankPayments = Array.isArray(
    snapshot.bankPayments?.payments
  )
    ? snapshot.bankPayments.payments
    : [];

  /*
   * Se filtran posibles filas bancarias antiguas para evitar que
   * "Comisiones bancarias" e "ITF" se dupliquen al recalcularse.
   */
  const savedAdditionalCosts = Array.isArray(snapshot.additionalCosts)
    ? snapshot.additionalCosts.filter(
        (cost) => cost?.source !== "BANK"
      )
    : [];

  return {
    generalData: {
      supplier: importation?.supplierName || "",
      reference: importation?.referenceNumber || "",
      date: getDateInputValue(importation?.importationDate),
      officialExchangeRate,
      maritimeFreightExchangeRate:
        snapshot.exchangeDifference?.maritimeFreightExchangeRate
          ? String(snapshot.exchangeDifference.maritimeFreightExchangeRate)
          : "",
    },

    products:
      savedProducts.length > 0
        ? savedProducts.map((product) => ({
            productId: product.productId ?? null,
            productCode: product.productCode || "",
            productName: product.productName || "",
            referenceQuantity:
              product.referenceQuantity ?? "",
            baseQuantity: product.baseQuantity ?? "",
            priceUsd: product.priceUsd ?? "",
            gaPercent: product.gaPercent ?? "",
          }))
        : [{ ...emptyProduct }],

    expenses: {
      freights:
        snapshot.baseExpenses?.freights?.length > 0
          ? snapshot.baseExpenses.freights.map((item) => ({
              name: item.name || "",
              amount: item.amountUsd ?? item.amount ?? "",
            }))
          : createDefaultExpenses().freights,

      insurances:
        snapshot.baseExpenses?.insurances?.length > 0
          ? snapshot.baseExpenses.insurances.map((item) => ({
              name: item.name || "",
              amount: item.amountUsd ?? item.amount ?? "",
            }))
          : createDefaultExpenses().insurances,

      portCosts:
        snapshot.baseExpenses?.portCosts?.length > 0
          ? snapshot.baseExpenses.portCosts.map((item) => ({
              name: item.name || "",
              amount: item.amountUsd ?? item.amount ?? "",
            }))
          : createDefaultExpenses().portCosts,

      otherCosts:
        snapshot.baseExpenses?.otherCosts?.length > 0
          ? snapshot.baseExpenses.otherCosts.map((item) => ({
              name: item.name || "",
              amount: item.amountUsd ?? item.amount ?? "",
            }))
          : createDefaultExpenses().otherCosts,
    },

    bankPayments:
      savedBankPayments.length > 0
        ? savedBankPayments.map((payment) => ({
            paymentType:
              payment.paymentType || "PAYMENT",
            date: payment.date || "",
            bankName: payment.bankName || "",
            amountUsd: payment.amountUsd ?? "",
            bankExchangeRate:
              payment.bankExchangeRate ?? officialExchangeRate,
            commissionUsd:
              payment.commissionUsd ?? "",
            itfEntryUsd: payment.itfEntryUsd ?? "",
          }))
        : createDefaultBankPayments(),

    bankFiscalCredit: {
      commission: {
        hasFiscalCredit: Boolean(snapshot.bankFiscalCredit?.commission?.hasFiscalCredit),
        creditRate: String(snapshot.bankFiscalCredit?.commission?.creditRate ?? "13"),
      },
      itf: {
        hasFiscalCredit: Boolean(snapshot.bankFiscalCredit?.itf?.hasFiscalCredit),
        creditRate: String(snapshot.bankFiscalCredit?.itf?.creditRate ?? "13"),
      },
      /* tipo de cambio */
      exchangeDifference: {
        hasFiscalCredit: Boolean(snapshot.bankFiscalCredit?.exchangeDifference?.hasFiscalCredit),
        creditRate: String(snapshot.bankFiscalCredit?.exchangeDifference?.creditRate ?? "13"),
      },
    },

    additionalCosts:
      savedAdditionalCosts.length > 0
        ? savedAdditionalCosts.map((cost) => ({
            concept: cost.concept || "",
            amount: cost.amount ?? "",
            currency: cost.currency || "BS",
            hasFiscalCredit: Boolean(
              cost.hasFiscalCredit
            ),
            creditRate:
              cost.fiscalCreditPercent ??
              cost.creditRate ??
              "",
            source: cost.source || "MANUAL",
          }))
        : createDefaultAdditionalCosts(),
  };
};

const createInitialWizardState = () => ({
  generalData: {
    supplier: "",
    reference: "",
    date: "",
    officialExchangeRate: "6.96",
    maritimeFreightExchangeRate: "",
  },
  products: [{ ...emptyProduct }],
  expenses: createDefaultExpenses(),
  bankPayments: createDefaultBankPayments(),
  bankFiscalCredit: createDefaultBankFiscalCredit(),
  additionalCosts: createDefaultAdditionalCosts(),
});

function ImportationWizard({
  mode = "create",
  initialData = null,
  onCancel,
  onSubmit,
}) {
  const initialWizardState =
    mode === "edit" && initialData
      ? mapApiDataToWizardState(initialData)
      : createInitialWizardState();
  const [currentStep, setCurrentStep] = useState(0);
  const [generalData, setGeneralData] = useState(
    initialWizardState.generalData
  );

  const [products, setProducts] = useState(
    initialWizardState.products
  );

  const [expenses, setExpenses] = useState(
    initialWizardState.expenses
  );

  const [bankPayments, setBankPayments] = useState(
    initialWizardState.bankPayments
  );

  const [bankFiscalCredit, setBankFiscalCredit] = useState(
    initialWizardState.bankFiscalCredit
  );

  const [additionalCosts, setAdditionalCosts] = useState(
    initialWizardState.additionalCosts
  );

  /* estados para mensaje de confirmacion de guardado */
  const [showVerifyConfirm, setShowVerifyConfirm] = useState(false);

  const handleGeneralDataChange = (field, value) => {
    setGeneralData((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleNextStep = () => {
    setCurrentStep((current) =>
      Math.min(current + 1, STEPS.length - 1)
    );
  };

  const handlePrevStep = () => {
    setCurrentStep((current) =>
      Math.max(current - 1, 0)
    );
  };

  const handleGoToStep = (stepIndex) => {
    setCurrentStep(stepIndex);
  };

  const handleSubmit = (status) => {
    const payload = {
      status,
      generalData,
      products,
      expenses,
      bankPayments,
      bankFiscalCredit,
      additionalCosts,
    };
    onSubmit?.(payload);
  };

  const renderStepContent = () => {
    // Paso 1: Datos generales
    if (currentStep === 0) {
      return (
        <GeneralDataStep
          formData={generalData}
          onChange={handleGeneralDataChange}
        />
      );
    }
    // Paso 2: Productos
    if (currentStep === 1) {
      return (
        <ProductsStep
          products={products}
          onChangeProducts={setProducts}
        />
      );
    }
    // Paso 3: Gastos base
    if (currentStep === 2) {
      return (
        <ExpensesStep
          expenses={expenses}
          onChangeExpenses={setExpenses}
        />
      );
    }
    // Paso 4: Base imponible e impuestos
    if (currentStep === 3) {
      return (
        <SummaryStep
          generalData={generalData}
          products={products}
          expenses={expenses}
        />
      );
    }
    // Paso 5: Pagos bancarios
    if (currentStep === 4) {
      return (
        <BanksStep
          bankPayments={bankPayments}
          onChangeBankPayments={setBankPayments}
          officialExchangeRate={generalData.officialExchangeRate}
          products={products}
          expenses={expenses}
          maritimeFreightExchangeRate={generalData.maritimeFreightExchangeRate}
          onChangeMaritimeFreightExchangeRate={(value) =>
            handleGeneralDataChange("maritimeFreightExchangeRate", value)
          }
        />
      );
    }
    // Paso 6: Gastos adicionales
    if (currentStep === 5) {
      return (
        <AdditionalCostsStep
          additionalCosts={additionalCosts}
          onChangeAdditionalCosts={setAdditionalCosts}
          officialExchangeRate={generalData.officialExchangeRate}
          bankPayments={bankPayments}
          bankFiscalCredit={bankFiscalCredit}
          onChangeBankFiscalCredit={setBankFiscalCredit}
        />
      );
    }
    // Paso 7: Costo final
    return (
      <FinalCostStep
        generalData={generalData}
        products={products}
        expenses={expenses}
        bankPayments={bankPayments}
        bankFiscalCredit={bankFiscalCredit}
        additionalCosts={additionalCosts}
      />
    );
  };

  return (
    <WizardCard>
      <WizardHeader>
        <WizardHeaderLeft>
          <WizardBackButton
            type="button"
            onClick={onCancel}
          >
            <ArrowLeft size={20} />
          </WizardBackButton>

          <WizardTitleBlock>
            <WizardTitle>
              {mode === "edit"
                ? "Editar importación"
                : "Nueva importación"}
            </WizardTitle>
            <WizardSubtitle>
              {generalData.reference
                ? `Factura / Referencia: ${generalData.reference}`
                : "Factura / Referencia: Sin referencia"}
            </WizardSubtitle>
          </WizardTitleBlock>
        </WizardHeaderLeft>
      </WizardHeader>

      <StepperWrapper>
        {STEPS.map((step, index) => {
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;
          return (
            <React.Fragment key={step}>
              <StepItem>
                <StepCircle
                  type="button"
                  $active={isActive}
                  $completed={isCompleted}
                  onClick={() => handleGoToStep(index)}
                  title={`Ir a ${step}`}
                >
                  {isCompleted ? (
                    <Check size={15} />
                  ) : (
                    index + 1
                  )}
                </StepCircle>

                <StepLabel $active={isActive}>
                  {step}
                </StepLabel>
              </StepItem>

              {index < STEPS.length - 1 && (
                <StepConnector
                  $completed={index < currentStep}
                />
              )}
            </React.Fragment>
          );
        })}
      </StepperWrapper>

      <StepContent>
        {renderStepContent()}
      </StepContent>

      <StepActions>
        {currentStep > 0 ? (
          <StepSecondaryButton
            type="button"
            onClick={handlePrevStep}
          >
            <ChevronLeft size={17} />
            Anterior
          </StepSecondaryButton>
        ) : (
          <div />
        )}

        <StepActionsRight>
          {currentStep < STEPS.length - 1 ? (
            <StepPrimaryButton
              type="button"
              onClick={handleNextStep}
            >
              Siguiente
              <ChevronRight size={17} />
            </StepPrimaryButton>
          ) : (
            <>
              <StepSecondaryButton type="button" onClick={() => handleSubmit("borrador")}>
                Guardar borrador
              </StepSecondaryButton>
              <StepPrimaryButton type="button" onClick={() => setShowVerifyConfirm(true)}>
                Guardar verificado
              </StepPrimaryButton>
            </>
          )}
        </StepActionsRight>
      </StepActions>
      {/* modal mensaje de confirmacion de guerdado */}
      {showVerifyConfirm && (
        <ConfirmOverlay>
          <ConfirmDialog>
            <ConfirmTitle>Confirmar verificación</ConfirmTitle>
            <ConfirmText>
              Al guardar esta importación como verificada, ya no podrá editarse
              posteriormente. Revisa que los datos, pagos, gastos y costos finales
              sean correctos antes de continuar.
            </ConfirmText>
            <ConfirmActions>
              <StepSecondaryButton type="button" onClick={() => setShowVerifyConfirm(false)}>
                Cancelar
              </StepSecondaryButton>
              <StepPrimaryButton
                type="button"
                onClick={() => {
                  setShowVerifyConfirm(false);
                  handleSubmit("verificado");
                }}
              >
                Guardar
              </StepPrimaryButton>
            </ConfirmActions>
          </ConfirmDialog>
        </ConfirmOverlay>
      )}
    </WizardCard>
  );
}

export default ImportationWizard;
