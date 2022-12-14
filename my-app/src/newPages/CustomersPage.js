import react, { useEffect, useState, useRef } from 'react';

import axios from 'axios';
import { Table } from 'antd';
import { useDispatch } from 'react-redux';

import '../resources/bills.css';
import ReactToPrint, { useReactToPrint } from 'react-to-print';

const CustomersPage = () => {
  const [billsData, setBillsData] = useState([]);
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
    console.log(billsData);
  }
  //tester();
  const columns = [
    { title: 'Customer', dataIndex: 'customerName' },
    {
      title: 'Phone Number',
      dataIndex: 'customerPhoneNumber',
    },
    {
      title: 'Transaction Date',
      dataIndex: 'createdAt',
      render: (id, record) => (
        <p>{record.createdAt.toString().substring(0, 10)}</p>
      ),
    },
  ];

  return (
    <div>
      <div>
        <h3>Customers List</h3>
      </div>

      <Table dataSource={billsData} columns={columns} rowKey="_id"></Table>
    </div>
  );
};

export default CustomersPage;
