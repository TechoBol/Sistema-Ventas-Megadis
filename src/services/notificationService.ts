import { cerrarSesion } from "./CerrarSesion";

const BASE = `${import.meta.env.VITE_API_DOMAIN}/notifications`;

export const getAllNotificationsService = async (
  employeeId: number,
  token: string,
) => {
  const res = await fetch(`${BASE}/${employeeId}`, {
    headers: { "x-access-token": token },
  });

  if (res.status === 401 || res.status === 403) cerrarSesion();

  const resData = await res.json();
  if (!res.ok)
    throw new Error(resData.error || "Error al obtener notificaciones");
  return resData;
};

export const getUnreadCountService = async (
  employeeId: number,
  token: string,
) => {
  const res = await fetch(`${BASE}/${employeeId}/unread-count`, {
    headers: { "x-access-token": token },
  });

  if (res.status === 401 || res.status === 403) cerrarSesion();

  const resData = await res.json();
  if (!res.ok) throw new Error(resData.error || "Error al obtener conteo");
  return resData; // { count: number }
};

export const markNotificationAsReadService = async (
  employeeId: number,
  notificationId: number,
  token: string,
) => {
  const res = await fetch(`${BASE}/${employeeId}/${notificationId}/read`, {
    method: "PATCH",
    headers: { "x-access-token": token },
  });

  if (res.status === 401 || res.status === 403) cerrarSesion();

  const resData = await res.json();
  if (!res.ok) throw new Error(resData.error || "Error al marcar notificación");
  return resData; // { success: true }
};

export const markAllNotificationsAsReadService = async (
  employeeId: number,
  token: string,
) => {
  const res = await fetch(`${BASE}/${employeeId}/read-all`, {
    method: "PATCH",
    headers: { "x-access-token": token },
  });

  if (res.status === 401 || res.status === 403) cerrarSesion();

  const resData = await res.json();
  if (!res.ok)
    throw new Error(
      resData.error || "Error al marcar todas las notificaciones",
    );
  return resData; // { success: true }
};
