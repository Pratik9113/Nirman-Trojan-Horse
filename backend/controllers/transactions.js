const Transactions = require("../models/transactions");
const Retailer = require("../models/retailer");
const Manufacturer = require("../models/manufacturer");
const Supplier = require("../models/supplier");

const createTransaction = async (req, res) => {
  try {
    const { fromId, fromModel, toId, toModel, amount, status, type } = req.body;

    // Validate Model Names
    const validModels = ["Supplier", "Manufacturer", "Retailer"];
    if (!validModels.includes(fromModel) || !validModels.includes(toModel)) {
      return res.status(400).json({ error: "Invalid entity type" });
    }

    // Validate "from" Entity
    let fromEntity;
    if (fromModel === "Supplier") {
      fromEntity = await Supplier.findById(fromId);
    } else if (fromModel === "Manufacturer") {
      fromEntity = await Manufacturer.findById(fromId);
    } else if (fromModel === "Retailer") {
      fromEntity = await Retailer.findById(fromId);
    }
    if (!fromEntity) {
      return res.status(404).json({ error: "Sender entity not found" });
    }

    // Validate "to" Entity
    let toEntity;
    if (toModel === "Supplier") {
      toEntity = await Supplier.findById(toId);
    } else if (toModel === "Manufacturer") {
      toEntity = await Manufacturer.findById(toId);
    } else if (toModel === "Retailer") {
      toEntity = await Retailer.findById(toId);
    }
    if (!toEntity) {
      return res.status(404).json({ error: "Receiver entity not found" });
    }

    // Create and Save Transaction
    const transaction = new Transactions({
      from: fromId,
      fromModel,
      to: toId,
      toModel,
      amount,
      status,
      type,
    });

    await transaction.save();
    toEntity.transactions.push(transaction._id);
    fromEntity.transactions.push(transaction._id);
    await toEntity.save();
    await fromEntity.save();
    

    res.status(201).json({ message: "Transaction created successfully", transaction });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createTransaction };
