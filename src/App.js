import './App.css';
import Router from './config/router'
import {ConfigProvider} from 'antd'
import React from "react";
import zhCN from 'antd/lib/locale/zh_CN';
function App() {
    return (
        <ConfigProvider locale={zhCN}>
            <Router/>
        </ConfigProvider>
    );
}

export default App;
