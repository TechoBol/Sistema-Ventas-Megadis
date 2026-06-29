import { useMemo, useState } from "react";
import useSWR from "swr";

import { useLoginStore } from "../components/store/loginStore";
import { getCustomersService } from "../services/customerService";

const fetcher = ([_, token]: [string, string]) => getCustomersService(token);

const mapCustomerToTable = (customer: any) => ({
  id: customer.id,
  name: customer.name ?? "",
  phone: customer.phone ?? "",
  whatsapp: customer.whatsapp ?? "",
  occupation: customer.occupation ?? "",
  originChannel: customer.originChannel ?? "",
  address: customer.address ?? "",
  businessName: customer.businessName ?? "",
  latitude: customer.latitude ?? null,
  longitude: customer.longitude ?? null,
  addresses: customer.addresses ?? [],
  nits: customer.nits ?? [],
  isVisible: customer.isVisible,
  createdAt: customer.createdAt,
});

export const useCustomer = () => {
  const { token } = useLoginStore();

  const [searchTerm, setSearchTerm] = useState("");

  const {
    data = [],
    isLoading,
    error,
    mutate,
  } = useSWR(token ? ["customers", token] : null, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 5000,
  });

  const customers = useMemo(() => {
    return data.map(mapCustomerToTable);
  }, [data]);

  const filteredCustomers = useMemo(() => {
    const value = searchTerm.trim().toLowerCase();

    if (!value) return customers;

    return customers.filter((customer: { name: string; businessName: string; phone: string; address: string; nits: any[]; }) => {
      const nameMatch = customer.name?.trim().toLowerCase() === value;

      const businessMatch =
        customer.businessName?.trim().toLowerCase() === value;

      const phoneMatch = customer.phone?.trim().toLowerCase() === value;

      const addressMatch = customer.address?.trim().toLowerCase() === value;

      const nitMatch = customer.nits.some(
        (nit) =>
          nit.number?.trim().toLowerCase() === value ||
          nit.companyName?.trim().toLowerCase() === value,
      );

      return (
        nameMatch || businessMatch || phoneMatch || addressMatch || nitMatch
      );
    });
  }, [customers, searchTerm]);
  return {
    customers: filteredCustomers,
    searchTerm,
    setSearchTerm,
    isLoading,
    error,
    refresh: mutate,
  };
};
