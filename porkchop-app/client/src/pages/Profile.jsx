// client/src/pages/Profile.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { getCurrentUser } from '../lib/supabase';
import { analyticsData, mockRecipes, socialConnections } from '../data/mock-data';
import { redirectToLogout } from '../utils/auth-helpers';

// Styled Components
const ProfileContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
  font-family: 'Comic Sans MS', cursive, sans-serif;
`;

const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
`;

const Avatar = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-color: ${props => props.color || '#ddd'};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1.5rem;
  font-size: 2.5rem;
  color: white;
  border: 3px solid #111;
  overflow: hidden;
  position: relative;
  cursor: pointer;
  
  &:hover::after {
    content: 'Change';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.9rem;
  }
`;

const AvatarImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const AvatarUpload = styled.input`
  display: none;
`;

const UserInfo = styled.div`
  flex: 1;
`;

const Username = styled.h1`
  margin: 0;
  font-size: 2rem;
`;

const Email = styled.p`
  margin: 0.5rem 0 0;
  color: #666;
`;

const ProfileActions = styled.div`
  display: flex;
  flex-direction: column;
`;

const LogoutButton = styled.button`
  background-color: transparent;
  color: #666;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: #f1f1f1;
    color: #333;
  }
`;

const TabsContainer = styled.div`
  display: flex;
  border-bottom: 2px solid #eee;
  margin-bottom: 2rem;
  overflow-x: auto;
  
  @media (max-width: 768px) {
    padding-bottom: 0.5rem;
  }
`;

const Tab = styled.button`
  padding: 1rem 1.5rem;
  background: none;
  border: none;
  font-size: 1.1rem;
  font-weight: ${props => props.active ? 'bold' : 'normal'};
  color: ${props => props.active ? '#111' : '#666'};
  cursor: pointer;
  position: relative;
  white-space: nowrap;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 100%;
    height: 2px;
    background-color: ${props => props.active ? '#111' : 'transparent'};
  }
  
  &:hover {
    color: #111;
  }
`;

const Section = styled.section`
  background-color: white;
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const SectionTitle = styled.h2`
  margin-top: 0;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  border-bottom: 2px dashed #ddd;
  padding-bottom: 0.5rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const FormRow = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.5rem;
  }
`;

const Label = styled.label`
  display: block;
  font-weight: bold;
  margin-bottom: 0.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #111;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 0.7rem center;
  background-size: 1em;
  
  &:focus {
    outline: none;
    border-color: #111;
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: #111;
  }
`;

const CheckboxContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  background-color: ${props => props.checked ? '#111' : '#f1f1f1'};
  color: ${props => props.checked ? 'white' : '#333'};
  font-size: 0.9rem;
  transition: all 0.2s;
  
  &:hover {
    background-color: ${props => props.checked ? '#333' : '#ddd'};
  }
`;

const HiddenCheckbox = styled.input`
  display: none;
`;

const SaveButton = styled.button`
  background-color: #111;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 1rem;
  
  &:hover {
    background-color: #333;
    transform: translateY(-2px);
  }
  
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const RecipeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
`;

const RecipeCard = styled.div`
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border: 2px solid #eee;
  transition: transform 0.2s, box-shadow 0.2s;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
  }
`;

const RecipeImage = styled.div`
  height: 150px;
  background-color: #f5f5f5;
  background-image: ${props => props.image ? `url(${props.image})` : 'none'};
  background-size: cover;
  background-position: center;
`;

const RecipeContent = styled.div`
  padding: 1rem;
`;

const RecipeTitle = styled.h3`
  margin: 0 0 0.5rem;
  font-size: 1.2rem;
`;

const RecipeMeta = styled.div`
  display: flex;
  justify-content: space-between;
  color: #666;
  font-size: 0.9rem;
  margin-top: 0.5rem;
`;

const RecipeActions = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
`;

const RecipeButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.color || '#666'};
  cursor: pointer;
  font-size: 0.9rem;
  padding: 0.3rem 0.6rem;
  border-radius: 4px;
  
  &:hover {
    background-color: #f1f1f1;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;

const GridItem = styled.div`
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 1rem;
  border: 1px solid #eee;
  display: flex;
  flex-direction: column;
  position: relative;
`;

const GridItemTitle = styled.h4`
  margin: 0 0 0.5rem;
  font-size: 1rem;
`;

const GridItemActions = styled.div`
  display: flex;
  margin-top: auto;
  justify-content: flex-end;
`;

const Badge = styled.span`
  background-color: ${props => props.color || '#f1f1f1'};
  color: ${props => props.textColor || '#333'};
  padding: 0.3rem 0.6rem;
  border-radius: 20px;
  font-size: 0.8rem;
  display: inline-block;
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;
`;

const StatCard = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  color: #666;
  font-size: 0.9rem;
`;

const SocialGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;

const SocialCard = styled.div`
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 1rem;
  text-align: center;
  border: 1px solid #eee;
  cursor: pointer;
  transition: transform 0.2s;
  
  &:hover {
    transform: scale(1.05);
    background-color: #f5f5f5;
  }
`;

const SocialAvatar = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #ddd;
  margin: 0 auto 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: white;
  overflow: hidden;
`;

const SocialName = styled.div`
  font-size: 0.9rem;
  margin-bottom: 0.2rem;
  font-weight: bold;
`;

const SocialMeta = styled.div`
  font-size: 0.8rem;
  color: #666;
`;

// Main Profile Component
const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('personal');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const avatarInputRef = useRef(null);

  // Profile data states
  const [personalInfo, setPersonalInfo] = useState({
    displayName: '',
    email: '',
    phone: '',
    bio: ''
  });

  const [dietary, setDietary] = useState({
    restrictions: [],
    allergies: [],
    cuisines: []
  });

  const [cooking, setCooking] = useState({
    servingSize: 2,
    skillLevel: 'intermediate',
    cookware: [],
    maxCookTime: 60
  });

  const [recipeHistory, setRecipeHistory] = useState({
    cooked: [],
    saved: [],
    rated: []
  });

  const [pantryItems, setPantryItems] = useState([]);
  const [newPantryItem, setNewPantryItem] = useState({ name: '', quantity: '', expiry: '' });

  const [shoppingList, setShoppingList] = useState([]);
  const [newShoppingItem, setNewShoppingItem] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
          navigate('/auth');
          return;
        }

        setUser(currentUser);

        // Simulate loading user preferences from database
        setPersonalInfo({
          displayName: currentUser.user_metadata?.name || 'PorkChop User',
          email: currentUser.email,
          phone: currentUser.user_metadata?.phone || '',
          bio: currentUser.user_metadata?.bio || 'I love cooking with PorkChop!'
        });

        // In a real app, you'd fetch these from your database
        setRecipeHistory({
          cooked: mockRecipes,
          saved: mockRecipes.filter(r => r.isSaved),
          rated: mockRecipes.filter(r => r.rating > 0)
        });

        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = async () => {
    redirectToLogout(process.env.REACT_APP_LOGOUT_URL);
  };

  const handleSavePersonalInfo = async () => {
    setIsSaving(true);
    // In a real app, you'd save to your database
    setTimeout(() => {
      setIsSaving(false);
      alert('Personal information saved!');
    }, 1000);
  };

  const handleSaveDietary = async () => {
    setIsSaving(true);
    // In a real app, you'd save to your database
    setTimeout(() => {
      setIsSaving(false);
      alert('Dietary preferences saved!');
    }, 1000);
  };

  const handleSaveCooking = async () => {
    setIsSaving(true);
    // In a real app, you'd save to your database
    setTimeout(() => {
      setIsSaving(false);
      alert('Cooking preferences saved!');
    }, 1000);
  };

  const handleAddPantryItem = () => {
    if (newPantryItem.name.trim() === '') return;

    setPantryItems([...pantryItems, { 
      id: Date.now(), 
      ...newPantryItem 
    }]);
    setNewPantryItem({ name: '', quantity: '', expiry: '' });
  };

  const handleRemovePantryItem = (id) => {
    setPantryItems(pantryItems.filter(item => item.id !== id));
  };

  const handleAddShoppingItem = () => {
    if (newShoppingItem.trim() === '') return;

    setShoppingList([...shoppingList, { 
      id: Date.now(), 
      name: newShoppingItem,
      checked: false
    }]);
    setNewShoppingItem('');
  };

  const handleToggleShoppingItem = (id) => {
    setShoppingList(shoppingList.map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
  };

  const handleRemoveShoppingItem = (id) => {
    setShoppingList(shoppingList.filter(item => item.id !== id));
  };

  const handleAvatarClick = () => {
    avatarInputRef.current.click();
  };

  const handleAvatarChange = (e) => {
    // In a real app, you'd upload the image to storage and update the user profile
    console.log('Avatar file selected:', e.target.files[0]);
  };

  // Options for dietary and cookware
  const dietaryOptions = {
    restrictions: ['Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Keto', 'Paleo', 'Low-Carb', 'Low-Fat'],
    allergies: ['Nuts', 'Shellfish', 'Eggs', 'Soy', 'Wheat', 'Fish', 'Milk'],
    cuisines: ['Italian', 'Mexican', 'Asian', 'Mediterranean', 'Indian', 'American', 'French', 'Middle Eastern']
  };

  const cookwareOptions = ['Frying Pan', 'Pot', 'Oven', 'Grill', 'Slow Cooker', 'Instant Pot', 'Air Fryer', 'Blender', 'Food Processor'];

  if (isLoading) {
    return <div>Loading user profile...</div>;
  }

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };

  const getRandomColor = (id) => {
    const colors = ['#4CAF50', '#2196F3', '#FF5722', '#9C27B0', '#FF9800', '#795548'];
    return colors[id % colors.length];
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'personal':
        return (
          <Section>
            <SectionTitle>Personal Information</SectionTitle>
            <FormGroup>
              <Label htmlFor="displayName">Display Name</Label>
              <Input 
                id="displayName"
                value={personalInfo.displayName}
                onChange={e => setPersonalInfo({ ...personalInfo, displayName: e.target.value })}
                placeholder="Your name"
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="email">Email Address</Label>
              <Input 
                id="email"
                value={personalInfo.email}
                onChange={e => setPersonalInfo({ ...personalInfo, email: e.target.value })}
                placeholder="Your email"
                type="email"
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="phone">Phone Number (optional)</Label>
              <Input 
                id="phone"
                value={personalInfo.phone}
                onChange={e => setPersonalInfo({ ...personalInfo, phone: e.target.value })}
                placeholder="Your phone number"
                type="tel"
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="bio">Bio</Label>
              <Textarea 
                id="bio"
                value={personalInfo.bio}
                onChange={e => setPersonalInfo({ ...personalInfo, bio: e.target.value })}
                placeholder="Tell us about yourself and your cooking style"
              />
            </FormGroup>
            <SaveButton onClick={handleSavePersonalInfo} disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Changes'}
            </SaveButton>
          </Section>
        );
      case 'dietary':
        return (
          <Section>
            <SectionTitle>Dietary Preferences</SectionTitle>
            <FormGroup>
              <Label>Dietary Restrictions</Label>
              <CheckboxContainer>
                {dietaryOptions.restrictions.map(option => (
                  <CheckboxLabel key={option} checked={dietary.restrictions.includes(option)}>
                    <HiddenCheckbox 
                      type="checkbox"
                      checked={dietary.restrictions.includes(option)}
                      onChange={() => {
                        if (dietary.restrictions.includes(option)) {
                          setDietary({
                            ...dietary,
                            restrictions: dietary.restrictions.filter(r => r !== option)
                          });
                        } else {
                          setDietary({
                            ...dietary,
                            restrictions: [...dietary.restrictions, option]
                          });
                        }
                      }}
                    />
                    {option}
                  </CheckboxLabel>
                ))}
              </CheckboxContainer>
            </FormGroup>
            <FormGroup>
              <Label>Allergies</Label>
              <CheckboxContainer>
                {dietaryOptions.allergies.map(option => (
                  <CheckboxLabel key={option} checked={dietary.allergies.includes(option)}>
                    <HiddenCheckbox 
                      type="checkbox"
                      checked={dietary.allergies.includes(option)}
                      onChange={() => {
                        if (dietary.allergies.includes(option)) {
                          setDietary({
                            ...dietary,
                            allergies: dietary.allergies.filter(a => a !== option)
                          });
                        } else {
                          setDietary({
                            ...dietary,
                            allergies: [...dietary.allergies, option]
                          });
                        }
                      }}
                    />
                    {option}
                  </CheckboxLabel>
                ))}
              </CheckboxContainer>
            </FormGroup>
            <FormGroup>
              <Label>Preferred Cuisines</Label>
              <CheckboxContainer>
                {dietaryOptions.cuisines.map(option => (
                  <CheckboxLabel key={option} checked={dietary.cuisines.includes(option)}>
                    <HiddenCheckbox 
                      type="checkbox"
                      checked={dietary.cuisines.includes(option)}
                      onChange={() => {
                        if (dietary.cuisines.includes(option)) {
                          setDietary({
                            ...dietary,
                            cuisines: dietary.cuisines.filter(c => c !== option)
                          });
                        } else {
                          setDietary({
                            ...dietary,
                            cuisines: [...dietary.cuisines, option]
                          });
                        }
                      }}
                    />
                    {option}
                  </CheckboxLabel>
                ))}
              </CheckboxContainer>
            </FormGroup>
            <SaveButton onClick={handleSaveDietary} disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Preferences'}
            </SaveButton>
          </Section>
        );
      case 'cooking':
        return (
          <Section>
            <SectionTitle>Cooking Preferences</SectionTitle>
            <FormGroup>
              <Label htmlFor="servingSize">How many people do you typically cook for?</Label>
              <Select 
                id="servingSize"
                value={cooking.servingSize}
                onChange={e => setCooking({ ...cooking, servingSize: parseInt(e.target.value) })}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                  <option key={num} value={num}>{num} {num === 1 ? 'person' : 'people'}</option>
                ))}
              </Select>
            </FormGroup>
            <FormGroup>
              <Label htmlFor="skillLevel">Your Cooking Skill Level</Label>
              <Select 
                id="skillLevel"
                value={cooking.skillLevel}
                onChange={e => setCooking({ ...cooking, skillLevel: e.target.value })}
              >
                <option value="beginner">Beginner - I'm learning the basics</option>
                <option value="intermediate">Intermediate - I can follow most recipes</option>
                <option value="advanced">Advanced - I'm comfortable with complex techniques</option>
                <option value="professional">Professional - I have formal training or experience</option>
              </Select>
            </FormGroup>
            <FormGroup>
              <Label htmlFor="cookTime">Maximum Cooking Time (minutes)</Label>
              <Input 
                id="cookTime"
                type="number"
                min="5"
                max="180"
                value={cooking.maxCookTime}
                onChange={e => setCooking({ ...cooking, maxCookTime: parseInt(e.target.value) })}
              />
            </FormGroup>
            <FormGroup>
              <Label>Available Cookware</Label>
              <CheckboxContainer>
                {cookwareOptions.map(option => (
                  <CheckboxLabel key={option} checked={cooking.cookware.includes(option)}>
                    <HiddenCheckbox 
                      type="checkbox"
                      checked={cooking.cookware.includes(option)}
                      onChange={() => {
                        if (cooking.cookware.includes(option)) {
                          setCooking({
                            ...cooking,
                            cookware: cooking.cookware.filter(c => c !== option)
                          });
                        } else {
                          setCooking({
                            ...cooking,
                            cookware: [...cooking.cookware, option]
                          });
                        }
                      }}
                    />
                    {option}
                  </CheckboxLabel>
                ))}
              </CheckboxContainer>
            </FormGroup>
            <SaveButton onClick={handleSaveCooking} disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Preferences'}
            </SaveButton>
          </Section>
        );
      case 'history':
        return (
          <Section>
            <SectionTitle>Recipe History</SectionTitle>
            <RecipeGrid>
              {recipeHistory.cooked.map(recipe => (
                <RecipeCard key={recipe.id}>
                  <RecipeImage image={recipe.image} />
                  <RecipeContent>
                    <RecipeTitle>{recipe.name}</RecipeTitle>
                    <RecipeMeta>
                      <span>Saved on: {new Date(recipe.date).toLocaleDateString()}</span>
                    </RecipeMeta>
                    <RecipeActions>
                      <RecipeButton color="#4CAF50" onClick={() => navigate(`/recipes/${recipe.id}`)}>
                        Cook Now
                      </RecipeButton>
                      <RecipeButton color="#FF5722">
                        Unsave
                      </RecipeButton>
                    </RecipeActions>
                  </RecipeContent>
                </RecipeCard>
              ))}
            </RecipeGrid>
          </Section>
        );
      case 'inventory':
        return (
          <Section>
            <SectionTitle>Kitchen Inventory</SectionTitle>
            <FormRow>
              <FormGroup style={{ flex: 2 }}>
                <Label htmlFor="itemName">Ingredient</Label>
                <Input 
                  id="itemName"
                  value={newPantryItem.name}
                  onChange={e => setNewPantryItem({ ...newPantryItem, name: e.target.value })}
                  placeholder="e.g. Chicken breast"
                />
              </FormGroup>
              <FormGroup style={{ flex: 1 }}>
                <Label htmlFor="itemQuantity">Quantity</Label>
                <Input 
                  id="itemQuantity"
                  value={newPantryItem.quantity}
                  onChange={e => setNewPantryItem({ ...newPantryItem, quantity: e.target.value })}
                  placeholder="e.g. 2 lbs"
                />
              </FormGroup>
              <FormGroup style={{ flex: 1 }}>
                <Label htmlFor="itemExpiry">Expiry Date</Label>
                <Input 
                  id="itemExpiry"
                  type="date"
                  value={newPantryItem.expiry}
                  onChange={e => setNewPantryItem({ ...newPantryItem, expiry: e.target.value })}
                />
              </FormGroup>
            </FormRow>
            <SaveButton 
              onClick={handleAddPantryItem} 
              disabled={!newPantryItem.name}
              style={{ marginTop: 0 }}
            >
              Add Item
            </SaveButton>
            
            <Grid style={{ marginTop: '2rem' }}>
              {pantryItems.map(item => {
                const isExpiringSoon = item.expiry && new Date(item.expiry) <= new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
                const isExpired = item.expiry && new Date(item.expiry) <= new Date();
                
                return (
                  <GridItem key={item.id}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <GridItemTitle>{item.name}</GridItemTitle>
                      {isExpired && (
                        <Badge color="#FF5722" textColor="white">Expired</Badge>
                      )}
                      {isExpiringSoon && !isExpired && (
                        <Badge color="#FFC107">Expiring Soon</Badge>
                      )}
                    </div>
                    <div style={{ margin: '0.5rem 0', color: '#666' }}>
                      {item.quantity && <div>{item.quantity}</div>}
                      {item.expiry && <div>Expires: {new Date(item.expiry).toLocaleDateString()}</div>}
                    </div>
                    <GridItemActions>
                      <RecipeButton color="#FF5722" onClick={() => handleRemovePantryItem(item.id)}>
                        Remove
                      </RecipeButton>
                    </GridItemActions>
                  </GridItem>
                );
              })}
              {pantryItems.length === 0 && (
                <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#666', padding: '2rem' }}>
                  No items in your pantry yet. Add ingredients to get started!
                </div>
              )}
            </Grid>
            
            <div style={{ marginTop: '3rem' }}>
              <SectionTitle>Shopping List</SectionTitle>
              <FormRow>
                <Input 
                  value={newShoppingItem}
                  onChange={e => setNewShoppingItem(e.target.value)}
                  placeholder="Enter an item to buy"
                  onKeyPress={e => e.key === 'Enter' && handleAddShoppingItem()}
                />
                <SaveButton 
                  onClick={handleAddShoppingItem} 
                  disabled={!newShoppingItem}
                  style={{ marginTop: 0, marginLeft: '0.5rem' }}
                >
                  Add
                </SaveButton>
              </FormRow>
              
              <Grid style={{ marginTop: '1rem' }}>
                {shoppingList.map(item => (
                  <GridItem key={item.id} style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <div style={{ display: 'flex', flex: 1 }}>
                      <input 
                        type="checkbox" 
                        checked={item.checked} 
                        onChange={() => handleToggleShoppingItem(item.id)}
                        style={{ marginRight: '0.5rem' }}
                      />
                      <span style={{ textDecoration: item.checked ? 'line-through' : 'none' }}>
                        {item.name}
                      </span>
                    </div>
                    <RecipeButton color="#666" onClick={() => handleRemoveShoppingItem(item.id)}>
                      ✕
                    </RecipeButton>
                  </GridItem>
                ))}
                {shoppingList.length === 0 && (
                  <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#666', padding: '1rem' }}>
                    Your shopping list is empty. Add items to get started!
                  </div>
                )}
              </Grid>
            </div>
          </Section>
        );
      case 'analytics':
        return (
          <Section>
            <SectionTitle>Your Cooking Analytics</SectionTitle>
            <Grid style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))' }}>
              <StatCard>
                <StatValue>{analyticsData.recipesCooked}</StatValue>
                <StatLabel>Recipes Cooked</StatLabel>
              </StatCard>
              <StatCard>
                <StatValue>{analyticsData.favoriteIngredient}</StatValue>
                <StatLabel>Favorite Ingredient</StatLabel>
              </StatCard>
              <StatCard>
                <StatValue>{analyticsData.wasteSaved}</StatValue>
                <StatLabel>Food Waste Saved</StatLabel>
              </StatCard>
            </Grid>
            
            <div style={{ marginTop: '2rem' }}>
              <h3>Your Top Cuisines</h3>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                {analyticsData.topCuisines.map((cuisine, index) => (
                  <Badge key={cuisine} color="#111" textColor="white">
                    {index + 1}. {cuisine}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div style={{ marginTop: '2rem' }}>
              <h3>Nutrition Insights</h3>
              <Grid style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginTop: '0.5rem' }}>
                <div>
                  <Badge 
                    color={analyticsData.nutritionInsights.protein === 'High' ? '#4CAF50' : '#FFC107'} 
                    textColor="white"
                  >
                    Protein: {analyticsData.nutritionInsights.protein}
                  </Badge>
                </div>
                <div>
                  <Badge 
                    color={analyticsData.nutritionInsights.carbs === 'High' ? '#FFC107' : '#4CAF50'} 
                    textColor="white"
                  >
                    Carbs: {analyticsData.nutritionInsights.carbs}
                  </Badge>
                </div>
                <div>
                  <Badge 
                    color={analyticsData.nutritionInsights.fat === 'High' ? '#FFC107' : '#4CAF50'} 
                    textColor="white"
                  >
                    Fat: {analyticsData.nutritionInsights.fat}
                  </Badge>
                </div>
              </Grid>
            </div>
            
            <div style={{ marginTop: '2rem' }}>
              <h3>Recipe Suggestions Based on Your Cooking Patterns</h3>
              <RecipeGrid>
                {mockRecipes.map(recipe => (
                  <RecipeCard key={recipe.id}>
                    <RecipeImage image={recipe.image} />
                    <RecipeContent>
                      <RecipeTitle>{recipe.name}</RecipeTitle>
                      <RecipeMeta>
                        <span>95% Match</span>
                      </RecipeMeta>
                      <RecipeActions>
                        <RecipeButton color="#4CAF50" onClick={() => navigate(`/recipes/${recipe.id}`)}>
                          View Recipe
                        </RecipeButton>
                      </RecipeActions>
                    </RecipeContent>
                  </RecipeCard>
                ))}
              </RecipeGrid>
            </div>
          </Section>
        );
      case 'social':
        return (
          <Section>
            <SectionTitle>Social Features</SectionTitle>
            <div>
              <h3>Suggested Connections</h3>
              <SocialGrid>
                {socialConnections.map(connection => (
                  <SocialCard key={connection.id}>
                    <SocialAvatar style={{ backgroundColor: getRandomColor(connection.id) }}>
                      {connection.avatar ? 
                        <img src={connection.avatar} alt={connection.name} /> : 
                        getInitials(connection.name)
                      }
                    </SocialAvatar>
                    <SocialName>{connection.name}</SocialName>
                    <SocialMeta>{connection.recipes} recipes</SocialMeta>
                  </SocialCard>
                ))}
              </SocialGrid>
            </div>
            
            <div style={{ marginTop: '2rem' }}>
              <h3>Share Your Success</h3>
              <p style={{ color: '#666' }}>
                Share your cooking victories with friends and the PorkChop community!
              </p>
              <RecipeGrid>
                {recipeHistory.cooked.slice(0, 2).map(recipe => (
                  <RecipeCard key={recipe.id}>
                    <RecipeImage image={recipe.image} />
                    <RecipeContent>
                      <RecipeTitle>{recipe.name}</RecipeTitle>
                      <RecipeMeta>
                        <span>Cooked: {new Date(recipe.date).toLocaleDateString()}</span>
                      </RecipeMeta>
                      <RecipeActions>
                        <RecipeButton color="#4CAF50">
                          Share
                        </RecipeButton>
                      </RecipeActions>
                    </RecipeContent>
                  </RecipeCard>
                ))}
              </RecipeGrid>
            </div>
            
            <div style={{ marginTop: '2rem' }}>
              <h3>Create a Recipe Collection</h3>
              <p style={{ color: '#666' }}>
                Organize and share your favorite recipes with custom collections.
              </p>
              <FormRow>
                <Input placeholder="Collection Name (e.g. 'Weeknight Dinners')" />
                <SaveButton style={{ marginTop: 0, marginLeft: '0.5rem' }}>
                  Create
                </SaveButton>
              </FormRow>
            </div>
          </Section>
        );
      default:
        return null;
    }
  };

  return (
    <ProfileContainer>
      <ProfileHeader>
        <Avatar onClick={handleAvatarClick} color={getRandomColor(user?.id || 0)}>
          {user?.avatar ? 
            <AvatarImage src={user.avatar} alt={personalInfo.displayName} /> : 
            getInitials(personalInfo.displayName)
          }
          <AvatarUpload 
            ref={avatarInputRef}
            type="file" 
            accept="image/*"
            onChange={handleAvatarChange}
          />
        </Avatar>
        <UserInfo>
          <Username>{personalInfo.displayName}</Username>
          <Email>{personalInfo.email}</Email>
        </UserInfo>
        <ProfileActions>
          <LogoutButton onClick={handleLogout}>Log Out</LogoutButton>
        </ProfileActions>
      </ProfileHeader>
      
      <TabsContainer>
        <Tab active={activeTab === 'personal'} onClick={() => setActiveTab('personal')}>
          Personal Info
        </Tab>
        <Tab active={activeTab === 'dietary'} onClick={() => setActiveTab('dietary')}>
          Dietary Preferences
        </Tab>
        <Tab active={activeTab === 'cooking'} onClick={() => setActiveTab('cooking')}>
          Cooking Preferences
        </Tab>
        <Tab active={activeTab === 'history'} onClick={() => setActiveTab('history')}>
          Recipe History
        </Tab>
        <Tab active={activeTab === 'inventory'} onClick={() => setActiveTab('inventory')}>
          Inventory
        </Tab>
        <Tab active={activeTab === 'analytics'} onClick={() => setActiveTab('analytics')}>
          Analytics
        </Tab>
        <Tab active={activeTab === 'social'} onClick={() => setActiveTab('social')}>
          Social
        </Tab>
      </TabsContainer>
      
      {renderTabContent()}
    </ProfileContainer>
  );
};

export default Profile;
