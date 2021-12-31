import { useEffect } from "react";
import { useRouter } from "next/router";
import { useQuery, gql } from "@apollo/client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Proyect Files
import Layout from "../components/Layout";

// GQL to get top clients
const GET_TOP_CLIENTS = gql`
  query getTopClients {
    getTopClients {
      totalBought
      client {
        name
        last_name
      }
    }
  }
`;

const Orders = () => {
  // Routing
  const router = useRouter();

  // Query clients from DB
  const { data, loading, error, startPolling, stopPolling } =
    useQuery(GET_TOP_CLIENTS);

  // Check updates every 200ms
  // Fetch only occurs if updates are found to minimize DB querying
  useEffect(() => {
    startPolling(200);
    return () => {
      stopPolling();
    };
  }, [startPolling, stopPolling]);

  // Prevent data access attempt while loading
  if (loading) return null;

  // Redirect to login if user is not authenticated
  if (error && error.message == "User is not authenticated") {
    router.push("/login");
    return null;
  }

  // Structure data for graph
  const structuredData = [];

  data.getTopClients.forEach((client, index) => {
    structuredData[index] = {
      name: `${client.client[0].name} ${client.client[0].last_name}`,
      purchases: client.totalBought,
    };
  });

  return (
    <Layout>
      <h1 className="text-2xl text-gray-800 font-light">Top Clients</h1>
      <ResponsiveContainer width={"99%"} height={550}>
        <BarChart
          className="mt-10"
          width={600}
          height={500}
          data={structuredData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="purchases" fill="#3182CE" />
        </BarChart>
      </ResponsiveContainer>
    </Layout>
  );
};

export default Orders;
