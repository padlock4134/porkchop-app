// client/src/pages/RecipeSwiper.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion, useAnimation, useMotionValue, useTransform } from 'framer-motion';
import { getCurrentUser, logRecipeCooked } from '../lib/supabase';
import ChefFreddie from '../components/chef/ChefFreddie';

const SwiperContainer = styled.div`
  max-width: 600px;
  min-height: 100vh;
  margin: 0 auto;
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 1rem;
  font-family: 'Comic Sans MS', cursive, sans-serif;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 1.8rem;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
`;

const CardContainer = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 2rem 0;
  height: 70vh;
`;

const Card = styled(motion.div)`
  width: 90%;
  max-width: 400px;
  height: 500px; /* Fixed height instead of percentage */
  background-color: white;
  border-radius: 20px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  position: relative; /* Changed from absolute to relative */
  margin: 0 auto; /* Center horizontally */
  cursor: grab;
  border: 3px solid #111;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at center, transparent 90%, rgba(0, 0, 0, 0.1) 100%);
    pointer-events: none;
  }
`;

const CardFront = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  backface-visibility: hidden;
  position: absolute;
  top: 0;
  left: 0;
  transform: ${props => props.flipped ? 'rotateY(-180deg)' : 'rotateY(0)'};
  transition: transform 0.6s ease-in-out;
`;

const CardBack = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  backface-visibility: hidden;
  position: absolute;
  top: 0;
  left: 0;
  transform: ${props => props.flipped ? 'rotateY(0)' : 'rotateY(180deg)'};
  transition: transform 0.6s ease-in-out;
  overflow-y: auto;
  padding: 1.5rem;
`;

const RecipeImage = styled.div`
  width: 100%;
  height: 200px;
  background-color: #f5f5f5;
  background-image: ${props => props.image ? `url(${props.image})` : 'none'};
  background-size: cover;
  background-position: center;
`;

const RecipeContent = styled.div`
  padding: 1.5rem;
  flex: 1;
`;

const RecipeName = styled.h2`
  margin: 0 0 0.5rem;
  font-size: 1.5rem;
`;

const RecipeDescription = styled.p`
  margin: 0 0 1rem;
  color: #666;
`;

const RecipeIngredients = styled.div`
  margin-top: 1rem;
`;

const IngredientLabel = styled.span`
  display: inline-block;
  background-color: #f1f1f1;
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
`;

const MatchStrength = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background-color: ${props => {
    if (props.percentage >= 80) return '#4CAF50';
    if (props.percentage >= 60) return '#FFC107';
    return '#FF5722';
  }};
  color: white;
  padding: 0.3rem 0.6rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: bold;
`;

const RecipeTitle = styled.h2`
  margin: 0 0 1rem;
  font-size: 1.5rem;
  text-align: center;
  border-bottom: 2px solid #111;
  padding-bottom: 0.5rem;
`;

const RecipeSection = styled.div`
  margin-bottom: 1.5rem;
`;

const SectionTitle = styled.h3`
  margin: 0 0 0.5rem;
  font-size: 1.2rem;
`;

const RecipeStep = styled.div`
  display: flex;
  margin-bottom: 0.8rem;
`;

const StepNumber = styled.div`
  width: 24px;
  height: 24px;
  background-color: #111;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  margin-right: 0.8rem;
  flex-shrink: 0;
`;

const StepText = styled.p`
  margin: 0;
  flex: 1;
`;

const CookButton = styled.button`
  background-color: #111;
  color: white;
  border: none;
  border-radius: 50px;
  padding: 0.8rem 1.5rem;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  display: block;
  margin: 1rem auto;
  transition: transform 0.2s, background-color 0.3s;
  
  &:hover {
    transform: scale(1.05);
    background-color: #333;
  }
`;

const NoRecipesMessage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 70vh;
  text-align: center;
  padding: 2rem;
`;

const NoRecipesIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
`;

// Desktop Controls
const DesktopControls = styled.div`
  display: flex;
  justify-content: center;
  margin: 1.5rem 0;
  
  @media (max-width: 768px) {
    display: none; // Hide on mobile as swipe is preferred
  }
`;

const ControlButton = styled.button`
  background-color: ${props => props.action === 'like' ? '#4CAF50' : '#FF5722'};
  color: white;
  border: none;
  border-radius: 50px;
  margin: 0 0.5rem;
  padding: 0.8rem 1.5rem;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transition: transform 0.2s;
  
  &:hover {
    transform: scale(1.05);
  }
  
  svg {
    margin-right: 0.5rem;
  }
`;

const SwipeInstructions = styled.div`
  text-align: center;
  margin-bottom: 1rem;
  color: #666;
  font-size: 0.9rem;
  
  @media (min-width: 769px) {
    display: none; // Hide on desktop
  }
`;

