// client/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { createGlobalStyle } from 'styled-components';

import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import RecipeSwiper from './pages/RecipeSwiper';
import PricingPage from './pages/PricingPage';
import NavBar from './components/ui/NavBar';
import LoadingSpinner from './components/ui/LoadingSpinner';
import { useWristbandAuth } from './context/WristbandAuthProvider';

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
  }
  
  body {
    margin: 0;
    padding: 0;
    font-family: 'Comic Sans MS', cursive, sans-serif;
    background-color: #f9f9f9;
    background-image: url('/assets/images/subtle-pattern.png');
  }
  
  button {
    font-family: 'Comic Sans MS', cursive, sans-serif;
  }
`;

// Wrapper component that conditionally renders the Dashboard
const AppLayout = ({ children }) => {
  const { isAuthenticated } = useWristbandAuth();
  
  return isAuthenticated ? (
    <>
      <NavBar />
      {children}
    </>
  ) : (
    <LoadingSpinner />
  );
};

const App = () => {
  return (
    <Router>
      <GlobalStyle />
      <AppLayout>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/recipes" element={<RecipeSwiper />} />
          <Route path="/pricing" element={<PricingPage />} />
        </Routes>
      </AppLayout>
    </Router>
  );
};

export default App;