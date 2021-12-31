import { useRouter } from "next/router";
import Link from "next/link";
import { useQuery, gql } from "@apollo/client";

//  Proyect files
import Layout from "../components/Layout";
import Order from "../components/Order";

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

const Orders = () => {
  // Routing
  const router = useRouter();

  // Query orders from DB
  const { data, loading, error } = useQuery(GET_ORDERS);

  // Prevent data access attempt while loading
  if (loading) return null;

  // Redirect to login if user is not authenticated
  if (error && error.message == "User is not authenticated") {
    router.push("/login");
    return null;
  }

  return (
    <>
      <Layout>
        <h1 className="text-2xl text-gray-800 font-light">Orders</h1>

        <Link href="/add-order">
          <a className="bg-blue-800 hover:bg-gray-800 py-2 px-5 my-3 inline-block text-white rounded text-sm uppercase font-bold">
            Add Order
          </a>
        </Link>

        {data.getOrders.length > 0 ? (
          data.getOrders.map((order) => <Order key={order.id} order={order} />)
        ) : (
          <p colSpan="6" className="py-2">
            No orders found in database
          </p>
        )}
      </Layout>
    </>
  );
};

export default Orders;
