import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { successToast, errorToast } from "../services/toasts";
import { useLoginStore } from "../components/store/loginStore";
import { logInAuth } from "../services/AuthenticationService";
import { socket } from "../services/SocketIOConnection";

const useAuthentication = () => {
  const navigate = useNavigate();

  const {
    setFullName,
    setRole,
    changeLogInState,
    setToken,
    setLocation,
    setLevel,
    setEmployeeId,
  } = useLoginStore();

  const [isLoading, setIsLoading] = useState(false);

  /* LOGIN */
  const signIn = async (email: string, password: string) => {
    // VALIDACIÓN
    if (!email || !password) {
      errorToast("Ingresa tu correo y contraseña.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await logInAuth(email, password);
      // SI FALLA LOGIN
      if (!response) {
        return;
      }
      // GUARDAR DATOS
      setFullName(`${response.name} ${response.lastName}`);
      setToken(response.token);
      setRole(response.role);
      setLevel(response.level);
      setLocation(response.location);
      setEmployeeId(response.id);
      changeLogInState();
      console.log(response)
      // TOAST
      successToast("¡Bienvenido!");
      const level = Number(response.level);
      // REDIRECCIÓN
      if (level === 4) {
        navigate("/products");
      } else {
        navigate("/dashboard");
      }
      socket.emit("joinEmployeeRoom", response.id);
    } catch (error) {
      console.error("Error en login:", error);
      errorToast("Ocurrió un error inesperado");
    } finally {
      setIsLoading(false);
    }
  };

  /* LOGOUT */
  const logOut = () => {
    setFullName("");
    setRole("");
    setLevel(0);
    setToken("");
    setLocation("");
    setEmployeeId(0);
    changeLogInState();

    successToast("Sesión cerrada");

    navigate("/login");
  };

  const redirect = () => {
    window.location.href = import.meta.env.VITE_FRONTED_DOMAIN_TESORERIA;
  };

  return {
    signIn,
    logOut,
    redirect,
    isLoading,
  };
};

export default useAuthentication;
