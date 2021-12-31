import { useState } from "react";
import { useRouter } from "next/router";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useQuery, useMutation, gql } from "@apollo/client";

import Layout from "../components/Layout";

// GQL to authenticate user
const AUTH_VENDOR = gql`
  mutation authVendor($input: AuthInput) {
    authVendor(input: $input) {
      token
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

const Login = () => {
  // Router for redirectioning
  const router = useRouter();

  // Query to ensure no user is logged in
  const { _, loading, error } = useQuery(GET_VENDOR);

  // State for registration messages
  const [message, setMessage] = useState(null);

  // Mutation to authenticate user
  const [authVendor] = useMutation(AUTH_VENDOR);

  // Form Validation
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("The Email is not valid")
        .required("The Email is mandatory"),
      password: Yup.string().required("The Password is mandatory"),
    }),
    onSubmit: async (values) => {
      try {
        setMessage("Authenticating...");
        const { data } = await authVendor({
          variables: {
            input: values,
          },
        });

        // Save token to localStorage
        localStorage.setItem("token", data.authVendor.token);

        // Redrect to Home
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

  // If no errors, user is logged in
  if (!error) {
    router.push("/");
    return null;
  }

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
        {message && showMessage()}

        <h1 className="text-center text-2xl text-white font-light">Log In</h1>

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
                value="Login"
              />
            </form>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Login;
