import { useContext } from "react";

// Context
import OrderContext from "../../context/orders/OrderContext";

const Total = () => {
  // Get values and functions from Context
  const orderContext = useContext(OrderContext);
  const { total } = orderContext;

  return (
    <div className="flex justify-between items-center mt-5 p-3  border-2 border-gray-500">
      <h2 className="text-gray-800 text-lg text-bold">Total:</h2>
      <p className="text-gray-800">$ {total.toFixed(2)}</p>
    </div>
  );
};

export default Total;
