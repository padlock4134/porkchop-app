// client/src/index.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App';
import { WristbandAuthProvider } from './context/WristbandAuthProvider';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <WristbandAuthProvider
      loginUrl={process.env.REACT_APP_LOGIN_URL}
      logoutUrl={process.env.REACT_APP_LOGOUT_URL}
      sessionUrl={process.env.REACT_APP_SESSION_URL}
    >
      <App />
    </WristbandAuthProvider>
  </React.StrictMode>
);
