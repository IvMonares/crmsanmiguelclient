import { useContext, useState, useEffect } from "react";

// Context
import OrderContext from "../../context/orders/OrderContext";

const ProductSummary = ({ product }) => {
  // Get variables
  const { name, price, amount } = product;

  // State for amount bought
  const [buying, setBuying] = useState(1);
  useEffect(() => {
    modifyAmounts({ ...product, buying });
  }, [buying]);

  // Function to update amount
  const updateAmount = (selectedAmount) => {
    // Ensure value is integer
    const intAmount = parseInt(selectedAmount);

    // Ensure value is number
    if (isNaN(intAmount)) {
      setBuying(1);
    } else {
      setBuying(intAmount);
    }
  };

  // Get values and functions from Context
  const orderContext = useContext(OrderContext);
  const { modifyAmounts } = orderContext;

  return (
    <div className="mb-4 md:flex md:justify-between md:items-center mt-5">
      <div className="w-full mb-2 md:mb-0 flex justify-between">
        <p>
          {name} <b>($ {price.toFixed(2)})</b>
        </p>
      </div>
      <div className="w-full mb-2 md:mb-0 flex justify-end items-center md:ml-4 ">
        <input
          className="shadow appearance-none border rounded w-3/5 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-right"
          type="number"
          min={1}
          max={amount}
          onChange={(e) => updateAmount(e.target.value)}
          value={buying}
        />
        <p className="ml-4 ">Units</p>
      </div>
    </div>
  );
};

export default ProductSummary;
