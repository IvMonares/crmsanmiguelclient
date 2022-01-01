import { useState } from "react";
import Swal from "sweetalert2";
import Select from "react-select";
import { useMutation, gql } from "@apollo/client";

// Product Files
import Item from "./Item";
import Delete from "./Delete";

// GQL to update order state
const UPDATE_ORDER = gql`
  mutation updateOrder($id: ID!, $input: OrderInput) {
    updateOrder(id: $id, input: $input) {
      id
      state
    }
  }
`;

// GQL to delete order
const DELETE_ORDER = gql`
  mutation deleteOrder($id: ID!) {
    deleteOrder(id: $id)
  }
`;

// GQL to get orders of user's clients
const GET_ORDERS = gql`
  query getOrders {
    getOrders {
      id
      items {
        id
        amount
      }
      total
      client {
        id
        name
        last_name
        email
        phone
      }
      vendor
      state
      deadline
    }
  }
`;

const ORDER_STATE_OPTIONS = [
  { value: "PENDING", label: "PENDING" },
  { value: "COMPLETED", label: "COMPLETED" },
  { value: "CANCELLED", label: "CANCELLED" },
];

const Order = ({ order }) => {
  // Get variables
  const { id, items, client, total, state, deadline } = order;
  const formattedDeadline = new Date(deadline).toLocaleDateString("en-US");

  // State for order's completion state
  const [orderState, setOrderState] = useState(state);

  // Mutation to update Order
  const [updateOrder] = useMutation(UPDATE_ORDER);

  // Mutation to delete Order
  const [deleteOrder] = useMutation(DELETE_ORDER, {
    update(cache) {
      // Get cache object to update
      const { getOrders } = cache.readQuery({ query: GET_ORDERS });

      // Rewrite cache
      cache.writeQuery({
        query: GET_ORDERS,
        data: {
          getOrders: getOrders.filter((currentOrder) => currentOrder.id !== id),
        },
      });
    },
    // Refetch products to get new inventory levels after deletion
    refetchQueries: ["getProducts"],
  });

  // Function to delete order
  const deleteFunction = async () => {
    try {
      const { data } = await deleteOrder({
        variables: { id },
      });
      Swal.fire("Deleted", data.deleteOrder, "success");
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    }
  };

  // Function to set order's completion state
  const setState = async (selection) => {
    if (selection) {
      try {
        //Update in DB
        const { data } = await updateOrder({
          variables: {
            id,
            input: {
              state: selection.value,
            },
          },
        });

        // Update UI according to DB
        setOrderState(data.updateOrder.state);
      } catch (error) {
        console.log(error);
      }
    }
  };

  // Function to get Select color according to order's completion state
  const getStateColor = () => {
    switch (orderState) {
      case "PENDING":
        return "#FDE047";
      case "COMPLETED":
        return "#22C55E";
      case "CANCELLED":
        return "#EF4444";
      default:
        return "white";
    }
  };

  const SELECT_STYLES = {
    indicatorSeparator: (provided, state) => ({
      ...provided,
      backgroundColor: "black",
    }),
    dropdownIndicator: (provided, state) => ({
      ...provided,
      color: "black",
    }),
    control: (provided, state) => ({
      ...provided,
      backgroundColor: getStateColor(),
    }),
  };

  return (
    <div
      className={
        "mt-4 bg-white rounded p-6 md:grid md:grid-cols-2 md:gap-4 shadow-lg"
      }
    >
      <div className="flex flex-col justify-between">
        <div>
          <p className="font-bold text-gray-800">
            Client: {client.name} {client.last_name}{" "}
          </p>

          {client.email && (
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
              {client.email}
            </p>
          )}

          {client.phone && (
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
              {client.phone}
            </p>
          )}
        </div>
        <div>
          <h2 className="text-gray-800 font-bold">Deadline:</h2>
          <p className="mb-2">{formattedDeadline}</p>
          <h2 className="text-gray-800 font-bold">Status:</h2>
          <Select
            id="client"
            name="client"
            className="bg-green-200 w-full md:w-2/3"
            styles={SELECT_STYLES}
            options={ORDER_STATE_OPTIONS}
            onChange={(selection) => setState(selection)}
            placeholder="State"
            defaultValue={
              ORDER_STATE_OPTIONS.filter(
                (option) => option.value == orderState
              )[0]
            }
          />
        </div>
      </div>

      <div className="flex flex-col justify-between">
        <div>
          <h2 className="text-gray-800 font-bold my-2">Summary</h2>
          <div className="grid grid-cols-4 gap-4 font-bold border-b-2 border-gray-800">
            <p>Product</p>
            <p className="text-center">Price</p>
            <p className="text-center">Amount</p>
            <p className="text-right">Total</p>
          </div>
          {items.map((item) => (
            <Item key={item.id} item={item} />
          ))}

          <p className="text-gray-800 mt-3 font-bold text-right border-t-2 border-gray-800">
            <span>$ {total.toFixed(2)}</span>
          </p>
        </div>
        <Delete
          deleteMessage={`Delete order?`}
          deleteFunction={deleteFunction}
        />
      </div>
    </div>
  );
};

export default Order;
