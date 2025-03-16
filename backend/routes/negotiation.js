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
  try {
    const {
      productId,
      message,
      budget,
      quantity,
      productName,
      initialPrice,
      retailerId,
      stage,
    } = req.body;

    if (
      !productId ||
      !message ||
      !budget ||
      !quantity ||
      !productName ||
      !initialPrice
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    let negotiation = await Negotiation.findOne({
      productId,
      budget,
      quantity,
      status: "active",
    });

    if (!negotiation) {
      negotiation = new Negotiation({
        productId,
        retailerId: retailerId || "1",
        customerId: req.user ? req.user.id : "guest",
        initialPrice,
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

    // Calculate price details
    const totalBudget = budget;
    const totalInitialPrice = initialPrice * quantity;
    const discountRequested = (
      ((totalInitialPrice - totalBudget) / totalInitialPrice) *
      100
    ).toFixed(2);
    const pricePerUnit = (budget / quantity).toFixed(2);

    // Initialize Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `
      You are an AI negotiation assistant. Your job is to assist in negotiating product prices.

      Product: ${productName}
      Original price: $${initialPrice} per unit
      Customer's budget: $${totalBudget} total ($${pricePerUnit} per unit)
      Quantity requested: ${quantity} units
      Discount requested: ${discountRequested}%
      
      Customer message: "${message}"
      
      Current negotiation stage: ${stage}
      
      Be friendly and professional. If the customer's discount request is within 20%, suggest accepting it.
      If it's too high, suggest a reasonable counter-offer.
    `;
    console.log(prompt.candidates);
    // Get AI-generated response
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    console.log(result.response.candidates[0].content.parts[0].text);

    // if (!result.candidates || result.candidates.length === 0) {
    //   throw new Error("No candidates returned from AI model.");
    // }

    const response = result.response.candidates[0].content.parts[0].text;

    // Save AI response to negotiation
    negotiation.messages.push({ role: "assistant", content: response });
    await negotiation.save();

    res.json({ message: response, negotiationId: negotiation._id });
  } catch (error) {
    console.error("Negotiation error:", error);
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
