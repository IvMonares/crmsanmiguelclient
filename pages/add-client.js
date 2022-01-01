import { useState } from "react";
import { useRouter } from "next/router";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useQuery, useMutation, gql } from "@apollo/client";

// Proyect files
import Layout from "../components/Layout";

// GQL to create user
const ADD_CLIENT = gql`
  mutation addClient($input: ClientInput) {
    addClient(input: $input) {
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

// Regex to validate phone numbers
const phoneRegex =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

const AddClient = () => {
  // Router for redirectioning
  const router = useRouter();

  // Query to ensure credentials are valid
  const { _, loading, error } = useQuery(GET_VENDOR);

  // State for registration messages
  const [message, setMessage] = useState(null);

  // Mutation to create new user and update cache
  const [addClient] = useMutation(ADD_CLIENT, {
    update(cache, { data: { addClient } }) {
      // Get cache object to update
      const { getClients } = cache.readQuery({ query: GET_CLIENTS });

      // Rewrite cache
      cache.writeQuery({
        query: GET_CLIENTS,
        data: {
          getClients: [...getClients, addClient],
        },
      });
    },
  });

  // Form Validation
  const formik = useFormik({
    initialValues: {
      name: "",
      last_name: "",
      company: "",
      address: "",
      email: "",
      phone: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("The Name is mandatory"),
      last_name: Yup.string().required("The Last Name is mandatory"),
      company: Yup.string().required("The Company is mandatory"),
      address: Yup.string().required("The Address is mandatory"),
      email: Yup.string()
        .email("The Email is not valid")
        .required("The Email is mandatory"),
      phone: Yup.string().matches(phoneRegex, "The Phone Number is not valid"),
    }),
    onSubmit: async (values) => {
      try {
        setMessage("Creating client...");
        const { data } = await addClient({
          variables: {
            input: values,
          },
        });

        setMessage(
          `Client ${data.addClient.name} ${data.addClient.last_name} has been registered`
        );

        setTimeout(() => {
          setMessage(null);
          router.push("/");
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
      <h1 className="text-2xl text-gray-800 font-bold">Add Client</h1>

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
                htmlFor="company"
              >
                Company
              </label>

              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="company"
                type="text"
                placeholder="Company"
                value={formik.values.company}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />

              {formik.touched.company && formik.errors.company ? (
                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-3">
                  <p>{formik.errors.company}</p>
                </div>
              ) : null}
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="address"
              >
                Address
              </label>

              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="address"
                type="text"
                placeholder="Address"
                value={formik.values.address}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />

              {formik.touched.address && formik.errors.address ? (
                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-3">
                  <p>{formik.errors.address}</p>
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
                htmlFor="phone"
              >
                Phone Number
                <p className="text-xs text-gray-600">(Optional)</p>
              </label>

              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="phone"
                type="tel"
                placeholder="Phone number"
                value={formik.values.phone}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />

              {formik.touched.phone && formik.errors.phone ? (
                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-3">
                  <p>{formik.errors.phone}</p>
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

export default AddClient;
