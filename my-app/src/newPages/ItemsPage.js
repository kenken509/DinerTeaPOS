import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Table, Modal, Form, Input, Select, message } from 'antd';
import '../resources/items.css';

function ItemsPage() {
  const [itemsData, setItemsData] = useState([]);
  const [addEditModalOpen, setAddEditModalOpen] = useState(false);
  const [editingItems, setEditingItems] = useState(null);
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

  const deleteItem = (record) => {
    dispatch({ type: 'showLoading' });
    axios
      .post('/api/items/delete-item', { itemId: record._id })
      .then((response) => {
        dispatch({ type: 'hideLoading' });
        message.success(response.data);
        getAllItems();
      })
      .catch((error) => {
        //let err = error.response.request.status;
        dispatch({ type: 'hideLoading' });
        message.error('Failed to delete product.');
        console.log(error);
      });
  };

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
      render: (text) => <p>P {text.toFixed(2)}</p>,
    },
    {
      title: 'Actions',
      dataIndex: '_id',
      render: (id, record) => (
        <div className="d-flex">
          <EditOutlined
            className="mx-2"
            onClick={() => {
              setEditingItems(record);
              setAddEditModalOpen(true);
            }}
          />
          <DeleteOutlined className="mx-2" onClick={() => deleteItem(record)} />
        </div>
      ),
    },
  ];

  useEffect(() => {
    getAllItems();
  }, []);

  const onFinish = (values) => {
    dispatch({ type: 'showLoading' });
    if (editingItems === null) {
      axios
        .post('/api/items/add-item', values)
        .then((response) => {
          dispatch({ type: 'hideLoading' });
          message.success(response.data);
          setAddEditModalOpen(false);
          getAllItems();
        })
        .catch((error) => {
          dispatch({ type: 'hideLoading' });
          console.log(error);
        });
    } else {
      axios
        .post('/api/items/edit-item', { ...values, itemId: editingItems._id })
        .then((response) => {
          dispatch({ type: 'hideLoading' });
          message.success(response.data);
          setEditingItems(null);
          setAddEditModalOpen(false);
          getAllItems();
        })
        .catch((error) => {
          dispatch({ type: 'hideLoading' });
          console.log(error);
        });
    }
  };
  return (
    <div>
      <div className="d-flex justify-content-between">
        <h3>Admin PRODUCT LIST</h3>
        <Button
          type="primary"
          onClick={() => {
            setAddEditModalOpen(true);
          }}
        >
          Add Item
        </Button>
        {addEditModalOpen && (
          <Modal
            open={addEditModalOpen}
            onCancel={() => {
              setEditingItems(null);
              setAddEditModalOpen(false);
              console.log(editingItems);
            }}
            title={`${
              editingItems !== null ? 'Edit Product' : 'Add New Product'
            }`}
            footer={false}
          >
            <Form
              layout="vertical"
              onFinish={onFinish}
              initialValues={editingItems}
            >
              <Form.Item label="Product Name" name="name">
                <Input placeholder="Product name"></Input>
              </Form.Item>

              <Form.Item label="Product Price" name="price">
                <Input placeholder="Product name"></Input>
              </Form.Item>

              <Form.Item label="Product Image" name="image">
                <Input placeholder="Image URL"></Input>
              </Form.Item>

              <Form.Item label="Product Category" name="category">
                <Select placeholder="Select Category">
                  <Select.Option value="fruits">Fruits</Select.Option>
                  <Select.Option value="veggies">Vegetables</Select.Option>
                  <Select.Option value="meat">Meat</Select.Option>
                </Select>
              </Form.Item>
              <div className="d-flex justify-content-end">
                <Button type="primary" htmlType="submit">
                  Save
                </Button>
              </div>
            </Form>
          </Modal>
        )}
      </div>
      <Table columns={columns} dataSource={itemsData} rowKey="_id" />
    </div>
  );
}

export default ItemsPage;
