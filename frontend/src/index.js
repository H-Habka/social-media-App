import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { BrowserRouter as Router } from 'react-router-dom'
import {PersistGate} from 'redux-persist/integration/react'
import {store, persistor} from './redux/store'
import {Provider} from 'react-redux'
import {createRoot} from 'react-dom/client'

const root = createRoot(document.getElementById('root'));

root.render(
  <Provider store={store}>
    <Router>
      <PersistGate persistor={persistor}>
        <App />
      </PersistGate>
    </Router>
  </Provider>
);

