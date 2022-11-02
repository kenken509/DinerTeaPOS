import { Alert, Spin } from 'antd';
import React from 'react';
import './Loading.css';
const Loading = () => (
  <div className="loadingContainer">
    <Spin tip="Loading..." size="large"></Spin>;
  </div>
);
export default Loading;
