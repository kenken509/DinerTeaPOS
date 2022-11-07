import {
  Button,
  Col,
  Form,
  Image,
  Input,
  message,
  Modal,
  Row,
  Select,
  Table,
} from 'antd';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../resources/login.css';
import { useDispatch } from 'react-redux';
import axios from 'axios';

import { DeleteOutlined } from '@ant-design/icons';
import '../resources/Employees.css';

const EmployeesPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [usersData, setUsersData] = useState([]);
  const [addEditEmployeeModal, setAddEditEmployeeModal] = useState(false);
  const [loginOpenModal, setLoginOpenModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [form] = Form.useForm();

  //********************************************************************** */

  const onFinish = (values) => {
    dispatch({ type: 'showLoading' });

    if (loginOpenModal) {
      axios
        .post('api/users/login', values)
        .then((res) => {
          dispatch({ type: 'hideLoading' });
          localStorage.setItem('post-user', JSON.stringify(res.data));
          navigate('/employees-page/cashier');
          //message.success(res.data);
          message.success('Successfully logged in.');
        })
        .catch((error) => {
          dispatch({ type: 'hideLoading' });
          message.error('Something went wrong!');
          console.log(error);
        });
      navigate('/employees-page/cashier');
    } else if (addEditEmployeeModal) {
      //message.success('addEditEmployeeModal activated!');
      const userExist = usersData.find((data) => data.userId === values.userId);

      if (userExist) {
        message.error('User exist! try another one.');
      } else {
        axios
          .post('/api/users/add-employee', { ...values, verified: true })
          .then((res) => {
            dispatch({ type: 'hideLoading' });
            message.success(
              'Registration successful, please wait for verification.'
            );
            setAddEditEmployeeModal(false);
            getAllUsers();
            console.log(res.data);
          })
          .catch(() => {
            dispatch({ type: 'hideLoading' });
            message.error('Something 1111111 went wrong.');
          });
      }
    }
  };
  //*********************************************************** */

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
  const getAllUsers = () => {
    dispatch({ type: 'showLoading' });
    axios
      .get('/api/users/get-all-users')
      .then((response) => {
        dispatch({ type: 'hideLoading' });
        setUsersData(response.data);
      })
      .catch((error) => {
        dispatch({ type: 'hideLoading' });
        console.log(error);
      });
  };
  //******************************************************/

  const storage = JSON.parse(localStorage.getItem('post-user'));

  // useEffect(() => {
  //   if (localStorage.getItem('post-user')) {
  //     navigate('/home');
  //   }
  // }, []);
  useEffect(() => {
    getAllUsers();
  }, []);

  const deleteUser = (record) => {
    dispatch({ type: 'showLoading' });
    axios
      .post('/api/users/delete-employee', { userID: record._id })
      .then((response) => {
        dispatch({ type: 'hideLoading' });
        message.success(response.data);
        getAllUsers();
      })
      .catch((error) => {
        dispatch({ type: 'hideLoading' });
        message.error('Failed to delete employee.');
      });
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'firstName',
    },
    {
      title: 'Image',
      dataIndex: 'image',
      render: (image, record) => (
        <Image src={image} alt="user image" width={60} height={60} />
      ),
    },
    {
      title: 'Username',
      dataIndex: 'userId',
    },
    {
      title: 'Account Type',
      dataIndex: 'accType',
    },
    {
      title: 'Actions',
      dataIndex: '_id',
      render: (_id, record) => (
        <div className="d-flex">
          <DeleteOutlined
            className="delete-user-icon"
            onClick={() => {
              deleteUser(record);
            }}
          />
        </div>
      ),
    },
  ];
  function tester() {
    message.success('tester activated');
  }

  return (
    <div>
      <div className="d-flex justify-content-between">
        <div className="d-flex">
          <Button
            type="primary"
            htmlType="submit"
            onClick={() => {
              setAddEditEmployeeModal(true);
            }}
          >
            <p>Add user</p>
          </Button>
        </div>

        <h3>Employees List</h3>
        <Button
          type="primary"
          htmlType="submit"
          onClick={() => setLoginOpenModal(true)}
        >
          Login
        </Button>
      </div>
      {/* <<<<<<<ADD EMPLOYEE MODAL COMPONENT STARTS HERE>>>>> */}
      {addEditEmployeeModal && (
        <Modal
          title="Add Employee"
          open={addEditEmployeeModal}
          onCancel={() => {
            setAddEditEmployeeModal(false);
          }}
          footer={false}
          onFinish={onFinish}
          className="employee-modal"
        >
          <Form
            layout="vertical"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            form={form}
          >
            <h2>Employee Info</h2>
            <hr />

            <Row gutter={16}>
              <Col span={12} mx={2}>
                <Form.Item
                  label="First Name"
                  name="firstName"
                  rules={[
                    {
                      required: true,
                      message: 'Please input your name!',
                    },
                  ]}
                >
                  <Input placeholder="First name" required></Input>
                </Form.Item>
                <Form.Item
                  label="Last Name"
                  name="lastName"
                  rules={[
                    {
                      required: true,
                      message: 'Please input your last name!',
                    },
                  ]}
                >
                  <Input placeholder="Last name"></Input>
                </Form.Item>
                <Form.Item
                  label="Account Type"
                  name="accType"
                  rules={[
                    {
                      required: true,
                      message: 'Please select account type!',
                    },
                  ]}
                >
                  <Select placeholder="Job title">
                    <Select.Option value="admin">Admin</Select.Option>
                    <Select.Option value="cashier">Cashier</Select.Option>
                  </Select>
                </Form.Item>
                <Form.Item
                  label="Employee's ID#"
                  name="employeeId"
                  rules={[
                    {
                      required: true,
                      message: "Please input employee's id!",
                    },
                  ]}
                >
                  <Input type="number" placeholder="ID number"></Input>
                </Form.Item>
              </Col>
              <Col span={12} mx={2}>
                <Form.Item label="Employee's Image" name="image">
                  <Input placeholder="Image URL"></Input>
                </Form.Item>

                <Form.Item
                  label="Username"
                  name="userId"
                  rules={[
                    {
                      required: true,
                      message: 'Please input your username!',
                    },
                  ]}
                >
                  <Input placeholder="Username"></Input>
                </Form.Item>

                <Form.Item
                  label="Password"
                  name="password"
                  hasFeedback
                  rules={[
                    {
                      required: true,
                      message: 'Please input your password',
                    },
                    {
                      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
                      message:
                        'Minimum eight characters, at least one uppercase letter, one lowercase letter and one number',
                    },
                  ]}
                >
                  <Input.Password placeholder="Password"></Input.Password>
                </Form.Item>
                <Form.Item
                  label="Confirm Password"
                  name="confirmPassword"
                  dependencies={['password']}
                  hasFeedback
                  rules={[
                    {
                      required: true,
                      message: 'Please confirm your password!',
                    },
                    ({ getFieldValue }) => ({
                      validator(rule, value) {
                        if (!value || getFieldValue('password') === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          'The two passwords that you entered do not match!'
                        );
                      },
                    }),
                  ]}
                >
                  <Input.Password placeholder="Confirm password"></Input.Password>
                </Form.Item>
              </Col>
            </Row>
            <hr />
            <div className="d-flex justify-content-end">
              <Button type="primary" htmlType="submit">
                Save
              </Button>
            </div>
          </Form>
        </Modal>
      )}

      {/* <<<<<<<ADD EMPLOYEE COMPONENT ENDS HERE>>>>> */}

      {/* <<<<<<<LOG IN MODAL COMPONENT STARTS HERE>>>>> */}
      <Modal
        title="Login Form"
        open={loginOpenModal}
        onCancel={() => setLoginOpenModal(false)}
        footer={false}
      >
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item label="Username" name="userId">
            <Input placeholder="Username" required></Input>
          </Form.Item>
          <Form.Item label="Password" name="password">
            <Input.Password placeholder="Password" required></Input.Password>
          </Form.Item>

          <div className="d-flex justify-content-end">
            <Button type="primary" htmlType="submit">
              Login
            </Button>
          </div>
        </Form>
      </Modal>
      {/* <<<<<<<LOG IN MODAL COMPONENT ENDS HERE>>>>> */}

      <Table columns={columns} dataSource={usersData} rowKey="_id"></Table>
    </div>
  );
};

export default EmployeesPage;
