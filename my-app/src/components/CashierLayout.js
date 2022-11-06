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
  BarcodeOutlined,
} from '@ant-design/icons';
import '../resources/layout.css';
import {
  Button,
  Card,
  Dropdown,
  Image,
  Layout,
  Menu,
  message,
  Table,
  Tooltip,
} from 'antd';
import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Loading from '../resources/antd.loader/Loading';

const { Header, Sider, Content } = Layout;

const CashierLayout = (props) => {
  const [collapsed, setCollapsed] = useState(true);
  const { cartItems, loading, cartViewItems } = useSelector(
    (state) => state.rootReducer
  );

  const [subTotal, setSubTotal] = useState(0);
  const navigate = useNavigate();
  const image = require('../uploads/crown.png');
  const dispatch = useDispatch();

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  function toggleCartViewItem() {
    dispatch({ type: 'cartViewItemsToggle' });
  }

  const column = [
    {
      title: 'Items',
      dataIndex: 'image',
      render: (image, record) => (
        <img src={record.image} alt="error" width="40px" height="40px" />
      ),
    },
    { title: 'Qty', dataIndex: 'quantity' },
    {
      title: 'Amt',
      dataIndex: 'price',
      render: (price, record) => <p>{price.toFixed(2)}</p>,
    },
  ];
  useEffect(() => {
    let temp = 0;
    cartItems.forEach((item) => {
      temp = temp + item.price * item.quantity;

      setSubTotal(temp);
    });
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
              key: '/employees-page/cashier',
              icon: <BarcodeOutlined />,
              label: 'Cashier',
            },
            {
              key: '/employees-page/cart',
              icon: <ShoppingCartOutlined />,
              label: 'Cart',
            },
            {
              key: '/employees-page/cashier-bills',
              icon: <CopyOutlined />,
              label: 'Bills',
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
            onClick={toggleCartViewItem}
          >
            <p className="mt-3">{cartItems.length}</p>
            <ShoppingCartOutlined />;
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
          <Outlet />
          {props.children}
          {cartViewItems && (
            <Card
              size="small"
              style={{
                width: '300px',
                position: 'absolute',
                top: '80px',
                right: '50px',
                backgroundColor: 'whitesmoke',
              }}
            >
              <Table
                columns={column}
                dataSource={cartItems}
                pagination={false}
                rowKey="_id"
              ></Table>
              <h3>Total: ₱ {subTotal.toFixed(2)}</h3>
              <div className="d-flex justify-content-end">
                <Button type="primary" htmlType="submit">
                  Check out
                </Button>
              </div>
            </Card>
          )}
        </Content>
      </Layout>
    </Layout>
  );
};
export default CashierLayout;
