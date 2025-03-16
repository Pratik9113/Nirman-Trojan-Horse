import React, { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from "./ui/input";
import { Card, CardHeader, CardContent, CardFooter, CardTitle } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";
import { X, Send, ShoppingCart, AlertCircle } from "lucide-react";
import axios from 'axios';

const ChatBot = ({ onClose, productId, initialPrice, productName, retailerId = "1" }) => {
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      content: `Welcome! I see you're interested in the ${productName}. The current price is $${initialPrice} per unit. What's your budget and how many units would you like to purchase?`
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [negotiationState, setNegotiationState] = useState({
    budget: null,
    quantity: null,
    stage: 'initial', // initial, budget_set, quantity_set, negotiating, final
    isProcessing: false,
    dealAgreed: false,
    negotiationId: null,
    retailerResponse: null
  });
  const scrollAreaRef = useRef(null);
  const inputRef = useRef(null);
  const [checkRetailerInterval, setCheckRetailerInterval] = useState(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
    
    // Focus input when chat opens
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [messages]);

  // Set up polling for retailer responses when we have a negotiation ID
  useEffect(() => {
    if (negotiationState.negotiationId && negotiationState.stage === 'negotiating') {
      // Check for retailer response every 5 seconds
      const interval = setInterval(checkRetailerResponse, 5000);
      setCheckRetailerInterval(interval);
      
      return () => {
        if (checkRetailerInterval) clearInterval(checkRetailerInterval);
      };
    }
  }, [negotiationState.negotiationId, negotiationState.stage]);

  const checkRetailerResponse = async () => {
    if (!negotiationState.negotiationId) return;
    
    try {
      const response = await axios.get(`/api/negotiate/retailer/negotiations/${negotiationState.negotiationId}`);
      const negotiation = response.data;
      
      // If retailer has responded and we haven't processed it yet
      if (negotiation.status !== 'active' && !negotiationState.retailerResponse) {
        if (negotiation.status === 'accepted') {
          // Retailer accepted the offer
          setMessages(prev => [...prev, {
            type: 'bot',
            content: `Great news! The retailer has accepted your offer of $${negotiationState.budget} for ${negotiationState.quantity} units of ${productName}.`,
            showPurchaseButton: true
          }]);
          
          setNegotiationState(prev => ({
            ...prev,
            stage: 'final',
            dealAgreed: true,
            retailerResponse: 'accepted'
          }));
        } else if (negotiation.status === 'counter-offered') {
          // Retailer made a counter offer
          const counterMessage = negotiation.retailerInput || 
            `I can offer you a price of $${negotiation.counterOffer} per unit instead. Would this work for you?`;
          
          setMessages(prev => [...prev, {
            type: 'bot',
            content: `The retailer has responded with a counter offer: ${counterMessage}`
          }]);
          
          setNegotiationState(prev => ({
            ...prev,
            retailerResponse: 'counter-offered',
            counterOffer: negotiation.counterOffer
          }));
        }
        
        // Clear the interval since we've processed the response
        if (checkRetailerInterval) {
          clearInterval(checkRetailerInterval);
          setCheckRetailerInterval(null);
        }
      }
    } catch (error) {
      console.error('Error checking retailer response:', error);
    }
  };

  const extractNumbers = (text) => {
    const numbers = text.match(/\d+/g);
    return numbers ? numbers.map(Number) : [];
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || negotiationState.isProcessing) return;

    // Add user message
    const newMessages = [...messages, { type: 'user', content: inputMessage }];
    setMessages(newMessages);
    setInputMessage('');
    
    // Set processing state
    setNegotiationState(prev => ({ ...prev, isProcessing: true }));

    try {
      const numbers = extractNumbers(inputMessage);
      let { budget, quantity, stage, negotiationId, retailerResponse, counterOffer } = negotiationState;

      // If retailer has counter-offered and user is responding
      if (retailerResponse === 'counter-offered') {
        // Check if user accepts the counter offer
        if (inputMessage.toLowerCase().includes('yes') || 
            inputMessage.toLowerCase().includes('accept') || 
            inputMessage.toLowerCase().includes('agree') || 
            inputMessage.toLowerCase().includes('deal')) {
          
          // User accepts counter offer
          setMessages(prev => [...prev, {
            type: 'bot',
            content: `Excellent! You've accepted the retailer's counter offer of $${counterOffer} per unit for ${quantity} units of ${productName}. Would you like to proceed with the purchase?`,
            showPurchaseButton: true
          }]);
          
          setNegotiationState({
            budget: counterOffer * quantity,
            quantity,
            stage: 'final',
            isProcessing: false,
            dealAgreed: true,
            negotiationId,
            retailerResponse: 'accepted'
          });
          
          return;
        } else if (inputMessage.toLowerCase().includes('no') || 
                  inputMessage.toLowerCase().includes('reject') || 
                  inputMessage.toLowerCase().includes('decline')) {
          
          // User rejects counter offer, continue negotiation
          stage = 'negotiating';
          retailerResponse = null;
        }
      }

      // Process based on negotiation stage
      if (stage === 'initial') {
        // Try to extract both budget and quantity from initial message
        if (numbers.length >= 2) {
          // Assume larger number is budget, smaller is quantity
          const sortedNumbers = [...numbers].sort((a, b) => b - a);
          budget = sortedNumbers[0];
          quantity = sortedNumbers[1];
          stage = 'negotiating';
        } 
        // If only one number, try to determine if it's budget or quantity
        else if (numbers.length === 1) {
          if (inputMessage.toLowerCase().includes('budget') || 
              inputMessage.toLowerCase().includes('afford') || 
              inputMessage.toLowerCase().includes('pay') ||
              inputMessage.toLowerCase().includes('$') ||
              inputMessage.toLowerCase().includes('dollar')) {
            budget = numbers[0];
            stage = 'budget_set';
            
            setMessages(prev => [...prev, {
              type: 'bot',
              content: `Thank you for sharing your budget of $${budget}. How many units of the ${productName} would you like to purchase?`
            }]);
          } else if (inputMessage.toLowerCase().includes('quantity') || 
                    inputMessage.toLowerCase().includes('units') || 
                    inputMessage.toLowerCase().includes('pieces')) {
            quantity = numbers[0];
            stage = 'quantity_set';
            
            setMessages(prev => [...prev, {
              type: 'bot',
              content: `Great! You're interested in ${quantity} units. What's your budget for this purchase?`
            }]);
          } else {
            // If unclear, assume it's budget
            budget = numbers[0];
            stage = 'budget_set';
            
            setMessages(prev => [...prev, {
              type: 'bot',
              content: `I understand your budget is $${budget}. How many units would you like to purchase?`
            }]);
          }
        } else {
          // No numbers found, ask for specific information
          setMessages(prev => [...prev, {
            type: 'bot',
            content: `I'd be happy to help you negotiate a price. Could you please tell me your budget and how many units you're interested in?`
          }]);
        }
      } 
      else if (stage === 'budget_set') {
        if (numbers.length > 0) {
          quantity = numbers[0];
          stage = 'negotiating';
        } else {
          setMessages(prev => [...prev, {
            type: 'bot',
            content: `I need to know how many units you want to purchase. Please provide a quantity.`
          }]);
        }
      } 
      else if (stage === 'quantity_set') {
        if (numbers.length > 0) {
          budget = numbers[0];
          stage = 'negotiating';
        } else {
          setMessages(prev => [...prev, {
            type: 'bot',
            content: `I need to know your budget for this purchase. Please provide an amount.`
          }]);
        }
      }

      // If we have both budget and quantity, start or continue negotiation
      if (stage === 'negotiating' && budget && quantity) {
        // Call the AI negotiation API
        const response = await axios.post(`${import.meta.env.VITE_BACKEND}/api/negotiate`, {
          productId,
          message: inputMessage,
          budget,
          quantity,
          productName,
          initialPrice,
          retailerId,
          stage
        });

        // Store negotiation ID if provided
        if (response.data.negotiationId && !negotiationId) {
          negotiationId = response.data.negotiationId;
          
          // Add a message to inform the user that the retailer is being notified
          setMessages(prev => [...prev, {
            type: 'bot',
            content: `I'm connecting you with the retailer for this ${productName}. They'll be notified of your interest and may respond to your offer shortly.`,
            isNotification: true
          }]);
        }

        // Check if deal is agreed (simple heuristic - can be improved)
        const dealAgreed = response.data.message.toLowerCase().includes('deal') || 
                          response.data.message.toLowerCase().includes('agreed') ||
                          response.data.message.toLowerCase().includes('accept your offer') ||
                          response.data.message.toLowerCase().includes('we can do that');

        setMessages(prev => [...prev, {
          type: 'bot',
          content: response.data.message
        }]);

        if (dealAgreed) {
          stage = 'final';
          
          // Add a final message with purchase option
          setTimeout(() => {
            setMessages(prev => [...prev, {
              type: 'bot',
              content: `Great! We have a deal. Would you like to proceed with the purchase of ${quantity} units of ${productName} for a total of $${(budget).toFixed(2)}?`,
              showPurchaseButton: true
            }]);
          }, 1000);
        }
      }

      setNegotiationState({ 
        budget, 
        quantity, 
        stage, 
        isProcessing: false,
        dealAgreed: stage === 'final',
        negotiationId,
        retailerResponse,
        counterOffer
      });
    } catch (error) {
      console.error('Error in negotiation:', error);
      setMessages(prev => [...prev, {
        type: 'bot',
        content: 'Sorry, there was an error processing your request. Please try again.'
      }]);
      setNegotiationState(prev => ({ ...prev, isProcessing: false }));
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handlePurchase = () => {
    // Here you would typically redirect to checkout or add to cart
    alert(`Purchase confirmed! ${negotiationState.quantity} units of ${productName} for $${negotiationState.budget}`);
    onClose();
  };

  return (
    <Card className="w-full h-full flex flex-col">
      <CardHeader className="border-b py-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg flex items-center">
            <img 
              src="https://lh3.googleusercontent.com/vOpdnZDQiGgZtQXZZ6kWAcJbc0Kkc3o3xQs-LMPCiQbGCjqT-JCiU4wdrfLGPGIKRLmrgHZYnJLfmJEb=s0-rw" 
              alt="Gemini" 
              className="w-5 h-5 mr-2" 
            />
            Negotiating: {productName}
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="flex-grow p-4 overflow-hidden">
        <ScrollArea className="h-[350px] pr-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.type === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : message.isNotification
                        ? 'bg-amber-50 border border-amber-200 text-amber-800'
                        : 'bg-muted'
                  }`}
                >
                  {message.isNotification && (
                    <div className="flex items-center mb-1 text-amber-600">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      <span className="text-xs font-medium">Retailer Notification</span>
                    </div>
                  )}
                  {message.content}
                  
                  {message.showPurchaseButton && (
                    <Button 
                      className="mt-2 w-full bg-green-600 hover:bg-green-700"
                      onClick={handlePurchase}
                    >
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Complete Purchase
                    </Button>
                  )}
                </div>
              </div>
            ))}
            
            {negotiationState.isProcessing && (
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-lg p-3 bg-muted">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>

      <CardFooter className="border-t p-4">
        <div className="flex w-full gap-2">
          <Input
            ref={inputRef}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="flex-grow"
            disabled={negotiationState.isProcessing || negotiationState.dealAgreed}
          />
          <Button 
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || negotiationState.isProcessing || negotiationState.dealAgreed}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ChatBot; 