const RecipeSwiper = () => {
  const [user, setUser] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [showChef, setShowChef] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  const cardControls = useAnimation();
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const dragConstraints = useRef(null);
  
  useEffect(() => {
    const fetchUserAndRecipes = async () => {
      const currentUser = await getCurrentUser();
      if (!currentUser) {
        navigate('/auth');
        return;
      }
      setUser(currentUser);
      
      // Fetch selected ingredients from session storage
      const selectedIngredients = JSON.parse(sessionStorage.getItem('selectedIngredients') || '{}');
      
      if (!selectedIngredients || Object.keys(selectedIngredients).length === 0) {
        navigate('/dashboard');
        return;
      }
      
      // Fetch recipes based on selected ingredients
      // This would be replaced with a real API call to your Supabase database
      try {
        // Mock data for demonstration
        const mockRecipes = [
          {
            id: 1,
            name: 'Chicken Stir Fry',
            description: 'A quick and easy stir fry with chicken and vegetables.',
            image: '/assets/images/chicken-stir-fry.jpg',
            match: 85,
            ingredients: [
              '2 chicken breasts, sliced',
              '1 bell pepper, sliced',
              '1 onion, sliced',
              '2 cloves garlic, minced',
              '1 tbsp ginger, minced',
              '2 tbsp soy sauce',
              '1 tbsp vegetable oil'
            ],
            steps: [
              'Heat oil in a large pan or wok over high heat.',
              'Add chicken and cook until golden, about 5 minutes.',
              'Add vegetables and stir fry for 3-4 minutes until crisp-tender.',
              'Add garlic and ginger, cook for 30 seconds.',
              'Pour in soy sauce and toss to coat everything.',
              'Serve hot over rice if desired.'
            ],
            cookTime: '15 minutes',
            servings: 2,
            requiredCookware: ['Frying Pan']
          },
          {
            id: 2,
            name: 'Vegetable Pasta',
            description: 'A simple pasta dish loaded with fresh vegetables.',
            image: '/assets/images/vegetable-pasta.jpg',
            match: 70,
            ingredients: [
              '8 oz pasta',
              '1 zucchini, diced',
              '1 bell pepper, diced',
              '1 cup cherry tomatoes, halved',
              '2 cloves garlic, minced',
              '2 tbsp olive oil',
              '1/4 cup parmesan cheese',
              'Fresh basil leaves'
            ],
            steps: [
              'Cook pasta according to package instructions.',
              'Heat olive oil in a large pan over medium heat.',
              'Add zucchini and bell pepper, cook for 4-5 minutes.',
              'Add tomatoes and garlic, cook for 2 more minutes.',
              'Drain pasta and add to the pan with vegetables.',
              'Toss to combine, sprinkle with cheese and basil.'
            ],
            cookTime: '20 minutes',
            servings: 2,
            requiredCookware: ['Pot', 'Frying Pan']
          },
          {
            id: 3,
            name: 'Herb Roasted Potatoes',
            description: 'Crispy potatoes with aromatic herbs.',
            image: '/assets/images/herb-potatoes.jpg',
            match: 60,
            ingredients: [
              '1.5 lbs potatoes, diced',
              '2 tbsp olive oil',
              '1 tsp rosemary',
              '1 tsp thyme',
              '2 cloves garlic, minced',
              'Salt and pepper to taste'
            ],
            steps: [
              'Preheat oven to 425°F (220°C).',
              'Toss potatoes with olive oil, herbs, garlic, salt, and pepper.',
              'Spread in a single layer on a baking sheet.',
              'Roast for 25-30 minutes, turning halfway, until golden and crispy.'
            ],
            cookTime: '35 minutes',
            servings: 4,
            requiredCookware: ['Oven']
          }
        ];
        
        setRecipes(mockRecipes);
      } catch (error) {
        console.error('Error fetching recipes:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserAndRecipes();
  }, [navigate]);
  
  const handleDragEnd = async (event, info) => {
    const threshold = 100; // minimum distance to trigger a swipe
    
    if (info.offset.x > threshold) {
      // Swiped right - like recipe
      handleLikeRecipe();
    } else if (info.offset.x < -threshold) {
      // Swiped left - dislike recipe
      handleSkipRecipe();
    } else {
      // Not enough movement, reset card position
      cardControls.start({
        x: 0,
        transition: { type: 'spring', stiffness: 300, damping: 20 }
      });
    }
  };

  // Handler functions for desktop controls
  const handleLikeRecipe = async () => {
    setFlipped(true);
    setSelectedRecipe(recipes[currentIndex]);
  };

  const handleSkipRecipe = async () => {
    // Animate card swiping left
    await cardControls.start({
      x: -500,
      opacity: 0,
      transition: { duration: 0.3 }
    });
    
    if (currentIndex < recipes.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
    
    // Reset card position
    cardControls.set({ x: 0, opacity: 1 });
  };
  
  const handleCookButtonClick = async () => {
    // Log that this recipe was cooked
    if (user && selectedRecipe) {
      try {
        await logRecipeCooked(user.id, selectedRecipe.id);
      } catch (error) {
        console.error('Error logging recipe cook:', error);
      }
    }
    
    // Show Chef Freddie
    setShowChef(true);
  };
  
  const handleBackClick = () => {
    navigate('/dashboard');
  };
  
  if (loading) {
    return <div>Loading recipes...</div>;
  }
  
  if (recipes.length === 0) {
    return (
      <SwiperContainer>
        <Header>
          <BackButton onClick={handleBackClick}>← Back</BackButton>
          <Title>No Recipes Found</Title>
        </Header>
        
        <NoRecipesMessage>
          <NoRecipesIcon>😕</NoRecipesIcon>
          <h2>No recipes match your ingredients</h2>
          <p>Try selecting different ingredients or fewer requirements.</p>
          <BackButton onClick={handleBackClick}>
            Back to Ingredients
          </BackButton>
        </NoRecipesMessage>
      </SwiperContainer>
    );
  }
  
  return (
    <SwiperContainer>
      <Header>
        <BackButton onClick={handleBackClick}>← Back</BackButton>
        <Title>Recipe Finder</Title>
      </Header>
      
      <SwipeInstructions>
        Swipe right to view recipe, swipe left to skip
      </SwipeInstructions>
      
      <CardContainer ref={dragConstraints}>
        {recipes.length > currentIndex && (
          <Card
            drag={!flipped ? "x" : false}
            dragConstraints={dragConstraints}
            onDragEnd={handleDragEnd}
            animate={cardControls}
            style={{ x, rotate }}
            whileTap={{ cursor: 'grabbing' }}
          >
            <CardFront flipped={flipped}>
              <RecipeImage image={recipes[currentIndex].image} />
              <RecipeContent>
                <RecipeName>{recipes[currentIndex].name}</RecipeName>
                <RecipeDescription>{recipes[currentIndex].description}</RecipeDescription>
                
                <RecipeIngredients>
                  {recipes[currentIndex].ingredients.slice(0, 5).map((ingredient, index) => (
                    <IngredientLabel key={index}>
                      {ingredient.split(',')[0]}
                    </IngredientLabel>
                  ))}
                  {recipes[currentIndex].ingredients.length > 5 && (
                    <IngredientLabel>+{recipes[currentIndex].ingredients.length - 5} more</IngredientLabel>
                  )}
                </RecipeIngredients>
              </RecipeContent>
              
              <MatchStrength percentage={recipes[currentIndex].match}>
                {recipes[currentIndex].match}% Match
              </MatchStrength>
            </CardFront>
            
            <CardBack flipped={flipped}>
              <RecipeTitle>{recipes[currentIndex].name}</RecipeTitle>
              
              <RecipeSection>
                <SectionTitle>Ingredients</SectionTitle>
                {recipes[currentIndex].ingredients.map((ingredient, index) => (
                  <RecipeStep key={index}>
                    <StepNumber>•</StepNumber>
                    <StepText>{ingredient}</StepText>
                  </RecipeStep>
                ))}
              </RecipeSection>
              
              <RecipeSection>
                <SectionTitle>Instructions</SectionTitle>
                {recipes[currentIndex].steps.map((step, index) => (
                  <RecipeStep key={index}>
                    <StepNumber>{index + 1}</StepNumber>
                    <StepText>{step}</StepText>
                  </RecipeStep>
                ))}
              </RecipeSection>
              
              <RecipeSection>
                <SectionTitle>Details</SectionTitle>
                <RecipeStep>
                  <StepNumber>⏱️</StepNumber>
                  <StepText>Cook Time: {recipes[currentIndex].cookTime}</StepText>
                </RecipeStep>
                <RecipeStep>
                  <StepNumber>👥</StepNumber>
                  <StepText>Servings: {recipes[currentIndex].servings}</StepText>
                </RecipeStep>
                <RecipeStep>
                  <StepNumber>🍳</StepNumber>
                  <StepText>Cookware: {recipes[currentIndex].requiredCookware.join(', ')}</StepText>
                </RecipeStep>
              </RecipeSection>
              
              <CookButton onClick={handleCookButtonClick}>
                I'll Cook This!
              </CookButton>
            </CardBack>
          </Card>
        )}
      </CardContainer>
      
      {/* Desktop controls */}
      {!flipped && (
        <DesktopControls>
          <ControlButton action="dislike" onClick={handleSkipRecipe}>
            ✕ Skip
          </ControlButton>
          <ControlButton action="like" onClick={handleLikeRecipe}>
            ✓ View Recipe
          </ControlButton>
        </DesktopControls>
      )}
      
      {showChef && <ChefFreddie recipe={selectedRecipe} onClose={() => setShowChef(false)} />}
    </SwiperContainer>
  );
};

export default RecipeSwiper;
