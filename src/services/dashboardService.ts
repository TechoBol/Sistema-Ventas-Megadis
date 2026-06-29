import { cerrarSesion } from "./CerrarSesion";

const API = import.meta.env.VITE_API_DOMAIN;

export const getDashboardSummaryService = async (
  token: string,
  locationId?: number | null,
) => {
  const url = locationId
    ? `${API}/dashboard/summary?locationId=${locationId}`
    : `${API}/dashboard/general`;

  const res = await fetch(url, {
    headers: { "x-access-token": token },
  });
  if (res.status === 401 || res.status === 403) {
    cerrarSesion();
  }

  return res.json();
};
