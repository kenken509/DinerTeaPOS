//import { Button } from 'antd/lib/radio';
import React from 'react';
import '../resources/itemCard.css';
import { Button } from 'antd';
import { useDispatch } from 'react-redux';

function ItemCard({ item }) {
  const dispatch = useDispatch();
  function addToCart() {
    dispatch({ type: 'addToCart', payload: { ...item, quantity: 1 } });
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
        <Button type="primary" onClick={() => addToCart()}>
          Add to cart
        </Button>
      </div>
    </div>
  );
}

export default ItemCard;
