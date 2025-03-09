// client/src/components/chef/ChefFreddie.jsx
import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const bounce = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
`;

const ChatContainer = styled(motion.div)`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60vh;
  background-color: rgba(255, 255, 255, 0.95);
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  box-shadow: 0 -5px 20px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  font-family: 'Comic Sans MS', cursive, sans-serif;
  z-index: 1000;
  animation: ${fadeIn} 0.3s ease-out;
  border-top: 3px solid #111;
`;

const ChefHeader = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem;
  border-bottom: 2px dashed #ddd;
`;

const ChefAvatar = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #111;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
  border: 2px solid white;
  overflow: hidden;
`;

const ChefImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ChefInfo = styled.div`
  flex: 1;
`;

const ChefName = styled.h3`
  margin: 0;
  font-size: 1.2rem;
`;

const ChefStatus = styled.p`
  margin: 0;
  font-size: 0.9rem;
  color: #4CAF50;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
  
  &:hover {
    color: #111;
  }
`;

const MessagesContainer = styled.div`
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
`;

const MessageBubble = styled(motion.div)`
  max-width: 80%;
  padding: 0.8rem 1.2rem;
  border-radius: 18px;
  margin-bottom: 1rem;
  font-size: 1rem;
  line-height: 1.4;
  position: relative;
  
  ${props => props.isUser ? `
    align-self: flex-end;
    background-color: #111;
    color: white;
    border-bottom-right-radius: 4px;
  ` : `
    align-self: flex-start;
    background-color: #f1f1f1;
    color: #333;
    border-bottom-left-radius: 4px;
  `}
`;

const TypingIndicator = styled.div`
  align-self: flex-start;
  background-color: #f1f1f1;
  border-radius: 18px;
  padding: 0.8rem 1.2rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
`;

const TypingDot = styled.div`
  width: 8px;
  height: 8px;
  background-color: #666;
  border-radius: 50%;
  margin: 0 2px;
  animation: ${bounce} 0.8s infinite;
  animation-delay: ${props => props.delay};
`;

const InputContainer = styled.div`
  display: flex;
  padding: 1rem;
  border-top: 2px dashed #ddd;
`;

const Input = styled.input`
  flex: 1;
  padding: 0.8rem;
  border: 2px solid #ddd;
  border-radius: 20px;
  font-size: 1rem;
  font-family: inherit;
  
  &:focus {
    outline: none;
    border-color: #111;
  }
`;

const SendButton = styled.button`
  background-color: #111;
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 0.8rem;
  cursor: pointer;
  transition: transform 0.2s;
  
  &:hover {
    transform: scale(1.1);
  }
  
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const QuickReplyContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-top: 0.5rem;
  margin-bottom: 1rem;
`;

const QuickReplyButton = styled.button`
  background-color: #f1f1f1;
  border: 1px solid #ddd;
  border-radius: 20px;
  padding: 0.5rem 1rem;
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #ddd;
  }
