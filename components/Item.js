import { useQuery, gql } from "@apollo/client";

// GQL to get products
const GET_PRODUCT = gql`
  query getProduct($id: ID!) {
    getProduct(id: $id) {
      id
      name
      price
    }
  }
`;

const Item = ({ item }) => {
  // Get variables
  const { id, amount } = item;

  // Get product data
  const { data, loading, error } = useQuery(GET_PRODUCT, {
    variables: { id },
  });

  // Prevent data access attempt while loading
  if (loading) return null;

  return (
    <div className="grid grid-cols-4 gap-4 my-1">
      <p>{data.getProduct.name}</p>
      <p className="text-center">${data.getProduct.price.toFixed(2)}</p>
      <p className="text-center">{amount} units</p>
      <p className="text-right">
        ${(amount * data.getProduct.price).toFixed(2)}
      </p>
    </div>
  );
};

export default Item;
