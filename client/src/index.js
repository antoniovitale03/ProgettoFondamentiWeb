import React from 'react';
import ReactDOM from 'react-dom/client';
import './CSS/index.css';
import App from './App';
import {BrowserRouter} from "react-router-dom";
import {AuthProvider} from "./context/authContext";
import {FilmProvider} from "./context/filmContext";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
          <BrowserRouter>
              <AuthProvider>
                  <FilmProvider>
                      <App />
                  </FilmProvider>
              </AuthProvider>
          </BrowserRouter>
  </React.StrictMode>
);