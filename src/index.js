import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';
import App from './App';
import AuthContextProvider from './components/context/auth-context';

ReactDOM.render(
  <AuthContextProvider>
    bbbb<App />
  </AuthContextProvider>, document.getElementById('root'));
