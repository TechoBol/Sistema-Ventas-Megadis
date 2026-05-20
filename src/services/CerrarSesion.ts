import { useLoginStore } from "../components/store/loginStore";
import { errorToast } from "../services/toasts";

export const cerrarSesion = () => {
  useLoginStore.setState({
    fullName: "",
    role: "",
    level: 0,
    location: "",
    isLoggedIn: false,
    token: "",
  });
  errorToast("Sesión expirada");
  return [];
};
