import { useLoginStore } from "../components/store/loginStore";

export const usePermissions = () => {
  const { level } = useLoginStore();

  const lvl = Number(level);

  const isAdmin = lvl === 1;
  const isSeller = lvl === 4;

  return {
    level: lvl,

    isAdmin,
    isSeller,
    canViewDashboard: isAdmin,
    // 📊 VISIBILIDAD
    canView: true,

    // 🛒 VENTAS / NEGOCIO (lo importante para tu sistema)
    canManageSales: isAdmin || isSeller,
    canSell: isAdmin || isSeller,

    // 📦 PRODUCTOS
    canViewProducts: true,
    canCreateProduct: isAdmin,
    canEditProduct: isAdmin,

    // 👥 CLIENTES
    canViewCustomers: true,
    canManageCustomers: isAdmin,

    // 🧾 DOCUMENTOS
    canViewReceipts: true,
    canViewQuotations: true,

    // 🛠 ADMINISTRACIÓN
    canManageUsers: isAdmin,
    canManageRoles: isAdmin,
    canManageBranches: isAdmin,
    canManageInventory: isAdmin,
    canManageTransfers: isAdmin,
    canManageCosts: isAdmin,

    // 👀 SOLO LECTURA PARA VENDEDOR
    isReadOnly: isSeller,
  };
};