`;

const ChefFreddie = ({ recipe, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [quickReplies, setQuickReplies] = useState([]);
  const messagesEndRef = useRef(null);
  
  // Initial greeting from Chef Freddie
  useEffect(() => {
    setIsTyping(true);
    
    // Simulate AI response delay
    const timer = setTimeout(() => {
      setMessages([{
        id: 1,
        text: `Hi there! I'm Chef Freddie. I see you're making ${recipe.name}! Need any help with the recipe?`,
        isUser: false
      }]);
      
      setQuickReplies([
        "How do I know when it's done?",
        "Can I substitute any ingredients?",
        "What side dishes go well with this?",
        "Any tips for making this recipe better?"
      ]);
      
      setIsTyping(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, [recipe]);
  
  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSend = () => {
    if (input.trim() === '') return;
    
    // Add user message
    const userMessage = {
      id: messages.length + 1,
      text: input,
      isUser: true
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);
    setQuickReplies([]);
    
    // Simulate AI thinking and response
    setTimeout(() => {
      const response = generateResponse(input, recipe);
      
      setMessages(prev => [...prev, {
        id: prev.length + 1,
        text: response.text,
        isUser: false
      }]);
      
      if (response.quickReplies && response.quickReplies.length > 0) {
        setQuickReplies(response.quickReplies);
      }
      
      setIsTyping(false);
    }, 1500 + Math.random() * 1000);
  };
  
  const handleQuickReply = (reply) => {
    // Add user message from quick reply
    const userMessage = {
      id: messages.length + 1,
      text: reply,
      isUser: true
    };
    
    setMessages(prev => [...prev, userMessage]);
    setQuickReplies([]);
    setIsTyping(true);
    
    // Simulate AI thinking and response
    setTimeout(() => {
      const response = generateResponse(reply, recipe);
      
      setMessages(prev => [...prev, {
        id: prev.length + 1,
        text: response.text,
        isUser: false
      }]);
      
      if (response.quickReplies && response.quickReplies.length > 0) {
        setQuickReplies(response.quickReplies);
      }
      
      setIsTyping(false);
    }, 1500 + Math.random() * 1000);
  };
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };
  
  // This function would ideally use Claude AI for response generation
  // For now, we'll use predetermined responses for demo purposes
  const generateResponse = (query, recipe) => {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('substitute') || lowerQuery.includes('replacement') || lowerQuery.includes('instead of')) {
      return {
        text: `For ${recipe.name}, you can make these substitutions:\n\n` +
             `- If you don't have fresh herbs, use 1/3 the amount of dried herbs\n` +
             `- Vegetable oil can be replaced with olive oil or butter\n` +
             `- If you're out of certain vegetables, use what you have! Just aim for similar textures`,
        quickReplies: ["What if I'm missing the main ingredient?", "Can I make this vegetarian?", "Thanks!"]
      };
    }
    
    if (lowerQuery.includes('done') || lowerQuery.includes('ready') || lowerQuery.includes('finished')) {
      return {
        text: `Great question! For ${recipe.name}, you'll know it's done when:\n\n` +
             `- The internal temperature reaches the safe minimum (165°F for chicken, 145°F for fish)\n` +
             `- Vegetables should be tender but still have a slight crunch\n` +
             `- The dish should be bubbling and have developed some nice color`,
        quickReplies: ["I don't have a thermometer", "How do I check without cutting into it?", "Thanks!"]
      };
    }
    
    if (lowerQuery.includes('side') || lowerQuery.includes('serve with') || lowerQuery.includes('accompaniment')) {
      return {
        text: `${recipe.name} pairs wonderfully with:\n\n` +
             `- A simple green salad with vinaigrette\n` +
             `- Steamed rice or crusty bread\n` +
             `- Roasted vegetables tossed with olive oil and herbs`,
        quickReplies: ["What wine goes with this?", "Any sauce recommendations?", "Thanks!"]
      };
    }
    
    if (lowerQuery.includes('tip') || lowerQuery.includes('better') || lowerQuery.includes('improve')) {
      return {
        text: `Here are my top tips for making ${recipe.name} extra delicious:\n\n` +
             `- Season at every step, not just at the end\n` +
             `- Let the pan get really hot before adding ingredients for better browning\n` +
             `- Finish with a squeeze of fresh lemon juice and fresh herbs to brighten the flavors\n` +
             `- Let the dish rest for 5 minutes before serving to allow flavors to meld`,
        quickReplies: ["How do I avoid overcooking?", "Can I make this ahead?", "Thanks!"]
      };
    }
    
    if (lowerQuery.includes('thank') || lowerQuery.includes('thanks')) {
      return {
        text: "You're welcome! Enjoy your cooking, and feel free to ask if you need anything else. Happy cooking!",
        quickReplies: ["How do I save this recipe?", "Can I share feedback?", "Goodbye!"]
      };
    }
    
    // Default response
    return {
      text: "That's a great question about making " + recipe.name + "! While I don't have a specific answer, I recommend tasting as you go and adjusting seasonings to your preference. Cooking is all about making it your own!",
      quickReplies: ["Tell me more about this dish", "What's the most common mistake?", "Thanks for the help!"]
    };
  };
  
  return (
    <AnimatePresence>
      <ChatContainer
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      >
        <ChefHeader>
          <ChefAvatar>
            <ChefImage src="/assets/images/chef-freddie.png" alt="Chef Freddie" />
          </ChefAvatar>
          <ChefInfo>
            <ChefName>Chef Freddie</ChefName>
            <ChefStatus>Online and ready to help</ChefStatus>
          </ChefInfo>
          <CloseButton onClick={onClose}>×</CloseButton>
        </ChefHeader>
        
        <MessagesContainer>
          {messages.map((message) => (
            <MessageBubble
              key={message.id}
              isUser={message.isUser}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {message.text}
            </MessageBubble>
          ))}
          
          {isTyping && (
            <TypingIndicator>
              <TypingDot delay="0s" />
              <TypingDot delay="0.2s" />
              <TypingDot delay="0.4s" />
            </TypingIndicator>
          )}
          
          {quickReplies.length > 0 && !isTyping && (
            <QuickReplyContainer>
              {quickReplies.map((reply, index) => (
                <QuickReplyButton
                  key={index}
                  onClick={() => handleQuickReply(reply)}
                >
                  {reply}
                </QuickReplyButton>
              ))}
            </QuickReplyContainer>
          )}
          
          <div ref={messagesEndRef} />
        </MessagesContainer>
        
        <InputContainer>
          <Input
            type="text"
            placeholder="Ask Chef Freddie a question..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isTyping}
          />
          <SendButton
            onClick={handleSend}
            disabled={input.trim() === '' || isTyping}
          >
            →
          </SendButton>
        </InputContainer>
      </ChatContainer>
    </AnimatePresence>
  );
};

export default ChefFreddie;