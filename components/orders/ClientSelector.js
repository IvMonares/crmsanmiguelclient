import { useContext } from "react";
import Select from "react-select";
import { useQuery, gql } from "@apollo/client";

// Context
import OrderContext from "../../context/orders/OrderContext";

// GQL to get user's clients
const GET_CLIENTS = gql`
  query getClients {
    getClients {
      id
      name
      last_name
      company
      address
      email
      phone
    }
  }
`;

const ClientSelector = () => {
  // Get values and functions from Context
  const orderContext = useContext(OrderContext);
  const { selectClient } = orderContext;

  // Query clients from DB
  const { data, loading, error } = useQuery(GET_CLIENTS);

  // Prevent data access attempt while loading
  if (loading) return null;

  return (
    <div className="mb-4">
      <label
        className="block text-gray-700 text-sm font-bold mb-2"
        htmlFor="client"
      >
        Client
      </label>

      <Select
        id="client"
        name="client"
        options={data.getClients}
        onChange={(selection) => selectClient(selection)}
        getOptionValue={(options) => options.id}
        getOptionLabel={(options) => `${options.name} ${options.last_name}`}
        placeholder="Select Client"
      />
    </div>
  );
};

export default ClientSelector;
