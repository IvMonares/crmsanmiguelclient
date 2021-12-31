import { useState } from "react";
import { useRouter } from "next/router";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useQuery, useMutation, gql } from "@apollo/client";

// Proyect files
import Layout from "../components/Layout";

// GQL to create product
const ADD_PRODUCT = gql`
  mutation addProduct($input: ProductInput) {
    addProduct(input: $input) {
      id
      name
      amount
      price
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

const AddProduct = () => {
  // Router for redirectioning
  const router = useRouter();

  // Query to ensure credentials are valid
  const { _, loading, error } = useQuery(GET_VENDOR);

  // State for registration messages
  const [message, setMessage] = useState(null);

  // Mutation to create new user and update cache
  const [addProduct] = useMutation(ADD_PRODUCT, {
    update(cache, { data: { addProduct } }) {
      // Get cache object to update
      const { getProducts } = cache.readQuery({ query: GET_PRODUCTS });

      // Rewrite cache
      cache.writeQuery({
        query: GET_PRODUCTS,
        data: {
          getProducts: [...getProducts, addProduct],
        },
      });
    },
  });

  // Form Validation
  const formik = useFormik({
    initialValues: {
      name: "",
      amount: "",
      price: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("The Name is mandatory"),
      amount: Yup.number()
        .required("The Amount is mandatory")
        .positive("The Amount must be a positive value")
        .integer("The Amount must be an integer value"),
      price: Yup.number()
        .required("The Price is mandatory")
        .positive("The Price must be a positive value"),
    }),
    onSubmit: async (values) => {
      try {
        setMessage("Creating product...");
        const { data } = await addProduct({
          variables: {
            input: values,
          },
        });

        setMessage(`Product ${data.addProduct.name} has been registered`);

        setTimeout(() => {
          setMessage(null);
          router.push("/products");
        }, 1000);
      } catch (error) {
        setMessage(error.message);

        setTimeout(() => {
          setMessage(null);
        }, 3000);
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
      <h1 className="text-2xl text-gray-800 font-bold">Add Product</h1>

      {message && showMessage()}
      <div className="flex justify-center mt-5">
        <div className="w-full max-w-lg">
          <form
            className="bg-white rounded shadow-md px-8 pt-6 pb-8 mb-4"
            autoComplete="off"
            onSubmit={formik.handleSubmit}
          >
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="name"
              >
                Name
              </label>

              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="name"
                type="text"
                placeholder="Name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />

              {formik.touched.name && formik.errors.name ? (
                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-3">
                  <p>{formik.errors.name}</p>
                </div>
              ) : null}
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="amount"
              >
                Amount
              </label>

              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="amount"
                type="number"
                value={formik.values.amount}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />

              {formik.touched.amount && formik.errors.amount ? (
                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-3">
                  <p>{formik.errors.amount}</p>
                </div>
              ) : null}
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="price"
              >
                Price
              </label>

              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="price"
                type="number"
                step="0.01"
                value={formik.values.price}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />

              {formik.touched.price && formik.errors.price ? (
                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-3">
                  <p>{formik.errors.price}</p>
                </div>
              ) : null}
            </div>
            <input
              type="submit"
              className="bg-gray-800 w-full mt-5 p-2 text-white uppercase hover:cursor-pointer hover:bg-gray-900"
              value="Register"
            />
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default AddProduct;
