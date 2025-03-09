// client/src/components/ui/NavBar.jsx
import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import { getCurrentUser } from '../../lib/supabase';

const NavContainer = styled.nav`
  background-color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 0.8rem 1.5rem;
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: 'Comic Sans MS', cursive, sans-serif;
`;

const Logo = styled.div`
  font-size: 1.8rem;
  font-weight: bold;
  color: #111;
  cursor: pointer;
  display: flex;
  align-items: center;
  
  img {
    height: 40px;
    margin-right: 0.5rem;
  }
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
`;

const NavLink = styled(Link)`
  color: #333;
  text-decoration: none;
  padding: 0.5rem 1rem;
  margin: 0 0.2rem;
  border-radius: 8px;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #f5f5f5;
  }
  
  &.active {
    font-weight: bold;
  }
  
  @media (max-width: 768px) {
    padding: 0.5rem;
  }
`;

const ProfileIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${props => props.color || '#111'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 1.2rem;
  cursor: pointer;
  margin-left: 1rem;
  border: 2px solid #111;
  transition: transform 0.2s;
  
  &:hover {
    transform: scale(1.1);
  }
`;

const NavBar = () => {
  const navigate = useNavigate();
  const [user, setUser] = React.useState(null);
  
  React.useEffect(() => {
    const fetchUser = async () => {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    };
    
    fetchUser();
  }, []);
  
  const getInitials = (name) => {
    if (!name) return '?';
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
  
  const handleProfileClick = () => {
    navigate('/profile');
  };
  
  return (
    <NavContainer>
      <Logo onClick={() => navigate('/')}>
        <img src="/assets/images/porkchop-logo.png" alt="PorkChop" />
        PorkChop
      </Logo>
      
      <NavLinks>
        <NavLink to="/dashboard">Dashboard</NavLink>
        <NavLink to="/recipes">Recipes</NavLink>
        
        {user && (
          <ProfileIcon 
            onClick={handleProfileClick}
            color={getRandomColor(user?.id || 0)}
          >
            {user?.user_metadata?.name 
              ? getInitials(user.user_metadata.name) 
              : user?.email 
                ? user.email[0].toUpperCase() 
                : '?'}
          </ProfileIcon>
        )}
      </NavLinks>
    </NavContainer>
  );
};

export default NavBar;