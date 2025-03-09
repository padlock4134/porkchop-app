// client/src/pages/Auth.jsx
import React from 'react';
import styled from 'styled-components';
import AuthForm from '../components/auth/AuthForm';

const AuthPageContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
  background-image: url('/assets/images/steamboat-pattern.png');
`;

const Logo = styled.img`
  width: 150px;
  margin-bottom: 2rem;
`;

const AuthPage = () => {
  return (
    <AuthPageContainer>
      <Logo src="/assets/images/porkchop-logo.png" alt="PorkChop Logo" />
      <AuthForm />
    </AuthPageContainer>
  );
};

export default AuthPage;