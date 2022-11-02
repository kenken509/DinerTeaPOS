import { Button, Col, Form, Input, message, Row } from 'antd';
import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../resources/login.css';
import { useDispatch } from 'react-redux';
import axios from 'axios';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onFinish = (values) => {
    dispatch({ type: 'showLoading' });

    axios
      .post('/api/users/login', values)
      .then((res) => {
        dispatch({ type: 'hideLoading' });
        message.success('Successfully logged in.');
        localStorage.setItem('post-user', JSON.stringify(res.data));
        navigate('/home');
      })
      .catch((error) => {
        dispatch({ type: 'hideLoading' });
        message.error('Error: user not found.');
        console.log(error.response.status);
      });
  };

  useEffect(() => {
    if (localStorage.getItem('post-user')) {
      navigate('/home');
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

export default Login;
