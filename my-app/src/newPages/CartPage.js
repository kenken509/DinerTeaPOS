import {
  Button,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Select,
  Table,
} from 'antd';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  DeleteOutlined,
  MinusCircleOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons';
import '../resources/cartPage.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import CashierLayout from '../components/CashierLayout';

const CartPage = () => {
  const navigate = useNavigate();
  const { cartItems, cartViewItems } = useSelector(
    (state) => state.rootReducer
  );
  const [subTotal, setSubTotal] = useState(0);
  const [billChargeModal, setBillChargeModal] = useState(false);
  const dispatch = useDispatch();
  var grandTotal = subTotal + subTotal * 0.12;

  useEffect(() => {
    dispatch({ type: 'cartViewItemsClosed' });
  }, []);

  function increaseQuantity(record) {
    dispatch({
      type: 'increaseQuantity',
      payload: { ...record, quantity: record.quantity + 1 },
    });
  }
  function decreaseQuantity(record) {
    if (record.quantity !== 1) {
      dispatch({
        type: 'decreaseQuantity',
        payload: { ...record, quantity: record.quantity - 1 },
      });
    }
  }

  const columns = [
    {
      title: 'Product Name',
      dataIndex: 'name',
    },
    {
      title: 'Image',
      dataIndex: 'image',
      render: (image, record) => (
        <img src={image} alt="" height="60" width="60" />
      ),
    },
    {
      title: 'Product Price',
      dataIndex: 'price',
      render: (text) => <p>₱ {text.toFixed(2)}</p>,
    },
    {
      title: 'Quantity',
      dataIndex: '_id',
      render: (_id, record) => (
        <div>
          <MinusCircleOutlined
            className="mx-3"
            onClick={() => decreaseQuantity(record)}
            style={record.quantity === 1 ? { color: '#d9d9d9' } : null}
          />
          {record.quantity} {/* <<<<<--- needs modification */}
          <PlusCircleOutlined
            className="mx-3"
            onClick={() => increaseQuantity(record)}
          />
        </div>
      ),
    },
    {
      title: 'Actions',
      dataIndex: '_id',
      render: (id, record) => (
        <DeleteOutlined
          size={{ fontSize: '50px' }}
          onClick={() =>
            dispatch({ type: 'deleteFromCart', payload: record._id })
          }
        />
      ),
    },
  ];

  const onFinish = (values) => {
    const reqObject = {
      ...values,
      cartItems,
      subTotal,
      tax: Number((subTotal * 0.12).toFixed(2)),
      totalAmount: Number((subTotal + Number(subTotal * 0.12)).toFixed(2)),
      userId: JSON.parse(localStorage.getItem('post-user')).userId,
    };
    console.log(reqObject);
    axios
      .post('/api/bills/charge-bill', reqObject)
      .then((res) => {
        message.success(res.data);
        navigate('/bills');
      })
      .catch(() => {
        message.success('Something went wrong.');
      });
  };
  useEffect(() => {
    let temp = 0;
    cartItems.forEach((item) => {
      temp = temp + item.price * item.quantity;

      setSubTotal(temp);
    });
  }, [cartItems]);
  return (
    <div>
      <h3>Cart Items</h3>
      <Table columns={columns} dataSource={cartItems} rowKey="_id" />
      <hr />
      <div className="d-flex justify-content-end flex-column align-items-end">
        <div className="subtotal">
          {cartItems.length !== 0 && <h3>SUBTOTAL: ₱ {subTotal.toFixed(2)}</h3>}
        </div>
        {cartItems.length !== 0 && (
          <Button
            type="primary"
            onClick={() => {
              setBillChargeModal(true);
            }}
          >
            Check out
          </Button>
        )}
      </div>

      {/* <<<<CHARGE BILL MODAL STARTS HERE>>>>> */}
      <Modal
        title="Charge Bill"
        open={billChargeModal}
        onCancel={() => setBillChargeModal(false)}
        footer={null}
      >
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item label="Customer name" name="customerName">
            <Input placeholder="Customer name"></Input>
          </Form.Item>

          <Form.Item label="Customer Phone Number" name="customerPhoneNumber">
            <Input placeholder="Phone number"></Input>
          </Form.Item>

          <Form.Item label="Amount Tendered" name="amountTendered">
            <Input placeholder="Enter Amount" type="number"></Input>
          </Form.Item>
          {/* <Form.Item label="Payment Mode" name="paymentMode">
            <Select placeholder="Payment mode">
              <Select.Option value="cash">Cash</Select.Option>
              <Select.Option value="card">Card</Select.Option>
            </Select>
          </Form.Item> */}

          <div>
            <h5>Subtotal: ₱ {subTotal.toFixed(2)}</h5>
            <h5>Vat 12%: ₱ {(subTotal * 0.12).toFixed(2)} </h5>
            <hr />
            <h5>Total: ₱ {grandTotal.toFixed(2)}</h5>
          </div>

          <div className="d-flex justify-content-end">
            <Button
              type="primary"
              htmlType="submit"
              onClick={() => setBillChargeModal(false)}
            >
              Generate Bill
            </Button>
          </div>
        </Form>
      </Modal>
      {/* <<<<CHARGE BILL MODAL ENDS HERE>>>>> */}
    </div>
  );
};

export default CartPage;
