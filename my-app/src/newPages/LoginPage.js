import React, { useEffect } from 'react';
import 'antd/dist/antd.min.css';
import { Button, Col, Form, Input, message, Row } from 'antd';

import { Link, useNavigate } from 'react-router-dom';
import '../resources/login.css';
import { useDispatch } from 'react-redux';
import axios from 'axios';
const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onFinish = (values) => {
    dispatch({ type: 'showLoading' });

    axios
      .post('/api/users/login', values)
      .then((res) => {
        dispatch({ type: 'hideLoading' });
        localStorage.setItem('post-user', JSON.stringify(res.data));
        //message.success('Logged in successfully');
        navigate('/home');
      })
      .catch((error) => {
        dispatch({ type: 'hideLoading' });
        message.error('Error: user not found.');
        console.log(error.response.status);
      });
  };

  useEffect(() => {
    const auth = JSON.parse(localStorage.getItem('post-user'));
    if (auth) {
      //   if (auth.accType === 'admin') {
      //     navigate('/home');
      //     // } else if (auth.accType === 'cashier') {
      //     //   navigate('/home');
      //   } else {
      //     navigate('/login');
      //   }
      if (auth.accType) {
        if (auth.accType === 'admin') {
          navigate('/home');
        } else {
          navigate('/' + auth.accType);
        }
      } else {
        navigate('/login');
      }
    }
  }, []);
  return (
    <div className="authentication">
      <Row>
        <Col lg={4} xs={12}>
          <Form layout="vertical" onFinish={onFinish}>
            <h2>
              Diner Tea <b>POS</b>
            </h2>
            <hr />
            <h5>Login </h5>

            <Form.Item label="Username" name="userId">
              <Input placeholder="Username"></Input>
            </Form.Item>
            <Form.Item label="Password" name="password">
              <Input.Password placeholder="Password"></Input.Password>
            </Form.Item>

            <div className="d-flex justify-content-between">
              <Link to="/register" className="login-link">
                Not yet registered? Click here
              </Link>
              <Button type="primary" htmlType="submit">
                Login
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
    </div>
  );
};

export default LoginPage;
