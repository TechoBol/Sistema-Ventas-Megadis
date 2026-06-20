export const REGIONS = [
  { value: "CHUQUISACA", label: "Chuquisaca" },
  { value: "LA PAZ",     label: "La Paz" },
  { value: "COCHABAMBA", label: "Cochabamba" },
  { value: "TROPICO", label: "Tropico" },
  { value: "ORURO",      label: "Oruro" },
  { value: "POTOSI",     label: "Potosí" },
  { value: "TARIJA",     label: "Tarija" },
  { value: "SANTA CRUZ", label: "Santa Cruz" },
  { value: "BENI",       label: "Beni" },
  { value: "PANDO",      label: "Pando" },
];

export const getRegionLabel = (value) =>
  REGIONS.find((r) => r.value === value)?.label ?? value;