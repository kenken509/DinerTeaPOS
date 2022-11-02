const initialState = {
  loading: false,
  cartItems: [],
};

const rootReducer = (state = initialState, action) => {
  // {type, payload} = action;  (important) "type" is the name of action, "payload" is the data carried by action.

  switch (action.type) {
    case 'addToCart':
      console.log(state);
      return {
        ...state,
        cartItems: [...state.cartItems, action.payload],
      };

    case 'increaseQuantity':
      return {
        ...state,
        cartItems: state.cartItems.map((item) =>
          item._id == action.payload._id
            ? {
                ...item,
                quantity: action.payload.quantity,
              }
            : item
        ),
      };
    case 'decreaseQuantity':
      return {
        ...state,
        cartItems: state.cartItems.map((item) =>
          item._id == action.payload._id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };
    case 'deleteFromCart':
      return {
        ...state,
        cartItems: state.cartItems.filter(
          (item) => action.payload !== item._id
        ),
      };
    case 'showLoading': {
      return {
        ...state,
        loading: true,
      };
    }

    case 'hideLoading': {
      return {
        ...state,
        loading: false,
      };
    }
    default:
      return state;
  }
};

export default rootReducer;
