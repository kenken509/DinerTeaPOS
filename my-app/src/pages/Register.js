import { Button, Col, Form, Input, message, Row } from 'antd';
import axios from 'axios';
import React from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import '../resources/register.css';

const Register = () => {
  const dispatch = useDispatch();
  const onFinish = (values) => {
    dispatch({ type: 'showLoading' });
    axios
      .post('/api/users/register', { ...values, verified: false })
      .then((res) => {
        dispatch({ type: 'hideLoading' });
        message.success(
          'Registration successful, please wait for verification.'
        );
      })
      .catch(() => {
        dispatch({ type: 'hideLoading' });
        message.error('Something went wrong.');
      });
  };
  return (
    <div className="authentication">
      <Row>
        <Col lg={4} xs={12}>
          <Form layout="vertical" onFinish={onFinish}>
            <h2>
              Diner Tea <b>POS</b>
            </h2>
            <hr />
            <h5>Register Form</h5>

            <Form.Item label="Name" name="name">
              <Input placeholder="Username"></Input>
            </Form.Item>

            <Form.Item label="Username" name="userId">
              <Input placeholder="Username"></Input>
            </Form.Item>
            <Form.Item label="Password" name="password">
              <Input.Password placeholder="Password"></Input.Password>
            </Form.Item>

            <div className="d-flex justify-content-between">
              <Link to="/login" className="login-link">
                Already registered? Log in
              </Link>
              <Button type="primary" htmlType="submit">
                Register
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
    </div>
  );
};

export default Register;
