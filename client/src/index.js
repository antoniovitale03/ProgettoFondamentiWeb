import React from 'react';
import ReactDOM from 'react-dom/client';
import './CSS/index.css';
import App from './App';
import {BrowserRouter} from "react-router-dom";
import {AuthProvider} from "./context/authContext";
import {NotificationProvider} from "./context/notificationContext";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
          <BrowserRouter>
              <AuthProvider>
                      <NotificationProvider>
                          <App />
                      </NotificationProvider>
              </AuthProvider>
          </BrowserRouter>
  </React.StrictMode>
);