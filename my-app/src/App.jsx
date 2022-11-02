import 'antd/dist/antd.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Items from './pages/Items';
import React from 'react';
import CartPage from './pages/CartPage';
import Register from './pages/Register';
import Login from './pages/Login';
import EmployeesLogin from './pages/EmployessLogin';
import SalesCharts from './pages/SalesCharts';
import Bills from './pages/Bills';
import Customers from './pages/Customers';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route index element={<Login />} />
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/items"
            element={
              <ProtectedRoute>
                <Items />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <CartPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employees-login"
            element={
              <ProtectedRoute>
                <EmployeesLogin />
              </ProtectedRoute>
            }
          />
          <Route
            path="/sales-chart"
            element={
              <ProtectedRoute>
                <SalesCharts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/bills"
            element={
              <ProtectedRoute>
                <Bills />
              </ProtectedRoute>
            }
          />
          <Route
            path="/customers"
            element={
              <ProtectedRoute>
                <Customers />
              </ProtectedRoute>
            }
          />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

export function ProtectedRoute({ children }) {
  if (localStorage.getItem('post-user')) {
    return children;
  } else {
    return <Navigate to="/login" />;
  }
}
