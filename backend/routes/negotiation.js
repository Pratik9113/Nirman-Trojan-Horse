const express = require("express");
const router = express.Router();
const { Negotiation } = require("../models/Negotiation");
const { Product } = require("../models/product");
const { Retailer } = require("../models/retailer");
const auth = require("../middlewares/auth");
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize Google Generative AI
const genAI = new GoogleGenerativeAI("AIzaSyB2_MywtpPEtPI8kNDpsWffWo_gRFpdVGA");

// Customer-facing routes
// Negotiate with AI
router.post("/", async (req, res) => {
  let aiSuggestedPrice = null;

  try {
    const {
      productId,
      message,
      budget,
      quantity,
      productName,
      initialPrice,
      minimumPrice,
      retailerId,
      stage,
    } = req.body;

    // Validate required fields
    if (
      !productId ||
      !message ||
      !budget ||
      !quantity ||
      !productName ||
      !initialPrice ||
      !minimumPrice ||
      !retailerId
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    let negotiation = await Negotiation.findOne({
      productId,
      status: "active",
    });

    if (!negotiation) {
      negotiation = new Negotiation({
        productId,
        retailerId: retailerId,
        customerId: req.user ? req.user.id : "guest",
        initialPrice,
        minimumPrice,
        budget,
        quantity,
        messages: [{ role: "customer", content: message }],
        status: "active",
      });
      await negotiation.save();
    } else {
      negotiation.messages.push({ role: "customer", content: message });
      await negotiation.save();
    }

    // // Detect "deal done" or similar confirmation from customer
    // const isDealDone = /deal(?:\s+done| confirmed| ok| okay| agreed| final)/i.test(
    //   message
    // );

    // if (isDealDone) {
    //   negotiation.status = "completed";
    //   await negotiation.save();
    //   return res.json({
    //     message: "The deal is finalized. Thank you for your purchase!",
    //     negotiationId: negotiation._id,
    //     aiSuggestedPrice: aiSuggestedPrice || budget,
    //   });
    // }

    // Calculate price details
    // Calculate price details
const totalBudget = parseFloat(budget);
const totalInitialPrice = parseFloat(initialPrice) * parseInt(quantity, 10);
const discountRequested = (
  ((totalInitialPrice - totalBudget) / totalInitialPrice) * 100
).toFixed(2);
const pricePerUnit = (totalBudget / parseInt(quantity, 10)).toFixed(2);

// Initialize Gemini AI
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

const prompt = `
  You are an AI negotiation assistant. Your goal is to negotiate product prices effectively.

  Product: ${productName}
  Original price: $${initialPrice} per unit
  Customer's budget: $${totalBudget} total ($${pricePerUnit} per unit)
  Quantity requested: ${quantity} units
  Discount requested: ${discountRequested}%
  Minimum acceptable price: $${minimumPrice}

  Customer message: "${message}"

  Current negotiation stage: ${stage}

  Instructions:
  1. Always provide a clear, final price to the customer in your response (e.g., "I can offer you a final price of $XYZ.")—this is mandatory in every reply.
  2. Ensure the price you provide is the **total price** (not per unit) and follows the format: **"I can offer you a final price of $XYZ."**
  3. If the requested discount is within 4-5%, accept or propose a small adjustment.
  4. If the requested discount exceeds 5%, negotiate but do not drop below the **minimum price ($${minimumPrice})**.
  5. If the customer insists on a price below the minimum, respond with: "I understand your request, but going below $${minimumPrice} would not be profitable for us."
  6. Keep responses short, persuasive, and professional.
`;


    // Get AI-generated response
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    const response =
      result.response.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Unable to generate response";
    console.log("[AI Response]:", response);

    // Improved regex to capture full price values (including 4+ digits)
    const pricePattern =
      /\b(?:final price|I can offer(?: you)?|how about|we agree on)[^\$]*\$(\d{1,})(?:,?\d{3})*(?:\.\d{1,2})?/i;

    const priceMatch = response.match(pricePattern);
    console.log("[PRICE MATCH]:", priceMatch);

    if (priceMatch) {
      aiSuggestedPrice = parseFloat(priceMatch[1].replace(/,/g, ""));
      console.log("[INFO] AI Suggested Price: $", aiSuggestedPrice);
    }

    // Ensure valid quantity and price for updating
    const quantityInt = parseInt(quantity, 10);
    const isValidPrice =
      !isNaN(aiSuggestedPrice) && aiSuggestedPrice >= minimumPrice;

    if (isValidPrice) {
      negotiation.budget = aiSuggestedPrice; // Set total price (not per unit)
      await negotiation.save();
      console.log("[INFO] Budget updated successfully: $", aiSuggestedPrice);
    } else {
      console.warn(
        "[WARN] No valid price extracted from AI response or price below minimum."
      );
    }

    // Save AI response to negotiation
    negotiation.messages.push({ role: "assistant", content: response });
    await negotiation.save();

    res.json({
      message: response,
      negotiationId: negotiation._id,
      aiSuggestedPrice,
    });
  } catch (error) {
    console.error("[ERROR] Negotiation error:", error);
    res.status(500).json({ error: "Server error during negotiation" });
  }
});




// Get negotiation history for a customer
router.get("/history", auth, async (req, res) => {
  try {
    const negotiations = await Negotiation.find({ customerId: req.user.id })
      .sort({ updatedAt: -1 })
      .populate("productId", "name price images");

    res.json(negotiations);
  } catch (error) {
    console.error("Error fetching negotiation history:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Get specific negotiation details
router.get("/:negotiationId", auth, async (req, res) => {
  try {
    const negotiation = await Negotiation.findOne({
      _id: req.params.negotiationId,
      customerId: req.user.id,
    }).populate("productId", "name price images");

    if (!negotiation) {
      return res.status(404).json({ error: "Negotiation not found" });
    }

    res.json(negotiation);
  } catch (error) {
    console.error("Error fetching negotiation details:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Retailer-facing routes
// Get all active negotiations for a retailer
router.get("/retailer/negotiations", auth, async (req, res) => {
  try {
    // Verify user is a retailer
    // const user = await User.findById(req.user.id);
    // if (!user || user.role !== "retailer") {
    //   return res
    //     .status(403)
    //     .json({ error: "Unauthorized. Retailer access only." });
    // }

    const negotiations = await Negotiation.find({
      retailerId: req.userId.id,
      status: { $in: ["active", "counter-offered"] },
    })
      .sort({ updatedAt: -1 })
      .populate("productId", "name price images")
      .populate("customerId", "name email");

    res.json(negotiations);
  } catch (error) {
    console.error("Error fetching retailer negotiations:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Get specific negotiation details for retailer
router.get("/retailer/negotiations/:negotiationId", async (req, res) => {
  try {
    const negotiation = await Negotiation.findById(req.params.negotiationId)
      .populate("productId", "name price images")
      .populate("customerId", "name email");

    if (!negotiation) {
      return res.status(404).json({ error: "Negotiation not found" });
    }

    res.json(negotiation);
  } catch (error) {
    console.error("Error fetching negotiation details:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Allow retailer to provide input on a negotiation
router.post(
  "/retailer/negotiations/:negotiationId/input",
  auth,
  async (req, res) => {
    try {
      // Verify user is a retailer
      const user = await User.findById(req.user.id);
      if (!user || user.role !== "retailer") {
        return res
          .status(403)
          .json({ error: "Unauthorized. Retailer access only." });
      }

      const { action, counterOffer, message } = req.body;

      if (!action || !["accept", "counter", "reject"].includes(action)) {
        return res.status(400).json({
          error: "Invalid action. Must be accept, counter, or reject.",
        });
      }

      const negotiation = await Negotiation.findOne({
        _id: req.params.negotiationId,
        retailerId: req.user.id,
      });

      if (!negotiation) {
        return res.status(404).json({ error: "Negotiation not found" });
      }

      // Update negotiation based on action
      if (action === "accept") {
        negotiation.status = "accepted";
        negotiation.messages.push({
          role: "retailer",
          content: message || "Your offer has been accepted.",
        });
      } else if (action === "counter") {
        if (!counterOffer) {
          return res
            .status(400)
            .json({ error: "Counter offer amount is required." });
        }

        negotiation.status = "counter-offered";
        negotiation.counterOffer = counterOffer;
        negotiation.retailerInput = message;
        negotiation.messages.push({
          role: "retailer",
          content: message || `Counter offer: $${counterOffer} per unit.`,
        });
      } else if (action === "reject") {
        negotiation.status = "rejected";
        negotiation.messages.push({
          role: "retailer",
          content: message || "Your offer has been rejected.",
        });
      }

      await negotiation.save();

      res.json({
        success: true,
        message: `Negotiation ${
          action === "counter" ? "counter-offered" : action + "ed"
        } successfully.`,
        negotiation,
      });
    } catch (error) {
      console.error("Error updating negotiation:", error);
      res.status(500).json({ error: "Server error" });
    }
  }
);

module.exports = router;