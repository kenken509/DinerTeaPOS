//import { Button } from 'antd/lib/radio';
import React, { useEffect, useState } from 'react';
import '../resources/itemCard.css';
import { Button } from 'antd';
import { useDispatch, useSelector } from 'react-redux';

function ItemCard({ item }) {
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.rootReducer);

  const addCartItem = (cartItems, productToadd) => {
    const productExist = cartItems.find((item) => {
      return item._id === productToadd._id;
    });
    if (productExist) {
      return dispatch({
        type: 'increaseQuantityExistingItem',
        payload: productToadd,
      });
    } else {
      return dispatch({ type: 'addToCart', payload: productToadd });
    }
  };

  function addItemToCart(productToadd) {
    addCartItem(cartItems, productToadd);
  }

  return (
    <div className="itemCard">
      <div className="itemChild">
        <h4>{item.name}</h4>
        <img
          src={item.image}
          alt={item.name}
          height="100"
          width="100"
          className="itemImg"
        ></img>
        <h4 className="price">Price: P {item.price.toFixed(2)}</h4>
      </div>
      <div className="d-flex justify-content-end">
        <Button type="primary" onClick={() => addItemToCart(item)}>
          Add to cart
        </Button>
      </div>
    </div>
  );
}

export default ItemCard;
