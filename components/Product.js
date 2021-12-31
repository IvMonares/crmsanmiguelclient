import Swal from "sweetalert2";
import { useMutation, gql } from "@apollo/client";

//Proyect files
import Edit from "./Edit";
import Delete from "./Delete";

// GQL to delete user
const DELETE_PRODUCT = gql`
  mutation deleteProduct($id: ID!) {
    deleteProduct(id: $id)
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

const Product = ({ product }) => {
  // Mutation to delete Product
  const [deleteProduct] = useMutation(DELETE_PRODUCT, {
    update(cache) {
      // Get cache object to update
      const { getProducts } = cache.readQuery({ query: GET_PRODUCTS });

      // Rewrite cache
      cache.writeQuery({
        query: GET_PRODUCTS,
        data: {
          getProducts: getProducts.filter(
            (currentProduct) => currentProduct.id !== id
          ),
        },
      });
    },
  });

  // Get variables
  const { id, name, amount, price } = product;

  // Function to delete product
  const deleteFunction = async () => {
    try {
      //Delete from database
      const { data } = await deleteProduct({
        variables: { id },
      });
      Swal.fire("Deleted", data.deleteProduct, "success");
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    }
  };

  return (
    <tr>
      <td className="border px-4 py-2">{name}</td>
      <td className="border px-4 py-2 text-center">{amount}</td>
      <td className="border px-4 py-2 text-center">$ {price.toFixed(2)}</td>
      <td className="border px-4 py-2">
        <Edit id={id} href="/edit-product/[id]" />
        <Delete
          deleteMessage={`Delete ${name}?`}
          deleteFunction={deleteFunction}
        />
      </td>
    </tr>
  );
};

export default Product;
