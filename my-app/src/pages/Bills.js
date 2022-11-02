import react, { useEffect, useState, useRef } from 'react';
import DefaultLayout from '../components/DefaultLayout';
import axios from 'axios';
import { Modal, Table } from 'antd';
import { useDispatch } from 'react-redux';
import { EyeOutlined } from '@ant-design/icons';
import '../resources/bills.css';
import ReactToPrint, { useReactToPrint } from 'react-to-print';

const Bills = () => {
  const componentRef = useRef();

  const [billsData, setBillsData] = useState([]);
  const [billModalOpen, setBillModalOpen] = useState(false);
  const [selectedBills, setSelectedBills] = useState(null);
  const dispatch = useDispatch();
  //hideLoading
  function getAllBills() {
    dispatch({ type: 'showLoading' });
    axios
      .get('/api/bills/get-all-bills')
      .then((response) => {
        response.data.reverse();
        setBillsData(response.data);
        dispatch({ type: 'hideLoading' });
      })
      .catch((error) => {
        dispatch({ type: 'hideLoading' });
        console.log(error);
      });
  }
  useEffect(() => {
    getAllBills();
  }, []);

  function tester(values) {
    console.log(selectedBills);
  }
  const columns = [
    { title: 'Bill Id', dataIndex: '_id' },
    { title: 'Cashier', dataIndex: 'userId' },
    { title: 'Customer', dataIndex: 'customerName' },
    {
      title: 'Phone Number',
      dataIndex: 'customerPhoneNumber',
    },
    {
      title: 'SubTotal',
      dataIndex: 'subTotal',
    },
    { title: 'VAT 12%', dataIndex: 'tax' },
    { title: 'Total Amount', dataIndex: 'totalAmount' },
    {
      title: 'Actions',
      dataIndex: '_id',
      render: (id, record) => (
        <EyeOutlined
          className="mx-2"
          onClick={() => {
            setSelectedBills(record);
            tester(record);
            setBillModalOpen(true);
          }}
        />
      ),
    },
  ];

  const cartColumns = [
    {
      title: 'Name',
      dataIndex: 'name',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      render: (id, record) => (
        <p id="bill-header-p">{record.price.toFixed(2)}</p>
      ),
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
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  return (
    <DefaultLayout>
      <div>
        <h3>Bills Lists</h3>
      </div>

      <Table dataSource={billsData} columns={columns} rowKey="_id"></Table>

      {billModalOpen && (
        <Modal
          title="Bill Details"
          open={billModalOpen}
          onCancel={() => setBillModalOpen(false)}
          footer={null}
        >
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
                {selectedBills.customerName}
              </p>
              <p id="bill-body-customer-info">
                <b>Tel#: </b>
                {selectedBills.customerPhoneNumber}
              </p>
              <p id="bill-body-customer-info">
                <b>Date: </b>
                {selectedBills.createdAt.toString().substring(0, 10)}
              </p>
              <p>
                <b>Cashier:</b> {selectedBills.userId}
              </p>
            </div>
            <Table
              dataSource={selectedBills.cartItems}
              columns={cartColumns}
              rowKey="_id"
              pagination={false}
            />
            <hr />
            <div>
              <p id="bill-body-customer-info">
                <b>Subtotal: </b>₱ {selectedBills.subTotal.toFixed(2)}
              </p>
              <p id="bill-body-customer-info">
                <b>12% VAT: </b>₱ {selectedBills.tax.toFixed(2)}
              </p>
              <hr />
              <p id="bill-body-customer-info">
                <b>Total: </b>₱ {selectedBills.totalAmount.toFixed(2)}
              </p>
            </div>
            <hr />
            <div className="text-center d-flex justify-content-center">
              <p>Thank you,Come Again.</p>
            </div>
          </div>
          <button onClick={handlePrint}>Print this out!</button>
        </Modal>
      )}
    </DefaultLayout>
  );
};

export default Bills;
