import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {RecoilRoot} from "recoil";
import {BrowserRouter as Router, Navigate, Route, Routes} from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RecoilRoot>
      <Router>
        <Routes>
          <Route path="/admin" element={<App/>}/>
          <Route path="*" element={<Navigate to="/admin" />} />
        </Routes>
      </Router>
    </RecoilRoot>
  </React.StrictMode>,
)
