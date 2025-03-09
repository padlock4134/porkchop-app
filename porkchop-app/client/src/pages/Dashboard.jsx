// client/src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import IngredientCard from '../components/cards/IngredientCard';
import { getCurrentUser } from '../lib/supabase';

const DashboardContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
  font-family: 'Comic Sans MS', cursive, sans-serif;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 2rem;
`;

const Logo = styled.img`
  height: 60px;
`;

const Subtitle = styled.p`
  margin-top: 0.5rem;
  color: #666;
  font-size: 1.1rem;
`;

const CardsContainer = styled.div`
  display: flex;
  overflow-x: auto;
  padding: 1rem 0;
  scroll-behavior: smooth;
  
  &::-webkit-scrollbar {
    height: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 10px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
`;

const FindRecipesButton = styled.button`
  display: block;
  margin: 2rem auto 0;
  background-color: #111;
  color: white;
  border: none;
  border-radius: 50px;
  padding: 1rem 2rem;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.2s, background-color 0.3s;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  
  &:hover {
    transform: scale(1.05);
    background-color: #333;
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

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  
  const [proteins, setProteins] = useState([
    { name: 'Chicken', selected: false },
    { name: 'Beef', selected: false },
    { name: 'Pork', selected: false },
    { name: 'Fish', selected: false },
    { name: 'Tofu', selected: false },
    { name: 'Eggs', selected: false },
    { name: 'Beans', selected: false },
  ]);
  
  const [veggies, setVeggies] = useState([
    { name: 'Broccoli', selected: false },
    { name: 'Carrots', selected: false },
    { name: 'Spinach', selected: false },
    { name: 'Peppers', selected: false },
    { name: 'Onions', selected: false },
    { name: 'Tomatoes', selected: false },
    { name: 'Potatoes', selected: false },
  ]);
  
  const [herbs, setHerbs] = useState([
    { name: 'Basil', selected: false },
    { name: 'Cilantro', selected: false },
    { name: 'Parsley', selected: false },
    { name: 'Thyme', selected: false },
    { name: 'Rosemary', selected: false },
    { name: 'Oregano', selected: false },
    { name: 'Mint', selected: false },
  ]);
  
  const [cookware, setCookware] = useState([
    { name: 'Frying Pan', selected: false },
    { name: 'Pot', selected: false },
    { name: 'Oven', selected: false },
    { name: 'Grill', selected: false },
    { name: 'Slow Cooker', selected: false },
    { name: 'Instant Pot', selected: false },
    { name: 'Air Fryer', selected: false },
  ]);
  
  useEffect(() => {
    const fetchUser = async () => {
      const currentUser = await getCurrentUser();
      if (!currentUser) {
        navigate('/auth');
        return;
      }
      setUser(currentUser);
    };
    
    fetchUser();
  }, [navigate]);
  
  const toggleProtein = (index) => {
    setProteins(prev => prev.map((item, i) => 
      i === index ? { ...item, selected: !item.selected } : item
    ));
  };
  
  const toggleVeggie = (index) => {
    setVeggies(prev => prev.map((item, i) => 
      i === index ? { ...item, selected: !item.selected } : item
    ));
  };
  
  const toggleHerb = (index) => {
    setHerbs(prev => prev.map((item, i) => 
      i === index ? { ...item, selected: !item.selected } : item
    ));
  };
  
  const toggleCookware = (index) => {
    setCookware(prev => prev.map((item, i) => 
      i === index ? { ...item, selected: !item.selected } : item
    ));
  };
  
  const addProtein = (name) => {
    setProteins(prev => [...prev, { name, selected: true }]);
  };
  
  const addVeggie = (name) => {
    setVeggies(prev => [...prev, { name, selected: true }]);
  };
  
  const addHerb = (name) => {
    setHerbs(prev => [...prev, { name, selected: true }]);
  };
  
  const addCookware = (name) => {
    setCookware(prev => [...prev, { name, selected: true }]);
  };
  
  const handleFindRecipes = () => {
    // Get all selected items
    const selectedProteins = proteins.filter(p => p.selected).map(p => p.name);
    const selectedVeggies = veggies.filter(v => v.selected).map(v => v.name);
    const selectedHerbs = herbs.filter(h => h.selected).map(h => h.name);
    const selectedCookware = cookware.filter(c => c.selected).map(c => c.name);
    
    // Store selections in session storage
    sessionStorage.setItem('selectedIngredients', JSON.stringify({
      proteins: selectedProteins,
      veggies: selectedVeggies,
      herbs: selectedHerbs,
      cookware: selectedCookware
    }));
    
    // Navigate to recipe swiper
    navigate('/recipes');
  };
  
  const hasSelectedItems = () => {
    return proteins.some(p => p.selected) || 
           veggies.some(v => v.selected) || 
           herbs.some(h => h.selected) || 
           cookware.some(c => c.selected);
  };
  
  if (!user) {
    return <div>Loading...</div>;
  }
  
  return (
    <DashboardContainer>
      <Header>
        <div>
          <Title>What's in your kitchen?</Title>
          <Subtitle>Select the ingredients you have and we'll find delicious recipes!</Subtitle>
        </div>
        <Logo src="/assets/images/porkchop-logo.png" alt="PorkChop Logo" />
      </Header>
      
      <CardsContainer>
        <IngredientCard 
          title="Proteins" 
          items={proteins} 
          onItemToggle={toggleProtein} 
          onAddItem={addProtein}
        />
        <IngredientCard 
          title="Veggies" 
          items={veggies} 
          onItemToggle={toggleVeggie} 
          onAddItem={addVeggie}
        />
        <IngredientCard 
          title="Herbs & Spices" 
          items={herbs} 
          onItemToggle={toggleHerb} 
          onAddItem={addHerb}
        />
        <IngredientCard 
          title="Cookware" 
          items={cookware} 
          onItemToggle={toggleCookware} 
          onAddItem={addCookware}
        />
      </CardsContainer>
      
      <FindRecipesButton 
        onClick={handleFindRecipes}
        disabled={!hasSelectedItems()}
      >
        Find Recipes
      </FindRecipesButton>
    </DashboardContainer>
  );
};

export default Dashboard;