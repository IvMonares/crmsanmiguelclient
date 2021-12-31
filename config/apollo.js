import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";
import fetch from "node-fetch";
import { setContext } from "apollo-link-context";

// Link to Backend
const httpLink = createHttpLink({
  uri: "https://fast-oasis-64572.herokuapp.com/",
  fetch,
});

// Context for user authentication
const authLink = setContext((_, { headers }) => {
  // Get user token from localStorage
  const token = localStorage.getItem("token");

  // Add token to headers
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const apolloClient = new ApolloClient({
  cache: new InMemoryCache(),
  link: authLink.concat(httpLink),
});

export default apolloClient;
