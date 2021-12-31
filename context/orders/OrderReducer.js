import {
  SELECT_CLIENT,
  SELECT_PRODUCTS,
  PRODUCT_AMOUNT,
  SET_DEADLINE,
  RESET_ORDER,
} from "../../types";

export default (state, action) => {
  switch (action.type) {
    case SELECT_CLIENT:
      return {
        ...state,
        client: action.payload,
      };
    case SELECT_PRODUCTS:
      return {
        ...state,
        products: action.payload,
      };
    case PRODUCT_AMOUNT:
      return {
        ...state,
        products: state.products.map((product) =>
          product.id === action.payload.id ? action.payload : product
        ),
        total: state.products.reduce((total, product) => {
          if (product.id === action.payload.id) {
            return total + action.payload.buying * action.payload.price;
          }
          if (!product.buying) {
            return total;
          }
          return total + product.buying * product.price;
        }, 0),
      };
    case SET_DEADLINE:
      return {
        ...state,
        deadline: action.payload,
      };
    case RESET_ORDER:
      return action.payload;
    default:
      return state;
  }
};
