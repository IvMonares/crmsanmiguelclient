import { useState, useContext } from "react";
import { useRouter } from "next/router";
import { useQuery, useMutation, gql } from "@apollo/client";

// Context
import OrderContext from "../context/orders/OrderContext";

// Proyect files
import Layout from "../components/Layout";
import ClientSelector from "../components/orders/ClientSelector";
import ProductSelector from "../components/orders/ProductSelector";
import OrderSummary from "../components/orders/OrderSummary";
import Total from "../components/orders/Total";
import Deadline from "../components/orders/Deadline";

// GQL to create order
const ADD_ORDER = gql`
  mutation addOrder($input: OrderInput) {
    addOrder(input: $input) {
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

// GQL to get products
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

// GQL to create user
const GET_VENDOR = gql`
  query getVendor {
    getVendor {
      id
      name
      last_name
      email
    }
  }
`;

const AddOrder = () => {
  // Router for redirectioning
  const router = useRouter();

  // Query to ensure credentials are valid
  const { _, loading, error } = useQuery(GET_VENDOR);

  // Get values and functions from Context
  const orderContext = useContext(OrderContext);
  const { client, products, deadline, resetOrder } = orderContext;

  // State for registration messages
  const [message, setMessage] = useState(null);

  // Mutation to create new user and update cache
  const [addOrder] = useMutation(ADD_ORDER, {
    update(cache, { data: { addOrder } }) {
      try {
        // PRODUCTS
        // Get cache object to update
        const { getProducts } = cache.readQuery({ query: GET_PRODUCTS });

        // Rewrite cache
        cache.writeQuery({
          query: GET_PRODUCTS,
          data: {
            getProducts: getProducts.map((product) => {
              for (const item of addOrder.items) {
                console.log(item);
                // If item is in order, reduce amount
                if (product.id === item.id) {
                  return { ...product, amount: product.amount - item.amount };
                }
              }

              // If item was not found in order, return product
              return { ...product };
            }),
          },
        });
      } catch (error) {
        console.error(error);
      }

      try {
        // ORDERS
        // Get cache object to update
        const { getOrders } = cache.readQuery({ query: GET_ORDERS });

        // Rewrite cache
        cache.writeQuery({
          query: GET_ORDERS,
          data: {
            getOrders: [...getOrders, addOrder],
          },
        });
      } catch (error) {
        console.error(error);
      }
    },
  });

  // Prevent data access attempt while loading
  if (loading) return null;

  // Redirect to login if user is not authenticated
  if (error && error.message == "User is not authenticated") {
    router.push("/login");
    return null;
  }

  // Form Validation
  const validateOrder = () => {
    return (
      client &&
      products &&
      products.length > 0 &&
      products.every((product) => product.buying && product.buying > 0) &&
      deadline
    );
  };

  // Form submission
  const submitOrder = async () => {
    if (validateOrder()) {
      try {
        setMessage("Creating order...");
        await addOrder({
          variables: {
            input: {
              items: products.map((product) => {
                return { id: product.id, amount: product.buying };
              }),
              client: client.id,
              deadline,
            },
          },
        });

        setMessage("Order has been registered");

        setTimeout(() => {
          setMessage(null);
          resetOrder();
          router.push("/orders");
        }, 1000);
      } catch (error) {
        setMessage(error.message);

        setTimeout(() => {
          setMessage(null);
        }, 3000);
      }
    } else {
      setMessage("Complete all fields before submitting order");

      setTimeout(() => {
        setMessage(null);
      }, 3000);
    }
  };

  // Function to show feedback from Backend
  const showMessage = () => {
    return (
      <div className="bg-white py-2 px-3 w-full my-3 max-w-lg text-center mx-auto">
        <p>{message}</p>
      </div>
    );
  };

  return (
    <Layout>
      <h1 className="text-2xl text-gray-800 font-bold">Add Order</h1>

      {message && showMessage()}

      <div className="flex justify-center mt-5">
        <div className="w-full max-w-xl">
          <div className="bg-white rounded shadow-md px-8 pt-6 pb-8 mb-4">
            <ClientSelector />
            <ProductSelector />
            <OrderSummary />
            <Total />
            <Deadline />

            <button
              type="button"
              className={`bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:cursor-pointer hover:bg-gray-900 ${
                validateOrder() ? "" : " opacity-50 cursor-not-allowed "
              }`}
              onClick={() => submitOrder()}
            >
              Create Order{" "}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AddOrder;
