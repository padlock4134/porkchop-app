// client/src/components/auth/AuthForm.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 400px;
  margin: 0 auto;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  background-color: #fff;
  font-family: 'Comic Sans MS', cursive, sans-serif; /* Steamboat Willie inspired */
`;

const Title = styled.h2`
  font-size: 2rem;
  margin-bottom: 2rem;
  text-align: center;
  color: #111;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  margin-bottom: 1rem;
  border: 2px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s;
  
  &:focus {
    border-color: #333;
    outline: none;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 0.75rem;
  background-color: #111;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: transform 0.2s, background-color 0.3s;
  
  &:hover {
    transform: scale(1.05);
    background-color: #333;
  }
  
  &:active {
    transform: scale(0.95);
  }
`;

const ToggleButton = styled.button`
  background: none;
  border: none;
  color: #555;
  margin-top: 1rem;
  cursor: pointer;
  text-decoration: underline;
  font-size: 0.9rem;
`;

const ErrorMessage = styled.p`
  color: red;
  font-size: 0.9rem;
  margin-bottom: 1rem;
`;

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

// In AuthForm.jsx, modify the handleSubmit function

const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Skip all authentication for now and just navigate
    console.log("Bypassing authentication and going to dashboard");
    navigate('/dashboard');
    
    // This bypasses the authentication process entirely
    // We can fix the actual authentication later
  };

  return (
    <FormContainer>
      <Title>{isLogin ? 'Welcome to PorkChop!' : 'Join PorkChop!'}</Title>
      
      {error && <ErrorMessage>{error}</ErrorMessage>}
      
      <form onSubmit={handleSubmit} style={{ width: '100%' }}>
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        
        <Button type="submit">
          {isLogin ? 'Log In' : 'Sign Up'}
        </Button>
      </form>
      
      <ToggleButton onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? "Don't have an account? Sign up" : "Already have an account? Log in"}
      </ToggleButton>
    </FormContainer>
  );
};

export default AuthForm;
