import React from 'react';
import styled, { keyframes } from 'styled-components';

// Animation keyframes
const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

const spinReverse = keyframes`
  to {
    transform: rotate(-360deg);
  }
`;

const pulse = keyframes`
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
`;

const bounce = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-15px);
  }
`;

// Styled components
const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom right, #fff8e1, #ffe0b2);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 50;
`;

const SpinnerWrapper = styled.div`
  position: relative;
`;

const OuterCircle = styled.div`
  width: 96px;
  height: 96px;
  border-radius: 50%;
  border-top: 4px solid #f97316; /* orange-500 */
  border-right: 4px solid transparent;
  border-bottom: 4px solid transparent;
  border-left: 4px solid transparent;
  animation: ${spin} 1.5s linear infinite;
`;

const InnerCircle = styled.div`
  position: absolute;
  top: 8px;
  left: 8px;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border-bottom: 4px solid #f87171; /* red-400 */
  border-right: 4px solid transparent;
  border-top: 4px solid transparent;
  border-left: 4px solid transparent;
  animation: ${spinReverse} 3s linear infinite;
`;

const IconWrapper = styled.div`
  position: absolute;
  top: 24px;
  left: 24px;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ea580c; /* orange-600 */
  animation: ${pulse} 2s ease-in-out infinite;
`;

const LoadingText = styled.p`
  margin-top: 32px;
  font-size: 20px;
  font-weight: 500;
  color: #9a3412; /* orange-800 */
  animation: ${pulse} 2s ease-in-out infinite;
`;

const BouncingDotsContainer = styled.div`
  position: absolute;
  bottom: 32px;
  display: flex;
`;

const BouncingDot = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  margin: 0 16px;
  animation: ${bounce} 1s ease infinite;
  animation-delay: ${props => props.delay || '0ms'};
`;

const OrangeDot = styled(BouncingDot)`
  background-color: #fed7aa; /* orange-200 */
`;

const RedDot = styled(BouncingDot)`
  background-color: #fecaca; /* red-200 */
`;

const AmberDot = styled(BouncingDot)`
  background-color: #fde68a; /* amber-200 */
`;

const FullPageSpinner = () => {
  return (
    <Container>
      <SpinnerWrapper>
        <OuterCircle />
        <InnerCircle />
        <IconWrapper>
          <svg 
            width="36" 
            height="36" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M12 2a8 8 0 0 0-8 8c0 5 8 12 8 12s8-7 8-12a8 8 0 0 0-8-8zm0 10.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z"/>
          </svg>
        </IconWrapper>
      </SpinnerWrapper>
      
      <LoadingText>Cooking up something special...</LoadingText>
      
      <BouncingDotsContainer>
        <OrangeDot delay="0ms" />
        <RedDot delay="100ms" />
        <AmberDot delay="200ms" />
      </BouncingDotsContainer>
    </Container>
  );
};

export default FullPageSpinner;
