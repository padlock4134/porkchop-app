// client/src/components/cards/IngredientCard.jsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const CardContainer = styled(motion.div)`
  width: 250px;
  height: 350px;
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  margin: 0 1rem;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  font-family: 'Comic Sans MS', cursive, sans-serif;
  border: 3px solid #111;
  position: relative;

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

const CardHeader = styled.div`
  padding: 1rem;
  background-color: #111;
  color: white;
  text-align: center;
  font-size: 1.2rem;
  font-weight: bold;
`;

const ItemsList = styled.div`
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
`;

const ItemRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.75rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px dashed #ddd;
  
  &:last-child {
    border-bottom: none;
  }
`;

const Checkbox = styled.input`
  width: 20px;
  height: 20px;
  margin-right: 0.75rem;
  cursor: pointer;
`;

const ItemLabel = styled.label`
  flex: 1;
  cursor: pointer;
`;

const AddButton = styled.button`
  background: none;
  border: none;
  color: #555;
  font-size: 1.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  
  &:hover {
    color: #111;
  }
`;

const InputRow = styled.div`
  display: flex;
  margin-bottom: 0.75rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px dashed #ddd;
`;

const Input = styled.input`
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9rem;
  
  &:focus {
    outline: none;
    border-color: #111;
  }
`;

const SaveButton = styled.button`
  margin-left: 0.5rem;
  background-color: #111;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.5rem;
  cursor: pointer;
  
  &:hover {
    background-color: #333;
  }
`;

const IngredientCard = ({ title, items, onItemToggle, onAddItem }) => {
  const [showInput, setShowInput] = useState(false);
  const [newItem, setNewItem] = useState('');
  
  const handleAddItem = () => {
    if (newItem.trim()) {
      onAddItem(newItem.trim());
      setNewItem('');
      setShowInput(false);
    }
  };
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleAddItem();
    }
  };
  
  return (
    <CardContainer
      whileHover={{ 
        scale: 1.05,
        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)'
      }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <CardHeader>{title}</CardHeader>
      <ItemsList>
        {items.map((item, index) => (
          <ItemRow key={index}>
            <Checkbox 
              type="checkbox" 
              id={`${title}-${index}`} 
              checked={item.selected}
              onChange={() => onItemToggle(index)}
            />
            <ItemLabel htmlFor={`${title}-${index}`}>{item.name}</ItemLabel>
          </ItemRow>
        ))}
        
        {showInput ? (
          <InputRow>
            <Input 
              type="text" 
              value={newItem} 
              onChange={(e) => setNewItem(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Add ${title.toLowerCase()}...`}
              autoFocus
            />
            <SaveButton onClick={handleAddItem}>Add</SaveButton>
          </InputRow>
        ) : (
          <ItemRow>
            <AddButton onClick={() => setShowInput(true)}>+</AddButton>
            <ItemLabel onClick={() => setShowInput(true)}>Add your own...</ItemLabel>
          </ItemRow>
        )}
      </ItemsList>
    </CardContainer>
  );
};

export default IngredientCard;