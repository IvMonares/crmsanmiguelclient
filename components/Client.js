import Swal from "sweetalert2";
import { useMutation, gql } from "@apollo/client";

//Proyect files
import Edit from "./Edit";
import Delete from "./Delete";

// GQL to delete client
const DELETE_CLIENT = gql`
  mutation deleteClient($id: ID!) {
    deleteClient(id: $id)
  }
`;

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

const Client = ({ client }) => {
  // Mutation to delete Client
  const [deleteClient] = useMutation(DELETE_CLIENT, {
    update(cache) {
      // Get cache object to update
      const { getClients } = cache.readQuery({ query: GET_CLIENTS });

      // Rewrite cache
      cache.writeQuery({
        query: GET_CLIENTS,
        data: {
          getClients: getClients.filter(
            (currentClient) => currentClient.id !== id
          ),
        },
      });
    },

    // Refetch all orders and products after client deletion
    refetchQueries: ["getOrders", "getProducts"],
  });

  // Get variables
  const { id, name, last_name, company, address, email, phone } = client;

  // Function to delete client
  const deleteFunction = async () => {
    try {
      const { data } = await deleteClient({
        variables: { id },
      });
      Swal.fire("Deleted", data.deleteClient, "success");
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    }
  };

  return (
    <tr>
      <td className="border px-4 py-2">
        {name} {last_name}
      </td>
      <td className="border px-4 py-2">{company}</td>
      <td className="border px-4 py-2">
        {email && (
          <p className="flex items-center my-2">
            <svg
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              className="w-4 h-4 mr-2"
            >
              <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
            </svg>
            {email}
          </p>
        )}
        {phone && (
          <p className="flex items-center my-2">
            <svg
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              className="w-4 h-4 mr-2"
            >
              <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
            </svg>
            {phone}
          </p>
        )}
      </td>
      <td className="border px-4 py-2">{address}</td>
      <td className="border px-4 py-2">
        <Edit id={id} href="/edit-client/[id]" />
        <Delete
          deleteMessage={`Delete ${name} ${last_name} and all their orders?`}
          deleteFunction={deleteFunction}
        />
      </td>
    </tr>
  );
};

export default Client;
