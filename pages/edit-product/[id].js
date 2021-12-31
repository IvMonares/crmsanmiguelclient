import { useState } from "react";
import { useRouter } from "next/router";
import { Formik } from "formik";
import * as Yup from "yup";
import { useQuery, useMutation, gql } from "@apollo/client";

// Proyect files
import Layout from "../../components/Layout";

// GQL to get product data
const GET_PRODUCT = gql`
  query getProduct($id: ID!) {
    getProduct(id: $id) {
      id
      name
      amount
      price
    }
  }
`;

// GQL to edit product
const UPDATE_PRODUCT = gql`
  mutation updateProduct($id: ID!, $input: ProductInput) {
    updateProduct(id: $id, input: $input) {
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

const UpdateProduct = () => {
  // Router
  const router = useRouter();

  // Get product's id from URL
  const {
    query: { id },
  } = router;

  // State for registration messages
  const [message, setMessage] = useState(null);

  // Query to get user data
  const { data, loading, error } = useQuery(GET_PRODUCT, {
    variables: { id },
  });

  // Mutation to update user and update cache
  const [updateProduct] = useMutation(UPDATE_PRODUCT);

  // Prevent data access attempt while loading
  if (loading) return null;

  // Redirect to login if user is not authenticated
  if (error && error.message == "User is not authenticated") {
    router.push("/login");
    return null;
  }

  // Initial Form values
  const initialValues = {
    name: data.getProduct.name,
    amount: data.getProduct.amount,
    price: data.getProduct.price,
  };

  // Form validation
  const validationSchema = Yup.object({
    name: Yup.string().required("The Name is mandatory"),
    amount: Yup.number()
      .required("The Amount is mandatory")
      .positive("The Amount must be a positive value")
      .integer("The Amount must be an integer value"),
    price: Yup.number()
      .required("The Price is mandatory")
      .positive("The Price must be a positive value"),
  });

  // Function to update product
  const updateProductRecord = async (values) => {
    try {
      setMessage("Updating product...");
      const { data } = await updateProduct({
        variables: {
          id,
          input: values,
        },
      });

      setMessage(`Product ${data.updateProduct.name} has been updated`);

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
      <h1 className="text-2xl text-gray-800 font-bold">Update Product</h1>

      {message && showMessage()}
      <div className="flex justify-center mt-5">
        <div className="w-full max-w-lg">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={(values) => updateProductRecord(values)}
          >
            {(props) => {
              return (
                <form
                  className="bg-white rounded shadow-md px-8 pt-6 pb-8 mb-4"
                  autoComplete="off"
                  onSubmit={props.handleSubmit}
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
                      value={props.values.name}
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                    />

                    {props.touched.name && props.errors.name ? (
                      <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-3">
                        <p>{props.errors.name}</p>
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
                      value={props.values.amount}
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                    />

                    {props.touched.amount && props.errors.amount ? (
                      <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-3">
                        <p>{props.errors.amount}</p>
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
                      value={props.values.price}
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                    />

                    {props.touched.price && props.errors.price ? (
                      <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-3">
                        <p>{props.errors.price}</p>
                      </div>
                    ) : null}
                  </div>
                  <input
                    type="submit"
                    className="bg-gray-800 w-full mt-5 p-2 text-white uppercase hover:cursor-pointer hover:bg-gray-900"
                    value="Update"
                  />
                </form>
              );
            }}
          </Formik>
        </div>
      </div>
    </Layout>
  );
};

export default UpdateProduct;
