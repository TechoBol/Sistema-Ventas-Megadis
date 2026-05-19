import { errorToast } from "../services/toasts";
import { cerrarSesion } from "./CerrarSesion";

export const getProducts = async (token?: string) => {
  try {
    const res = await fetch(
      `${import.meta.env.VITE_API_DOMAIN}/product/get-products`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": token || "",
        },
      },
    );
    if (res.status === 401 || res.status === 403) {
      cerrarSesion();
    }

    if (!res.ok) {
      errorToast("Error al obtener productos");
      return [];
    }

    const data = await res.json();

    return data || [];
  } catch (error) {
    console.error("Error:", error);

    errorToast("Error de conexión");

    return [];
  }
};
