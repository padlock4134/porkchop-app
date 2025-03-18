// client/src/pages/PricingPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { getCurrentUser } from '../lib/supabase';
import { backendApiClient } from '../api/backend-api-client';

const PricingContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
  font-family: 'Comic Sans MS', cursive, sans-serif;
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 3rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: #111;
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  color: #666;
  max-width: 600px;
  margin: 0 auto;
`;

const PlansContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 3rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

const PlanCard = styled.div`
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  width: 300px;
  display: flex;
  flex-direction: column;
  border: ${props => props.popular ? '3px solid #FF5722' : '1px solid #ddd'};
  position: relative;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  }
`;

const PopularBadge = styled.div`
  position: absolute;
  top: -12px;
  right: 20px;
  background-color: #FF5722;
  color: white;
  padding: 5px 15px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: bold;
`;

const PlanName = styled.h2`
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
  color: #111;
`;

const PlanPrice = styled.div`
  margin-bottom: 1.5rem;
`;

const Price = styled.span`
  font-size: 2.5rem;
  font-weight: bold;
  color: #111;
`;

const PriceDetail = styled.span`
  font-size: 1rem;
  color: #666;
`;

const FeaturesList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0 0 2rem 0;
  flex: 1;
`;

const Feature = styled.li`
  padding: 0.5rem 0;
  display: flex;
  align-items: center;
  
  &:before {
    content: "✓";
    color: #4CAF50;
    font-weight: bold;
    margin-right: 10px;
  }
`;

const SelectButton = styled.button`
  background-color: ${props => props.popular ? '#FF5722' : '#111'};
  color: white;
  border: none;
  border-radius: 30px;
  padding: 0.8rem 1.5rem;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
  margin-top: auto;
  
  &:hover {
    background-color: ${props => props.popular ? '#E64A19' : '#333'};
    transform: scale(1.05);
  }
  
  &:active {
    transform: scale(0.95);
  }
  
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
    transform: none;
  }
`;

const FAQContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const FAQTitle = styled.h2`
  text-align: center;
  margin-bottom: 2rem;
  font-size: 2rem;
`;

const FAQItem = styled.div`
  margin-bottom: 1.5rem;
  border-bottom: 1px dashed #ddd;
  padding-bottom: 1.5rem;
  
  &:last-child {
    border-bottom: none;
  }
`;

const FAQQuestion = styled.h3`
  margin-bottom: 0.5rem;
  font-size: 1.2rem;
  color: #111;
`;

const FAQAnswer = styled.p`
  color: #666;
  line-height: 1.5;
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50vh;
  font-size: 1.5rem;
  color: #666;
`;

const SuccessMessage = styled.div`
  background-color: #4CAF50;
  color: white;
  padding: 1rem;
  border-radius: 8px;
  margin: 1rem 0;
  text-align: center;
`;

const ErrorMessage = styled.div`
  background-color: #F44336;
  color: white;
  padding: 1rem;
  border-radius: 8px;
  margin: 1rem 0;
  text-align: center;
`;

