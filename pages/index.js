import { useQuery, gql } from "@apollo/client";
import { useRouter } from "next/router";
import Link from "next/link";

// Proyect files
import Layout from "../components/Layout";
import Client from "../components/Client";

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

const Index = () => {
  // Routing
  const router = useRouter();

  // Query clients from DB
  const { data, loading, error } = useQuery(GET_CLIENTS);

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
        <h1 className="text-2xl text-gray-800 font-bold">Clients</h1>

        <Link href="/add-client">
          <a className="bg-blue-800 hover:bg-gray-800 py-2 px-5 my-3 inline-block text-white rounded text-sm uppercase font-bold">
            Add Client
          </a>
        </Link>
        <div className="overflow-x-auto">
          <table className="table-auto shadow-md mt-10 w-full w-lg">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="w-1/6 py-2">Name</th>
                <th className="w-1/6 py-2">Company</th>
                <th className="w-1/6 py-2">Contact</th>
                <th className="w-1/6 py-2">Address</th>
                <th className="w-1/6 py-2">Actions</th>
              </tr>
            </thead>
            <tbody className="">
              {data.getClients.length > 0 ? (
                data.getClients.map((client) => (
                  <Client key={client.id} client={client} />
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-2">
                    No clients found in database
                  </td>
                </tr>
              )}
            </tbody>
            <tfoot className="bg-gray-800 text-white">
              <tr>
                <th className="w-1/6 py-2">Name</th>
                <th className="w-1/6 py-2">Company</th>
                <th className="w-1/6 py-2">Contact</th>
                <th className="w-1/6 py-2">Address</th>
                <th className="w-1/6 py-2">Actions</th>
              </tr>
            </tfoot>
          </table>
        </div>
      </Layout>
    </>
  );
};

export default Index;
