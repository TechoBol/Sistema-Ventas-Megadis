import React, { useState, useEffect } from "react";
import { X, MapPin } from "lucide-react";

import {
  Overlay,
  ModalCard,
  Header,
  Title,
  CloseButton,
  FormGrid,
  Field,
  Label,
  Input,
  FullWidth,
  AddressWrapper,
  LocationButton,
  Footer,
  FinishButton,
  SecondaryButton,
  TotalCard,
  TotalLabel,
  TotalValue,
} from "../ui/CheckoutModal";

const CheckoutModal = ({ open, onClose, onFinish, total }) => {
  const initialCustomerData = {
    name: "",
    nitCi: "",
    businessName: "",
    phone: "",
    address: "",
    latitude: null,
    longitude: null,
  };

  const [customerData, setCustomerData] = useState(initialCustomerData);
  useEffect(() => {
    if (!open) {
      setCustomerData(initialCustomerData);
    }
  }, [open]);
  if (!open) return null;

  const handleChange = (field, value) => {
    setCustomerData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const getLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocalización no soportada");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCustomerData((prev) => ({
          ...prev,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }));
      },

      (error) => {
        console.error(error);

        alert("No se pudo obtener ubicación");
      },
    );
  };

  const handleFinish = () => {
    onFinish(customerData);
  };

  return (
    <Overlay>
      <ModalCard>
        <Header>
          <div>
            <Title>Datos Cliente</Title>
          </div>

          <CloseButton onClick={onClose}>
            <X size={20} />
          </CloseButton>
        </Header>

        <TotalCard>
          <TotalLabel>Total Venta</TotalLabel>

          <TotalValue>Bs {Number(total || 0).toFixed(2)}</TotalValue>
        </TotalCard>

        <FormGrid>
          {/* NOMBRE */}

          <Field>
            <Label>Nombre o Razón Social</Label>

            <Input
              value={customerData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Ingrese nombre del cliente"
            />
          </Field>

          {/* CI NIT */}

          <Field>
            <Label>CI / NIT</Label>

            <Input
              value={customerData.nitCi}
              onChange={(e) => handleChange("nitCi", e.target.value)}
              placeholder="Ingrese CI o NIT"
            />
          </Field>

          {/* PROFESION */}

          <Field>
            <Label>Profesión o Negocio</Label>

            <Input
              value={customerData.businessName}
              onChange={(e) => handleChange("businessName", e.target.value)}
              placeholder="Profesión o negocio"
            />
          </Field>

          {/* TELEFONO */}

          <Field>
            <Label>Teléfono</Label>

            <Input
              value={customerData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              placeholder="+591 70000000"
            />
          </Field>

          {/* DIRECCION */}

          <FullWidth>
            <Label>Dirección</Label>

            <AddressWrapper>
              <Input
                value={customerData.address}
                onChange={(e) => handleChange("address", e.target.value)}
                placeholder="Dirección del domicilio o negocio"
              />

              <LocationButton type="button" onClick={getLocation}>
                <MapPin size={20} />
              </LocationButton>
            </AddressWrapper>
          </FullWidth>
        </FormGrid>

        {/* UBICACION */}

        {customerData.latitude && customerData.longitude && (
          <div
            style={{
              marginTop: 16,
              fontSize: 13,
              color: "#64748b",
            }}
          >
            📍 Ubicación obtenida:
            <br />
            Lat: {customerData.latitude}
            <br />
            Lng: {customerData.longitude}
          </div>
        )}

        <Footer>
          <SecondaryButton onClick={onClose}>Cancelar</SecondaryButton>

          <FinishButton onClick={handleFinish}>Finalizar Venta</FinishButton>
        </Footer>
      </ModalCard>
    </Overlay>
  );
};

export default CheckoutModal;
