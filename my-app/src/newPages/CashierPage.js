import React, { useEffect, useState } from 'react';
import DefaultLayout from '../components/DefaultLayout';
import axios from 'axios';
import { Card, Col, Divider, Row, Table } from 'antd';
import ItemCard from '../components/ItemCard';
import { useDispatch, useSelector } from 'react-redux';
import '../resources/HomePage.css';

function CashierPage() {
  //const { cartItems } = useSelector((state) => state.rootReducer);
  const [itemsData, setItemsData] = useState([]);
  const [categorySelector, setCategorySelector] = useState('fruits');
  const [isCardItemOpen, setIsCardItemOpen] = useState(false);
  const { cartViewItems } = useSelector((state) => state.rootReducer);
  const categories = [
    {
      id: 131,
      name: 'fruits',
      imageURL:
        'https://img.freepik.com/free-photo/colorful-fruits-tasty-fresh-ripe-juicy-white-desk_179666-169.jpg?w=2000',
    },
    {
      id: 132,
      name: 'veggies',
      imageURL: 'https://thumbs.dreamstime.com/b/vegetables-1430407.jpg',
    },
    {
      id: 133,
      name: 'meat',
      imageURL:
        'https://www.foodsafetynews.com/files/2020/06/raw-sirloin-steak-beef.jpg',
    },
  ];
  const dispatch = useDispatch();

  const getAllItems = () => {
    dispatch({ type: 'showLoading' });
    axios
      .get('/api/items/get-all-items')
      .then((response) => {
        dispatch({ type: 'hideLoading' });
        setItemsData(response.data);
      })
      .catch((error) => {
        dispatch({ type: 'hideLoading' });
        console.log(error);
      });
  };

  useEffect(() => {
    getAllItems();
  }, []);

  return (
    <div>
      <div className="d-flex">
        {categories.map((category) => {
          return (
            <div
              className={`d-flex category-container ${
                categorySelector === category.name && 'selected-category'
              }`}
              onClick={() => {
                setCategorySelector(category.name);
              }}
              key={category.id}
            >
              <h4>{category.name}</h4>
              <img
                src={category.imageURL}
                height="50px"
                width="70px"
                id="categoryImg"
              />
            </div>
          );
        })}
      </div>
      <hr />
      <Row gutter={20}>
        {itemsData
          .filter((itm) => itm.category === categorySelector)
          .map((item, index) => {
            return (
              <Col span={6} xs={24} lg={6} md={12} sm={24} key={item._id}>
                <ItemCard item={item} />
              </Col>
            );
          })}
      </Row>
    </div>
  );
}
export default CashierPage;
