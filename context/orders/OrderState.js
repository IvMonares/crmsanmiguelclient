import React, { useReducer } from "react";
import OrderContext from "./OrderContext";
import OrderReducer from "./OrderReducer";

import {
  SELECT_CLIENT,
  SELECT_PRODUCTS,
  PRODUCT_AMOUNT,
  SET_DEADLINE,
  RESET_ORDER,
} from "../../types";

const OrderState = ({ children }) => {
  // Order's state
  const initialState = {
    client: null,
    products: [],
    total: 0,
    deadline: null,
  };

  // Link to reducer
  const [state, dispatch] = useReducer(OrderReducer, initialState);

  // Modify client selection
  const selectClient = (client) => {
    dispatch({
      type: SELECT_CLIENT,
      payload: client,
    });
  };

  // Modify product selection
  const selectProducts = (selectedProducts) => {
    let productArray;

    // If there are no previously selected products, initialize array
    if (state.products.length == 0) {
      productArray = selectedProducts;
    } else {
      // Otherwise, preserve data of previously selected items
      productArray = selectedProducts.map((product) => {
        const previousProduct = state.products.find(
          (stateProduct) => stateProduct.id === product.id
        );
        return { ...product, ...previousProduct };
      });
    }

    // Save new array
    dispatch({
      type: SELECT_PRODUCTS,
      payload: productArray,
    });
  };

  // Modify product amounts
  const modifyAmounts = (product) => {
    dispatch({
      type: PRODUCT_AMOUNT,
      payload: product,
    });
  };

  // Set order's deadline
  const setDeadline = (deadline) => {
    dispatch({
      type: SET_DEADLINE,
      payload: deadline,
    });
  };

  // Reset order state
  const resetOrder = () => {
    dispatch({
      type: RESET_ORDER,
      payload: initialState,
    });
  };

  return (
    <OrderContext.Provider
      value={{
        client: state.client,
        products: state.products,
        total: state.total,
        deadline: state.deadline,
        selectClient,
        selectProducts,
        modifyAmounts,
        setDeadline,
        resetOrder,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export default OrderState;
