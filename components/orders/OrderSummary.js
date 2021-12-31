import { useContext } from "react";

// Proyect files
import ProductSummary from "./ProductSummary";

// Context
import OrderContext from "../../context/orders/OrderContext";

const OrderSummary = () => {
  // Get values and functions from Context
  const orderContext = useContext(OrderContext);
  const { products } = orderContext;

  return products.length > 0 ? (
    <div className="mb-4">
      <label
        className="block text-gray-700 text-sm font-bold mb-2"
        htmlFor="client"
      >
        Amounts
      </label>
      <>
        {products.map((product) => (
          <ProductSummary key={product.id} product={product} />
        ))}
      </>
    </div>
  ) : null;
};

export default OrderSummary;
