import { useEffect, useState } from "react";
import { useLoginStore } from "../components/store/loginStore";
import { getSalesService } from "../services/saleService";
import { useNavigate } from "react-router-dom";
import { socket } from "../services/SocketIOConnection";
import { deliverSaleProductsService } from "../services/saleService";

export const useSales = () => {
  const { token } = useLoginStore();
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  const goToSales = () => {
    navigate("/reports");
  };

  const getSales = async () => {
    const res = await getSalesService(token);
    setData(res);
  };

  useEffect(() => {
    socket.on("cartProduct", () => {
      getSales();
    });

    return () => {
      socket.off("cartProduct");
    };
  }, []);

  useEffect(() => {
    getSales();
  }, []);
  const entregarProducto = async (sale: number) => {
    await deliverSaleProductsService(token, sale);
    socket.emit("newCartProduct", "");
  };
  return {
    data,
    refresh: getSales,
    goToSales,
    entregarProducto,
  };
};
