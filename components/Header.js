import React from "react";
import { useRouter } from "next/router";
import { useQuery, gql } from "@apollo/client";

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

const Header = () => {
  // Query clients from DB
  const { data, loading, error, refetch } = useQuery(GET_VENDOR);

  // Routing
  const router = useRouter();

  // Prevent data access attempt while loading
  if (loading) return null;

  // Redirect to login if user is not authenticated
  if (error && error.message == "User is not authenticated") {
    router.push("/login");
    return null;
  }

  // Function to close user's session
  const closeSession = async () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  // Get user Data
  const { name, last_name } = data.getVendor;

  return (
    <div className="mb-2 md:mb-0 flex justify-end items-center">
      <p className="mr-2">
        {name} {last_name}
      </p>
      <button
        type="button"
        className="rounded bg-blue-800 px-4 py-2 text-white font-bold uppercase text-sm shadow-md"
        onClick={() => closeSession()}
      >
        Log Out
      </button>
    </div>
  );
};

export default Header;