const PricingPage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
          navigate('/auth');
          return;
        }
        setUser(currentUser);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  const handleSelectPlan = async (planId) => {
    setSelectedPlan(planId);
    
    try {
      setMessage({ type: '', text: '' });
      
      // Call your backend API to update the user's subscription
      const response = await backendApiClient.post('/v1/subscription', {
        userId: user.id,
        planId: planId
      });
      
      if (response.status === 200) {
        setMessage({ 
          type: 'success', 
          text: `You've successfully subscribed to the ${planId === 'free' ? 'Free' : planId === 'pro' ? 'Pro' : 'Family'} plan!` 
        });
        
        // After a short delay, redirect to dashboard
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      }
    } catch (error) {
      console.error('Error subscribing to plan:', error);
      setMessage({ 
        type: 'error', 
        text: 'There was an error processing your subscription. Please try again.' 
      });
    }
  };

  if (loading) {
    return <LoadingSpinner>Loading...</LoadingSpinner>;
  }

  return (
    <PricingContainer>
      <Header>
        <Title>Choose Your PorkChop Plan</Title>
        <Subtitle>
          Select the perfect plan for your cooking journey. Upgrade anytime as your needs change.
        </Subtitle>
      </Header>
      
      {message.type && (
        message.type === 'success' ? 
        <SuccessMessage>{message.text}</SuccessMessage> : 
        <ErrorMessage>{message.text}</ErrorMessage>
      )}
      
      <PlansContainer>
        <PlanCard>
          <PlanName>Free</PlanName>
          <PlanPrice>
            <Price>$0</Price>
            <PriceDetail>/month</PriceDetail>
          </PlanPrice>
          <FeaturesList>
            <Feature>Basic recipe suggestions</Feature>
            <Feature>Save up to 5 favorite recipes</Feature>
            <Feature>Standard ingredients database</Feature>
            <Feature>Basic meal planning</Feature>
          </FeaturesList>
          <SelectButton 
            onClick={() => handleSelectPlan('free')}
            disabled={selectedPlan === 'free'}
          >
            {selectedPlan === 'free' ? 'Selected' : 'Select Plan'}
          </SelectButton>
        </PlanCard>
        
        <PlanCard popular>
          <PopularBadge>MOST POPULAR</PopularBadge>
          <PlanName>Pro</PlanName>
          <PlanPrice>
            <Price>$7.99</Price>
            <PriceDetail>/month</PriceDetail>
          </PlanPrice>
          <FeaturesList>
            <Feature>Advanced recipe suggestions</Feature>
            <Feature>Unlimited favorite recipes</Feature>
            <Feature>Extended ingredients database</Feature>
            <Feature>Advanced meal planning</Feature>
            <Feature>Shopping list generation</Feature>
            <Feature>Nutritional information</Feature>
          </FeaturesList>
          <SelectButton 
            popular
            onClick={() => handleSelectPlan('pro')}
            disabled={selectedPlan === 'pro'}
          >
            {selectedPlan === 'pro' ? 'Selected' : 'Select Plan'}
          </SelectButton>
        </PlanCard>
        
        <PlanCard>
          <PlanName>Family</PlanName>
          <PlanPrice>
            <Price>$12.99</Price>
            <PriceDetail>/month</PriceDetail>
          </PlanPrice>
          <FeaturesList>
            <Feature>Everything in Pro plan</Feature>
            <Feature>Up to 5 family accounts</Feature>
            <Feature>Family meal preferences</Feature>
            <Feature>Shared shopping lists</Feature>
            <Feature>Cook together mode</Feature>
            <Feature>Priority chef assistance</Feature>
          </FeaturesList>
          <SelectButton 
            onClick={() => handleSelectPlan('family')}
            disabled={selectedPlan === 'family'}
          >
            {selectedPlan === 'family' ? 'Selected' : 'Select Plan'}
          </SelectButton>
        </PlanCard>
      </PlansContainer>
      
      <FAQContainer>
        <FAQTitle>Frequently Asked Questions</FAQTitle>
        
        <FAQItem>
          <FAQQuestion>Can I change my plan later?</FAQQuestion>
          <FAQAnswer>
            Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.
          </FAQAnswer>
        </FAQItem>
        
        <FAQItem>
          <FAQQuestion>How does the family plan work?</FAQQuestion>
          <FAQAnswer>
            With the family plan, you can create up to 5 linked accounts. Each family member gets their own profile with personal preferences, while sharing the same recipe database and shopping lists.
          </FAQAnswer>
        </FAQItem>
        
        <FAQItem>
          <FAQQuestion>Is there a free trial for paid plans?</FAQQuestion>
          <FAQAnswer>
            Yes, both the Pro and Family plans offer a 14-day free trial. You can cancel anytime during the trial period without being charged.
          </FAQAnswer>
        </FAQItem>
        
        <FAQItem>
          <FAQQuestion>What payment methods do you accept?</FAQQuestion>
          <FAQAnswer>
            We accept all major credit cards, PayPal, and Apple Pay for subscription payments.
          </FAQAnswer>
        </FAQItem>
      </FAQContainer>
    </PricingContainer>
  );
};

export default PricingPage;