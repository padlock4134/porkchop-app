// client/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { createGlobalStyle } from 'styled-components';
import AuthPage from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import RecipeSwiper from './pages/RecipeSwiper';
import NavBar from './components/ui/NavBar';

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

// Wrapper component that conditionally renders the NavBar
const AppLayout = ({ children }) => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/auth';
  
  return (
    <>
      {!isAuthPage && <NavBar />}
      {children}
    </>
  );
};

const App = () => {
  return (
    <Router>
      <GlobalStyle />
      <AppLayout>
        <Routes>
          <Route path="/" element={<Navigate to="/auth" replace />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/recipes" element={<RecipeSwiper />} />
        </Routes>
      </AppLayout>
    </Router>
  );
};

export default App;