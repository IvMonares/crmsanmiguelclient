import { useContext } from "react";
import Select from "react-select";
import { useQuery, gql } from "@apollo/client";

// Context
import OrderContext from "../../context/orders/OrderContext";

// GQL to get user's Product
const GET_PRODUCTS = gql`
  query getProducts {
    getProducts {
      id
      name
      amount
      price
    }
  }
`;

const ProductSelector = () => {
  // Get values and functions from Context
  const orderContext = useContext(OrderContext);
  const { selectProducts } = orderContext;

  // // Query Product from DB
  const { data, loading, error } = useQuery(GET_PRODUCTS);

  // Prevent data access attempt while loading
  if (loading) return null;

  return (
    <div className="mb-4">
      <label
        className="block text-gray-700 text-sm font-bold mb-2"
        htmlFor="product"
      >
        Products
      </label>

      <Select
        id="product"
        name="product"
        options={data.getProducts}
        onChange={(selection) => selectProducts(selection)}
        getOptionValue={(options) => options.id}
        getOptionLabel={(options) =>
          `${options.name} ─ ${options.amount} units`
        }
        placeholder="Select Products"
        isMulti={true}
      />
    </div>
  );
};

export default ProductSelector;
