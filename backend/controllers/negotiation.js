const Product = require('../models/product');

exports.negotiatePrice = async (req, res) => {
    try {
        const { productId, message, budget, quantity } = req.body;

        // Get product details
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Here you would typically integrate with an AI service like OpenAI
        // For demonstration, we'll create a simple negotiation logic
        const currentPrice = product.price;
        const totalPrice = currentPrice * quantity;
        const pricePerUnit = totalPrice / quantity;
        
        let response;
        if (budget >= totalPrice) {
            response = `The current price is $${pricePerUnit} per unit, totaling $${totalPrice} for ${quantity} units. This is within your budget of $${budget}. Would you like to proceed with the purchase?`;
        } else {
            const maxQuantityInBudget = Math.floor(budget / currentPrice);
            response = `Your budget of $${budget} is not sufficient for ${quantity} units at $${pricePerUnit} per unit. The maximum quantity you can purchase within your budget is ${maxQuantityInBudget} units. Would you like to:
1. Reduce the quantity to ${maxQuantityInBudget} units
2. Increase your budget to $${totalPrice}
3. Discuss a potential bulk discount?`;
        }

        res.json({
            message: response,
            productDetails: {
                name: product.name,
                currentPrice: currentPrice,
                quantity: quantity,
                totalPrice: totalPrice
            }
        });

    } catch (error) {
        res.status(500).json({
            message: 'Error in price negotiation',
            error: error.message
        });
    }
}; 