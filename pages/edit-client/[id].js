import { useState } from "react";
import { useRouter } from "next/router";
import { Formik } from "formik";
import * as Yup from "yup";
import { useQuery, useMutation, gql } from "@apollo/client";

// Proyect files
import Layout from "../../components/Layout";

// GQL to get client data
const GET_CLIENT = gql`
  query getClient($id: ID!) {
    getClient(id: $id) {
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

// GQL to edit client
const UPDATE_CLIENT = gql`
  mutation updateClient($id: ID!, $input: ClientInput) {
    updateClient(id: $id, input: $input) {
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

const UpdateClient = () => {
  // Router
  const router = useRouter();

  // Get client's id from URL
  const {
    query: { id },
  } = router;

  // State for registration messages
  const [message, setMessage] = useState(null);

  // Query to get user data
  const { data, loading, error } = useQuery(GET_CLIENT, {
    variables: { id },
  });

  // Mutation to update user and update cache
  const [updateClient] = useMutation(UPDATE_CLIENT);

  // Prevent data access attempt while loading
  if (loading) return null;

  // Redirect to login if user is not authenticated
  if (error && error.message == "User is not authenticated") {
    router.push("/login");
    return null;
  }

  // Initial Form values
  const initialValues = {
    name: data.getClient.name,
    last_name: data.getClient.last_name,
    company: data.getClient.company,
    address: data.getClient.address,
    email: data.getClient.email,
    phone: data.getClient.phone,
  };

  // Form validation
  const validationSchema = Yup.object({
    name: Yup.string().required("The Name is mandatory"),
    last_name: Yup.string().required("The Last Name is mandatory"),
    company: Yup.string().required("The Company is mandatory"),
    address: Yup.string().required("The Address is mandatory"),
    email: Yup.string()
      .email("The Email is not valid")
      .required("The Email is mandatory"),
    phone: Yup.string().matches(phoneRegex, "The Phone Number is not valid"),
  });

  // Function to update client
  const updateClientRecord = async (values) => {
    try {
      setMessage("Updating client...");
      const { data } = await updateClient({
        variables: {
          id,
          input: values,
        },
      });

      setMessage(
        `Client ${data.updateClient.name} ${data.updateClient.last_name} has been updated`
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
      <h1 className="text-2xl text-gray-800 font-bold">Update Client</h1>

      {message && showMessage()}
      <div className="flex justify-center mt-5">
        <div className="w-full max-w-lg">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={(values) => updateClientRecord(values)}
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
                      htmlFor="last_name"
                    >
                      Last Name
                    </label>

                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="last_name"
                      type="text"
                      placeholder="Last Name"
                      value={props.values.last_name}
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                    />

                    {props.touched.last_name && props.errors.last_name ? (
                      <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-3">
                        <p>{props.errors.last_name}</p>
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
                      value={props.values.company}
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                    />

                    {props.touched.company && props.errors.company ? (
                      <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-3">
                        <p>{props.errors.company}</p>
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
                      value={props.values.address}
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                    />

                    {props.touched.address && props.errors.address ? (
                      <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-3">
                        <p>{props.errors.address}</p>
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
                      value={props.values.email}
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                    />

                    {props.touched.email && props.errors.email ? (
                      <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-3">
                        <p>{props.errors.email}</p>
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
                      value={props.values.phone}
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                    />

                    {props.touched.phone && props.errors.phone ? (
                      <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-3">
                        <p>{props.errors.phone}</p>
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

export default UpdateClient;
