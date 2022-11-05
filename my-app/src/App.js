import React from 'react';
import 'antd/dist/antd.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './newPages/LoginPage';
import AdminLayout from './components/AdminLayout';
import HomePage from './newPages/HomePage';
import LoginPage from './newPages/LoginPage';
import BillsPage from './newPages/BillsPage';
import ItemsPage from './newPages/ItemsPage';
import CustomersPage from './newPages/CustomersPage';
import EmployeesPage from './newPages/EmployeesPage';
import CashierLayout from './components/CashierLayout';
import CashierPage from './newPages/CashierPage';
import { message } from 'antd';
import CartPage from './newPages/CartPage';
import CashierBillsPage from './newPages/CashierBillsPage';

// import Items from './newPages/Items';
// import CartPage from './newPages/CartPage';
// import Login from './newPages/Login';
// import Bills from './newPages/Bills';
// import Customers from './newPages/Customers';
// import Employees from './newPages/Employees';
// import Admin from './newPages/Admin';
// import Cashier from './newPages/Cashier';
// import CashierBill from './newPages/CashierBill';
// import { message } from 'antd';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <ProtectedRouteAdmin>
              <AdminLayout />
            </ProtectedRouteAdmin>
          }
        >
          <Route
            path="home"
            element={
              <ProtectedRouteAdmin>
                <HomePage />
              </ProtectedRouteAdmin>
            }
          />
          <Route path="bills" element={<BillsPage />} />
          <Route path="items" element={<ItemsPage />} />
          <Route path="customers" element={<CustomersPage />} />
          <Route path="employees" element={<EmployeesPage />} />
        </Route>

        <Route
          path="/employees-page"
          element={
            <ProtectedRouteCashier>
              <CashierLayout />
            </ProtectedRouteCashier>
          }
        >
          <Route
            path="/employees-page/cashier"
            element={
              <ProtectedRouteCashier>
                <CashierPage />
              </ProtectedRouteCashier>
            }
          />
          <Route
            path="/employees-page/cart"
            element={
              <ProtectedRouteCashier>
                <CartPage />
              </ProtectedRouteCashier>
            }
          />
          <Route
            path="/employees-page/cashier-bills"
            element={
              <ProtectedRouteCashier>
                <CashierBillsPage />
              </ProtectedRouteCashier>
            }
          />
        </Route>
      </Routes>
    </div>
  );
}

export default App;

export function ProtectedRouteAdmin({ children }) {
  const auth = JSON.parse(localStorage.getItem('post-user'));

  if (auth) {
    if (auth.accType === 'admin') {
      return children;
    } else if (auth.accType === 'cashier') {
      localStorage.removeItem('post-user');
      message.error('Access denied!!!');
      return <Navigate to="/login" />;
    } else {
      return <Navigate to="/login" />;
    }
  } else {
    return <Navigate to="/login" />;
  }
  console.log(auth.accType);
  console.log(auth.firstName);
}

export function ProtectedRouteCashier({ children }) {
  const auth = JSON.parse(localStorage.getItem('post-user'));

  if (auth) {
    if (auth.accType === 'cashier') {
      return children;
    } else {
      return <Navigate to="/login" />;
    }
  } else {
    return <Navigate to="/login" />;
  }
  console.log(auth.accType);
  console.log(auth.firstName);
}
