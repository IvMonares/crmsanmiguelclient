import { useState } from "react";
import { useRouter } from "next/router";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useQuery, useMutation, gql } from "@apollo/client";

// Proyect files
import Layout from "../components/Layout";

// GQL to create user
const ADD_VENDOR = gql`
  mutation addVendor($input: VendorInput) {
    addVendor(input: $input) {
      id
      name
      last_name
      email
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

const AddVendor = () => {
  // Router for redirectioning
  const router = useRouter();

  // Query to ensure credentials are valid
  const { _, loading, error } = useQuery(GET_VENDOR);

  // State for registration messages
  const [message, setMessage] = useState(null);

  // Mutation to create new user
  const [addVendor] = useMutation(ADD_VENDOR);

  // Form Validation
  const formik = useFormik({
    initialValues: {
      name: "",
      last_name: "",
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("The Name is mandatory"),
      last_name: Yup.string().required("The Last Name is mandatory"),
      email: Yup.string()
        .email("The Email is not valid")
        .required("The Email is mandatory"),
      password: Yup.string()
        .required("The Password is mandatory")
        .min(6, "The Password must be at least 6 characters long"),
    }),
    onSubmit: async (values) => {
      try {
        setMessage("Creating user...");
        const { data } = await addVendor({
          variables: {
            input: values,
          },
        });

        setMessage(
          `Vendor ${data.addVendor.name} ${data.addVendor.last_name} has been registered`
        );

        setTimeout(() => {
          setMessage(null);
          router.push("/login");
        }, 2000);
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
    router.push("/");
    return null;
  }
  // Function to show feedback from Backend
  const showMessage = () => {
    return (
      <div className="bg-white py-2 px-3 w-full my-3 max-w-sm text-center mx-auto">
        <p>{message}</p>
      </div>
    );
  };

  return (
    <>
      <Layout>
        <h1 className="text-2xl text-gray-800 font-bold">
          Register New Vendor
        </h1>

        {message && showMessage()}
        <div className="flex justify-center mt-5">
          <div className="w-full max-w-sm">
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
                  htmlFor="last_name"
                >
                  Last Name
                </label>

                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="last_name"
                  type="text"
                  placeholder="Last Name"
                  value={formik.values.last_name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />

                {formik.touched.last_name && formik.errors.last_name ? (
                  <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-3">
                    <p>{formik.errors.last_name}</p>
                  </div>
                ) : null}
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="email"
                >
                  Email
                </label>

                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="email"
                  type="email"
                  placeholder="Email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />

                {formik.touched.email && formik.errors.email ? (
                  <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-3">
                    <p>{formik.errors.email}</p>
                  </div>
                ) : null}
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="password"
                >
                  Password
                </label>

                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="password"
                  type="password"
                  placeholder="Password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />

                {formik.touched.password && formik.errors.password ? (
                  <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-3">
                    <p>{formik.errors.password}</p>
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
    </>
  );
};

export default AddVendor;
