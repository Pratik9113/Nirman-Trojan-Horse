const axios = require('axios');
require('dotenv').config();

// Gemini API configuration
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

// Helper function to format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

// Store active negotiations for retailer access
const activeNegotiations = new Map();

exports.negotiatePrice = async (req, res) => {
  try {
    const { productId, message, budget, quantity, productName, initialPrice, stage, retailerId } = req.body;

    // Calculate some basic metrics for negotiation context
    const totalPrice = initialPrice * quantity;
    const pricePerUnit = initialPrice;
    const budgetPerUnit = budget / quantity;
    const discount = ((initialPrice - budgetPerUnit) / initialPrice) * 100;

    // Create a prompt for the AI
    const systemPrompt = `You are an AI negotiation assistant for a furniture retailer. 
    Your goal is to negotiate a fair price with the customer while maximizing profit.
    
    Product: ${productName}
    Original price: ${formatCurrency(pricePerUnit)} per unit
    Quantity requested: ${quantity} units
    Total price: ${formatCurrency(totalPrice)}
    Customer's budget: ${formatCurrency(budget)}
    Budget per unit: ${formatCurrency(budgetPerUnit)}
    Discount requested: ${discount.toFixed(2)}%
    
    Negotiation guidelines:
    - Be professional and courteous
    - If the discount requested is less than 10%, you can accept immediately
    - For discounts between 10-20%, negotiate but be willing to accept
    - For discounts between 20-30%, try to upsell or offer smaller discount
    - For discounts over 30%, suggest reducing quantity or explain why such a discount isn't possible
    - Mention bulk discounts for orders over 50 units
    - Suggest financing options for large purchases
    - Your responses should be concise (max 3-4 sentences)`;

    // Prepare the conversation for Gemini
    let userMessage;
    if (message) {
      userMessage = message;
    } else {
      // Initial message if none provided
      userMessage = `I'm interested in buying ${quantity} units of ${productName}. My budget is ${formatCurrency(budget)}.`;
    }

    // Format the request for Gemini API
    const geminiRequest = {
      contents: [
        {
          role: "user",
          parts: [
            { text: systemPrompt },
            { text: userMessage }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 150,
        topP: 0.95,
        topK: 40
      }
    };

    // Call Gemini API
    const response = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      geminiRequest,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    // Extract the AI's response from Gemini
    const aiResponse = response.data.candidates[0].content.parts[0].text;

    // Store negotiation data for retailer access
    const negotiationId = `${productId}-${Date.now()}`;
    const negotiationData = {
      id: negotiationId,
      productId,
      productName,
      initialPrice,
      customerBudget: budget,
      quantity,
      discount: discount.toFixed(2),
      lastCustomerMessage: userMessage,
      lastAiResponse: aiResponse,
      timestamp: new Date(),
      status: 'active'
    };

    // Store in active negotiations
    activeNegotiations.set(negotiationId, negotiationData);

    // Notify retailer about the negotiation (in a real app, this would use WebSockets or similar)
    notifyRetailer(negotiationData);

    // Return the negotiation response
    res.json({
      message: aiResponse,
      negotiationId,
      productDetails: {
        name: productName,
        currentPrice: pricePerUnit,
        quantity: quantity,
        totalPrice: totalPrice,
        budget: budget,
        discount: discount.toFixed(2)
      }
    });

  } catch (error) {
    console.error('Error in AI negotiation:', error);
    
    // Fallback response if AI service fails
    const fallbackResponses = [
      `I understand you're interested in purchasing ${req.body.quantity} units with a budget of $${req.body.budget}. Let me check what discounts we can offer.`,
      "I appreciate your interest in our products. Could you tell me more about your requirements?",
      "Thank you for your offer. Let me see what I can do to accommodate your budget."
    ];
    
    const fallbackResponse = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
    
    res.json({
      message: fallbackResponse,
      error: "AI service temporarily unavailable. Using fallback response."
    });
  }
};

// Function to notify retailer about ongoing negotiations
function notifyRetailer(negotiationData) {
  console.log(`[RETAILER NOTIFICATION] New negotiation for ${negotiationData.productName}`);
  console.log(`Customer is interested in ${negotiationData.quantity} units with a budget of ${formatCurrency(negotiationData.customerBudget)}`);
  console.log(`Discount requested: ${negotiationData.discount}%`);
  
  // In a real application, this would send a notification to the retailer
  // via WebSockets, push notifications, or email
  
  // Example: If using Socket.io
  // io.to(`retailer-${negotiationData.retailerId}`).emit('new-negotiation', negotiationData);
}

// Get all active negotiations for a retailer
exports.getRetailerNegotiations = async (req, res) => {
  try {
    // In a real app, you would filter by retailerId
    const negotiations = Array.from(activeNegotiations.values());
    
    res.json({
      count: negotiations.length,
      negotiations
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching negotiations',
      error: error.message
    });
  }
};

// Get details of a specific negotiation
exports.getNegotiationDetails = async (req, res) => {
  try {
    const { negotiationId } = req.params;
    const negotiation = activeNegotiations.get(negotiationId);
    
    if (!negotiation) {
      return res.status(404).json({ message: 'Negotiation not found' });
    }
    
    res.json(negotiation);
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching negotiation details',
      error: error.message
    });
  }
};

// Retailer can provide input to the negotiation
exports.retailerInput = async (req, res) => {
  try {
    const { negotiationId } = req.params;
    const { message, acceptOffer, counterOffer } = req.body;
    
    const negotiation = activeNegotiations.get(negotiationId);
    if (!negotiation) {
      return res.status(404).json({ message: 'Negotiation not found' });
    }
    
    // Update negotiation with retailer input
    negotiation.retailerInput = message;
    
    if (acceptOffer) {
      negotiation.status = 'accepted';
      negotiation.finalPrice = negotiation.customerBudget;
    } else if (counterOffer) {
      negotiation.counterOffer = counterOffer;
      negotiation.status = 'counter-offered';
    }
    
    // Update in active negotiations
    activeNegotiations.set(negotiationId, negotiation);
    
    res.json({
      message: 'Retailer input recorded',
      negotiation
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error recording retailer input',
      error: error.message
    });
  }
}; 