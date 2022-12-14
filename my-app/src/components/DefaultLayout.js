import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  LogoutOutlined,
  HomeOutlined,
  CopyOutlined,
  UnorderedListOutlined,
  ShoppingCartOutlined,
  BarChartOutlined,
  UsergroupAddOutlined,
} from '@ant-design/icons';
import '../resources/layout.css';
import { Image, Layout, Menu, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Loading from '../resources/antd.loader/Loading';

const { Header, Sider, Content } = Layout;
const DefaultLayout = (props) => {
  const [collapsed, setCollapsed] = useState(true);
  const { cartItems, loading } = useSelector((state) => state.rootReducer);
  const navigate = useNavigate();
  const image = require('../uploads/crown.png');

  function navToCart() {
    navigate('/cart');
  }
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  return (
    <Layout>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        {collapsed ? (
          <Image width={70} src={image} id="company-logo" />
        ) : (
          <div id="company-logo-container">
            <Image width={50} src={image} id="company-logo" />
            <h5 id="dinner-tea-title">Dinner Tea</h5>
          </div>
        )}

        <Menu
          onClick={({ key }) => {
            if (key === '/logout') {
              localStorage.removeItem('post-user');
              navigate('/login');
            } else {
              navigate(key);
            }
          }}
          theme="dark"
          mode="inline"
          defaultSelectedKeys={window.location.pathname}
          items={[
            {
              key: '/home',
              icon: <HomeOutlined />,
              label: 'Home',
            },
            {
              key: '/cart',
              icon: <ShoppingCartOutlined />,
              label: 'Cart',
            },
            {
              key: '/bills',
              icon: <CopyOutlined />,
              label: 'Bills',
            },
            {
              key: '/items',
              icon: <UnorderedListOutlined />,
              label: 'Items',
            },
            {
              key: '/customers',
              icon: <UserOutlined />,
              label: 'Customers',
            },
            {
              key: '/employees',
              icon: <UsergroupAddOutlined />,
              label: 'Employees',
            },
            {
              key: '/sales-chart',
              icon: <BarChartOutlined />,
              label: 'Sales Chart',
            },

            {
              key: '/logout',
              icon: (
                <LogoutOutlined
                  onClick={() => {
                    localStorage.removeItem('post-user');
                  }}
                />
              ),
              label: 'Logout',
            },
          ]}
        />
      </Sider>
      <Layout className="site-layout">
        <Header
          className="site-layout-background"
          style={{
            padding: 10,
            margin: '0px 0px 0px 10px',
            borderRadius: 10,
          }}
        >
          {React.createElement(
            collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
            {
              className: 'trigger',
              onClick: () => setCollapsed(!collapsed),
            }
          )}
          <div id="header-title-container">
            <h1 id="header-title">
              Dinner Tea <b>POS</b>
            </h1>
          </div>
          <div
            className="cart-count d-flex align-items-center"
            onClick={navToCart}
          >
            <p className="mt-3">{cartItems.length}</p>
            <ShoppingCartOutlined />
          </div>
        </Header>
        <Content
          className="site-layout-background"
          style={{
            margin: '10px 0px 0px 10px',
            padding: 10,
            minHeight: 280,
            borderRadius: 10,
          }}
        >
          {loading && Loading()}

          {props.children}
        </Content>
      </Layout>
    </Layout>
  );
};
export default DefaultLayout;
