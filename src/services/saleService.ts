import { cerrarSesion } from "./CerrarSesion";

const API = import.meta.env.VITE_API_DOMAIN;

export const getSalesService = async (token: string) => {
  const res = await fetch(`${API}/sale/get-sales`, {
    headers: {
      "x-access-token": token,
    },
  });
  if (res.status === 401 || res.status === 403) {
    cerrarSesion();
  }
  return res.json();
};

export const updateSaleService = async (
  token: string,
  id: number,
  typeSale: string,
) => {
  const res = await fetch(`${API}/sale/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
    body: JSON.stringify({ typeSale }),
  });
  if (res.status === 401 || res.status === 403) {
    cerrarSesion();
  }
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Error al actualizar");
  return data;
};

export const updateDateSaleService = async (
  token: string,
  id: number,
  date: string,
) => {
  const res = await fetch(`${API}/sale/date/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
    body: JSON.stringify({ date }),
  });
  if (res.status === 401 || res.status === 403) {
    cerrarSesion();
  }
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Error al actualizar fecha");
  return data;
};

export const deliverSaleProductsService = async (
  token: string,
  saleId: number,
) => {
  const res = await fetch(
    `${API}/sale/${saleId}/deliver`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": token,
      },
    },
  );

  if (res.status === 401 || res.status === 403) {
    cerrarSesion();
  }

  const data = await res.json();

  if (!res.ok) {
    throw new Error(
      data.message || "Error al marcar productos como entregados",
    );
  }

  return data;
};