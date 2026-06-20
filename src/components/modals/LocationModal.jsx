import React, { useEffect, useState } from "react";
import { ChevronDown, X, Building2, Tag, Layers, Map, MapPin, Save } from "lucide-react";
import { REGIONS } from "../../constants/regions";
import {
  ModalOverlay,
  ModalCard,
  ModalHeader,
  ModalHeaderLeft,
  ModalIconBadge,
  ModalTitleGroup,
  ModalTitle,
  ModalSubtitle,
  Form,
  FormBody,
  Field,
  Label,
  InputWrapper,
  InputIcon,
  Input,
  SelectWrapper,
  Select,
  SelectIcon,
  SelectIconLeft,
  FieldsGrid,
  FullWidthField,
  Actions,
  CancelButton,
  SaveButton,
  CloseButton,
} from "../ui/LocationModal";

const emptyForm = {
  name: "",
  abbreviation: "",
  type: "",
  address: "",
  region: "",
};

function LocationModal({
  open,
  mode = "create",
  initialData = null,
  onClose,
  onSubmit,
  loading = false,
}) {
  const [formData, setFormData] = useState(emptyForm);

  const isEditMode = mode === "edit";

  useEffect(() => {
    if (!open) return;

    if (initialData) {
      setFormData({
        name: initialData.name || "",
        abbreviation: initialData.abbreviation || "",
        type: initialData.typeValue || initialData.type || "",
        address:
          initialData.address === "Sin dirección" ? "" : initialData.address || "",
        region: initialData.regionValue || initialData.region || "",
      });
    } else {
      setFormData(emptyForm);
    }
  }, [open, initialData]);

  if (!open) return null;

  const handleChange = (field, value) => {
    setFormData((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const payload = {
      name: formData.name.trim(),
      abbreviation: formData.abbreviation.trim().toUpperCase(),
      type: formData.type,
      address: formData.address.trim() || null,
      region: formData.region || null,
    };

    onSubmit?.(payload);
  };

  return (
    <ModalOverlay onMouseDown={onClose}>
      <ModalCard onMouseDown={(e) => e.stopPropagation()}>

        {/* ── Header ── */}
        <ModalHeader>
          <ModalHeaderLeft>
            <ModalIconBadge>
              <Building2 size={20} />
            </ModalIconBadge>
            <ModalTitleGroup>
              <ModalTitle>
                {isEditMode ? "Editar Sucursal" : "Nueva Sucursal"}
              </ModalTitle>
              <ModalSubtitle>
                {isEditMode
                  ? "Modifica los datos de la sucursal"
                  : "Completa los datos de la sucursal"}
              </ModalSubtitle>
            </ModalTitleGroup>
          </ModalHeaderLeft>

          <CloseButton type="button" onClick={onClose}>
            <X size={16} />
          </CloseButton>
        </ModalHeader>

        {/* ── Form ── */}
        <Form onSubmit={handleSubmit}>
          <FormBody>

            {/* Nombre + Abreviación */}
            <FieldsGrid $columns={2}>
              <Field>
                <Label>Nombre</Label>
                <InputWrapper>
                  <InputIcon><Tag size={15} /></InputIcon>
                  <Input
                    $hasIcon
                    type="text"
                    placeholder="Ej. Sucursal Centro"
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                  />
                </InputWrapper>
              </Field>

              <Field>
                <Label>Abreviación</Label>
                <InputWrapper>
                  <InputIcon><Layers size={15} /></InputIcon>
                  <Input
                    $hasIcon
                    type="text"
                    placeholder="Ej. SC"
                    value={formData.abbreviation}
                    onChange={(e) =>
                      handleChange("abbreviation", e.target.value.toUpperCase())
                    }
                  />
                </InputWrapper>
              </Field>
            </FieldsGrid>

            {/* Tipo + Región */}
            <FieldsGrid $columns={2}>
              <Field>
                <Label>Tipo de sucursal</Label>
                <SelectWrapper>
                  <SelectIconLeft><Building2 size={15} /></SelectIconLeft>
                  <Select
                    value={formData.type}
                    onChange={(e) => handleChange("type", e.target.value)}
                  >
                    <option value="" disabled>Seleccione</option>
                    <option value="BRANCH">Sucursal</option>
                    <option value="WAREHOUSE">Almacén</option>
                  </Select>
                  <SelectIcon><ChevronDown size={16} /></SelectIcon>
                </SelectWrapper>
              </Field>

              <Field>
                <Label>Región</Label>
                <SelectWrapper>
                  <SelectIconLeft><Map size={15} /></SelectIconLeft>
                  <Select
                    value={formData.region}
                    onChange={(e) => handleChange("region", e.target.value)}
                  >
                    <option value="" disabled>Seleccione</option>
                    {REGIONS.map((r) => (
                      <option key={r.value} value={r.value}>
                        {r.label}
                      </option>
                    ))}
                  </Select>
                  <SelectIcon><ChevronDown size={16} /></SelectIcon>
                </SelectWrapper>
              </Field>
            </FieldsGrid>

            {/* Dirección */}
            <Field>
              <Label>Dirección</Label>
              <InputWrapper>
                <InputIcon><MapPin size={15} /></InputIcon>
                <Input
                  $hasIcon
                  type="text"
                  placeholder="Calle, número, ciudad"
                  value={formData.address}
                  onChange={(e) => handleChange("address", e.target.value)}
                />
              </InputWrapper>
            </Field>

          </FormBody>

          {/* ── Footer ── */}
          <Actions>
            <CancelButton type="button" onClick={onClose}>
              Cancelar
            </CancelButton>
            <SaveButton type="submit" disabled={loading}>
              <Save size={15} />
              {loading ? "Guardando..." : "Guardar sucursal"}
            </SaveButton>
          </Actions>
        </Form>

      </ModalCard>
    </ModalOverlay>
  );
}

export default LocationModal;