import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useLoginStore } from "../components/store/loginStore";
import { useLocationStore } from "../components/store/locationStore";
import { usePermissions } from "./usePermissions";
import { getDashboardSummaryService } from "../services/dashboardService";
import { socket } from "../services/SocketIOConnection";

export const useDashboard = () => {
  const { token, location: userLocation } = useLoginStore();
  const { selectedLocation } = useLocationStore();
  const permissions = usePermissions();
  const queryClient = useQueryClient();

  const isGeneral = (permissions.isAdmin || permissions.isManager) && selectedLocation === null;

  const activeLocation =
    permissions.isAdmin || permissions.isManager
      ? selectedLocation
      : userLocation;

  const locationId = activeLocation?.id ?? null;

  const { data, isLoading } = useQuery({
    queryKey: ["dashboard", isGeneral ? "general" : locationId],
    queryFn: () => getDashboardSummaryService(token, isGeneral ? null : locationId),
    enabled: isGeneral || !!locationId,
    staleTime: 1000 * 30,
    gcTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    const handleVenta = () => {
      void queryClient.invalidateQueries({ queryKey: ["dashboard", isGeneral ? "general" : locationId] });
    };

    socket.on("cartProduct", handleVenta);
    return () => socket.off("cartProduct", handleVenta);
  }, [queryClient, locationId]);

  return {
    data,
    isLoading: isLoading || (!isGeneral && !locationId),
    refresh: () => queryClient.invalidateQueries({ queryKey: ["dashboard", locationId] }),
  };
};