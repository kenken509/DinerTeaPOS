import { message } from 'antd';
import { useState } from 'react';

const initialState = {
  loading: false,
  cartItems: [],
};

const rootReducer = (state = initialState, action) => {
  // {type, payload} = action;  (important) "type" is the name of action, "payload" is the data carried by action.
  //action.payload object >> {_id: '635b2e73579c43a1aaa91c90', name: 'Grapes', image: 'https://cf.ltkcdn.net/wine/images/std/165373-800x532r1-grapes.jpg', price: 7.5, category: 'fruits'}

  switch (action.type) {
    case 'addToCart':
      return {
        ...state,
        cartItems: [...state.cartItems, { ...action.payload, quantity: 1 }],
      };
    case 'increaseQuantityExistingItem':
      return {
        ...state,
        cartItems: state.cartItems.map((item) =>
          item._id === action.payload._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ),
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
