import { useRouter } from "next/router";
import Link from "next/link";
import { useQuery, gql } from "@apollo/client";

// Proyect files
import Layout from "../components/Layout";
import Product from "../components/Product";

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

const Index = () => {
  // Routing
  const router = useRouter();

  // Query products from DB
  const { data, loading, error } = useQuery(GET_PRODUCTS);

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
        <h1 className="text-2xl text-gray-800 font-bold">Product</h1>

        <Link href="/add-product">
          <a className="bg-blue-800 hover:bg-gray-800 py-2 px-5 my-3 inline-block text-white rounded text-sm uppercase font-bold">
            Add Product
          </a>
        </Link>
        <div className="overflow-x-auto">
          <table className="table-auto shadow-md mt-10 w-full w-lg">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="w-1/6 py-2">Name</th>
                <th className="w-1/6 py-2">Amount</th>
                <th className="w-1/6 py-2">Price</th>
                <th className="w-1/6 py-2">Actions</th>
              </tr>
            </thead>
            <tbody className="">
              {data && data.getProducts.length > 0 ? (
                data.getProducts.map((product) => (
                  <Product key={product.id} product={product} />
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-2">
                    No products found in database
                  </td>
                </tr>
              )}
            </tbody>
            <tfoot className="bg-gray-800 text-white">
              <tr>
                <th className="w-1/6 py-2">Name</th>
                <th className="w-1/6 py-2">Amount</th>
                <th className="w-1/6 py-2">Price</th>
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
