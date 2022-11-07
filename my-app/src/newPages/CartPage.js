import { Button, Form, Input, message, Modal, Table } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  DeleteOutlined,
  MinusCircleOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons';
import '../resources/cartPage.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';

const CartPage = () => {
  const componentRef = useRef();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartItems } = useSelector((state) => state.rootReducer);
  const [subTotalBeforeTax, setSubTotalBeforeTax] = useState(0);
  const [billChargeModal, setBillChargeModal] = useState(false);
  const [amountTendered, setAmountTendered] = useState(0);
  const [subTotalAfterTax, setSubTotalAfterTax] = useState(0);
  const [valueAddedTax, setValueAddedTax] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);
  const [printBillModalOpen, setPrintBillModalOpen] = useState(false);
  // const latestBill = JSON.parse(localStorage.getItem('latestBill'));
  const [latestBill, setLatestBill] = useState(null);

  let change = amountTendered - grandTotal;

  //let change = amountTendered - subTotal;
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
  const cartColumns = [
    {
      title: 'Name',
      dataIndex: 'name',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      render: (id, record) => <p id="bill-header-p">{record.price}</p>,
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
    },
    {
      title: 'Total',
      dataIndex: '_id',
      render: (id, record) => (
        <div>
          <p id="bill-header-p">
            {(record.price * record.quantity).toFixed(2)}
          </p>
        </div>
      ),
    },
  ];
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
      subTotalBeforeTax,
      subTotalAfterTax,
      tax: Number(valueAddedTax.toFixed(2)),
      totalAmount: Number(grandTotal.toFixed(2)),
      userId: JSON.parse(localStorage.getItem('post-user')).userId,
    };
    // console.log(reqObject);
    axios
      .post('/api/bills/charge-bill', reqObject)
      .then((res) => {
        message.success(res.data);
        // navigate('/bills');
        getLatestBill();
      })
      .catch(() => {
        message.success('Something went wrong.');
      });
  };

  const getLatestBill = () => {
    dispatch({ type: 'showLoading' });
    axios
      .get('/api/bills/get-latest-bill')
      .then((response) => {
        dispatch({ type: 'hideLoading' });
        setLatestBill(response.data);
        // localStorage.setItem('latestBill', JSON.stringify(response.data));
        //message.success('latestBill updated!');
        setPrintBillModalOpen(true);
      })
      .catch((error) => {
        message.error('Error getting latest bill');
        console.log(error);
      });
  };

  useEffect(() => {
    let temp = 0;
    cartItems.forEach((item) => {
      temp = temp + item.price * item.quantity;

      setSubTotalBeforeTax(temp);
    });
  }, [cartItems]);

  function handleAmountTendered(e) {
    const cash = Number(e.target.value);
    setAmountTendered(cash);
  }
  function handleCheckOut() {
    setBillChargeModal(true);
    setSubTotalAfterTax(Number(subTotalBeforeTax * 0.88));
    setValueAddedTax(Number(subTotalBeforeTax * 0.12));
    setGrandTotal(Number(subTotalBeforeTax));
  }

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  return (
    <div>
      <h3>Cart Items</h3>
      <Table columns={columns} dataSource={cartItems} rowKey="_id" />
      <hr />
      <div className="d-flex justify-content-end flex-column align-items-end">
        <div className="subtotal">
          {cartItems.length !== 0 && (
            <h3>SUBTOTAL: ₱ {subTotalBeforeTax.toFixed(2)}</h3>
          )}
        </div>
        {cartItems.length !== 0 && (
          <Button
            type="primary"
            onClick={() => {
              handleCheckOut();
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
        onCancel={() => {
          setBillChargeModal(false);
          setAmountTendered(0);
        }}
        footer={null}
        destroyOnClose={true}
      >
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item label="Customer name" name="customerName">
            <Input placeholder="Customer name"></Input>
          </Form.Item>

          <Form.Item label="Customer Phone Number" name="customerPhoneNumber">
            <Input placeholder="Phone number"></Input>
          </Form.Item>

          <Form.Item label="Amount Tendered" name="amountTendered">
            <Input
              placeholder="Enter Amount"
              type="number"
              onChange={handleAmountTendered}
              autoFocus={true}
              value={amountTendered}
            ></Input>
          </Form.Item>
          {/* <Form.Item label="Payment Mode" name="paymentMode">
            <Select placeholder="Payment mode">
              <Select.Option value="cash">Cash</Select.Option>
              <Select.Option value="card">Card</Select.Option>
            </Select>
          </Form.Item> */}

          <div>
            <h5>Amount Tendered: ₱ {amountTendered.toFixed(2)}</h5>
            <h5>Subtotal: ₱ {subTotalAfterTax.toFixed(2)}</h5>
            <h5>Vat 12%: ₱ {valueAddedTax.toFixed(2)} </h5>
            <hr />
            <h5>Total: ₱ {grandTotal.toFixed(2)}</h5>
            <h5>Change: ₱ {change < 0 ? 0 : change}</h5>
          </div>
          {amountTendered < grandTotal ? null : change > 1000 ? null : (
            <div className="d-flex justify-content-end">
              <Button
                type="primary"
                htmlType="submit"
                onClick={() => {
                  setBillChargeModal(false);
                }}
              >
                Generate Bill
              </Button>
            </div>
          )}
        </Form>
      </Modal>
      {/* <<<<CHARGE BILL MODAL ENDS HERE>>>>> */}

      {/* <<<<<<<<<<<<<<<<<<<< PRINT BILL MODAL STARTS HERE >>>>>>>>>>>>>> */}
      {printBillModalOpen && (
        <Modal
          title="Bill Details"
          open={printBillModalOpen}
          onCancel={() => setPrintBillModalOpen(false)}
          footer={null}
        >
          {latestBill.map((bill) => {
            return (
              <div>
                <div className="bill-model" ref={componentRef}>
                  <div
                    className="d-flex justify-content-between"
                    id="bill-header-container"
                  >
                    <div>
                      <h3>Dinner Tea</h3>
                    </div>

                    <div>
                      <p id="bill-header-p">Dasmarinas, Cavite</p>
                      <p id="bill-header-p">Tel#: 09191234567</p>
                      <p id="bill-header-p">Tin#:123456789</p>
                    </div>
                  </div>
                  <div className="mt-2">
                    <p id="bill-body-customer-info">
                      <b>Customer name: </b>
                      {bill.customerName}
                    </p>
                    <p id="bill-body-customer-info">
                      <b>Tel#: </b>
                      {bill.customerPhoneNumber}
                    </p>
                    <p id="bill-body-customer-info">
                      <b>Date: </b>
                      {bill.createdAt.toString().substring(0, 10)}
                    </p>
                    <p id="bill-body-customer-info">
                      <b>Cashier:</b> {bill.userId}
                    </p>
                    <p id="bill-body-customer-info">
                      <b>OR ID#:</b> {bill._id}
                    </p>
                  </div>
                  <Table
                    dataSource={bill.cartItems}
                    columns={cartColumns}
                    rowKey="_id"
                    pagination={false}
                  />
                  <hr />
                  <div>
                    <p id="bill-body-customer-info">
                      <b>Subtotal: </b>₱ {bill.subTotalAfterTax.toFixed(2)}
                    </p>
                    <p id="bill-body-customer-info">
                      <b>12% VAT: </b>₱ {bill.tax.toFixed(2)}
                    </p>
                    <hr />
                    <p id="bill-body-customer-info">
                      <b>Total: </b>₱ {bill.totalAmount.toFixed(2)}
                    </p>
                  </div>
                  <hr />
                  <div className="text-center d-flex justify-content-center ">
                    <p>Thank you,Come Again.</p>
                  </div>
                </div>
                <button onClick={handlePrint} autoFocus>
                  Print this out!
                </button>
              </div>
            );
          })}
        </Modal>
      )}
      {/* <<<<<<<<<<<<<<<<<<<< PRINT BILL MODAL ENDS HERE >>>>>>>>>>>>>> */}
    </div>
  );
};

export default CartPage;
