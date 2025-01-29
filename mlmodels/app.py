from flask import Flask, request, jsonify
import json
from flask_cors import CORS
import os
import re
import pandas as pd
from pymongo import MongoClient
from dotenv import load_dotenv
from langchain_community.chat_message_histories import ChatMessageHistory
from langchain_core.chat_history import BaseChatMessageHistory
from langchain_core.messages import HumanMessage,SystemMessage
from langchain_groq import ChatGroq
from langchain_core.runnables import RunnableWithMessageHistory
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage
from langchain_groq import ChatGroq
from langchain_community.chat_message_histories import ChatMessageHistory
import re
import pandas as pd
from flask_cors import CORS
from urllib.parse import quote_plus

app = Flask(__name__)
CORS(app)
load_dotenv()

# Connect to MongoDB
mongo_url = os.getenv("MONGO_URL")
client = MongoClient(mongo_url)
db = client.get_database('ai_negogitate')  # Specify the database name here
deals_collection = db['deals']   

api_key = os.getenv("api_key")
if not api_key:
    raise ValueError("API key not found. Please set it in the .env file.")

model = ChatGroq(model="gemma2-9b-it", groq_api_key=api_key)

# Stores for chat history (separate for vendors and retailers)
vendor_store = {}
retailer_store = {}

def get_vendor_history(session_id: str) -> BaseChatMessageHistory:
    if session_id not in vendor_store:
        vendor_store[session_id] = ChatMessageHistory()
    return vendor_store[session_id]

def get_retailer_history(session_id: str) -> BaseChatMessageHistory:
    if session_id not in retailer_store:
        retailer_store[session_id] = ChatMessageHistory()
    return retailer_store[session_id]

# Base AI negotiation prompt
def create_base_prompt(shopkeeper_msg="", negotiation_type=""):
    shopkeeper_amount=30000
    reduced_amount =27000
    item="wood"
    
    
    messages = [
        SystemMessage(content=f"You are an AI agent negotiating with a {negotiation_type} ."),
        SystemMessage(
            content=(
                "You are an AI agent negotiating with a local vendor. Your goal is to get the best price without exceeding the shopkeeper's actual price. Keep the shopkeeper's actual price confidential. "
                f"The extracted shopkeeper amount is stored as [shopkeeperamount={shopkeeper_amount}] and the reduced amount is stored as [amount={reduced_amount}].\n\n"
                "Follow these steps for negotiation:\n\n"
                "1. **Starting Offer:**\n"
                f"   Begin by offering ₹{reduced_amount}. Say:\n"
                f"   **'Hi! I’m looking to buy this {item}. I’d like to offer ₹{reduced_amount}. Let me know your thoughts.'**\n\n"
                "2. **{negotiation_type} Offers:**\n"
                f"   - If the vendor quotes **less than or equal to ₹{shopkeeper_amount}**, accept the offer immediately. Do not negotiate further. Confirm with:\n"
                f"     **'Great! We’ve agreed on ₹[agreed price]. We will get back to you regarding the deal and delivery details shortly.'**\n"
                f"     Then, ask:\n"
                f"     **'Just to confirm, we’ve agreed on ₹[agreed price]. This price is final and cannot be changed. Are you sure about proceeding with this price? Answer in yes/no'**\n\n"
                f"     - If the {negotiation_type} confirms with 'yes,'yes we’ve agreed on ₹[agreed price] for item: {item} \n\n"
                f"   - If the {negotiation_type} quotes **above ₹{shopkeeper_amount}**, respond:\n"
                f"     **'I understand your quote, but this ₹{reduced_amount} amount is what I can offer. Let me know if you can revise your offer to fit within this range.'**\n\n"
                "3. **Incremental Counteroffers:**\n"
                f"   - If the {negotiation_type} rejects, increase your offer incrementally in steps of ₹500 until you reach ₹{shopkeeper_amount}. After each offer, say:\n"
                f"     **'I understand your quote, but I’d like to offer ₹[new price]. Let me know if this works for you.'**\n"
                f"   - If the {negotiation_type} proposes a price **below your latest counteroffer but still above ₹{shopkeeper_amount}**, repeat:\n"
                f"     **'₹{reduced_amount} is the maximum I can offer. Let me know if you can adjust your quote accordingly.'**\n\n"
                "4. **Key Rules for Consistency:**\n"
                f"   - If the {negotiation_type} proposes a price **below or equal to ₹{reduced_amount} at any point**, accept it immediately without further counteroffers or negotiation.\n"
                f"   - Do not counter with a higher price than the {negotiation_type}'s latest offer.\n"
                f"   - Never disclose ₹{shopkeeper_amount} as the maximum budget upfront. Reveal it only when the {negotiation_type} quotes a price above ₹{shopkeeper_amount}.\n"
                "   - Maintain a polite and professional tone throughout the negotiation process.\n\n"
                "5. **Final Confirmation:**\n"
                f"   Once the {negotiation_type} agrees to a price ≤ ₹{shopkeeper_amount}, reiterate the agreed price and confirm with:\n"
                f"   **'Just to confirm, we’ve agreed on ₹[agreed price]. This price is final, and no changes will be entertained. Are you sure you’d like to proceed?'**"
                
            )
        ),
        MessagesPlaceholder(variable_name="messages"),
    ]
    return ChatPromptTemplate(messages=messages)



# --------------- Vendor Negotiation ---------------

@app.route("/sendMsgFromShopkeeper", methods=["POST"])
def sendMsgFromShopkeeper():
    shopkeeper_msg = request.json.get("input", "")
    if not shopkeeper_msg:
        return jsonify({"error": "No input provided"}), 400

    global vendor_prompt_template
    vendor_prompt_template = create_base_prompt(shopkeeper_msg, "vendor")
    
    return jsonify({"message": "Shopkeeper's message stored for vendor negotiation."})

@app.route("/negotiate", methods=["POST"])
def negotiate():
    input_data = request.json.get("input", "")
    vendor_phno = request.json.get("to", "")
    from_message = request.json.get("from", "")

    config = {"configurable": {"session_id": vendor_phno}}
    chain = vendor_prompt_template | model
    with_message_history = RunnableWithMessageHistory(chain, get_vendor_history)

    ai_response = with_message_history.invoke(
        [HumanMessage(content=input_data)],
        config=config,
    )

    vendor_message = input_data.lower()
    if vendor_message.lower().startswith("yes we’ve agreed on"):
        match = re.search(r"₹(\d+)", vendor_message) 
        if match:
            agreed_price = match.group(1)
            item = vendor_message.split()[-1]
            print("Agreed Price:", agreed_price, item)
        else:
            print("Price not found")
    
        if agreed_price:
            deal = {
                "from_message": from_message,
                "vendor_phone": vendor_phno,
                "agreed_price": agreed_price,
                "item": item,
                "status": "confirmed",
                "timestamp": pd.Timestamp.now().isoformat(),
            }

            # Save deal to MongoDB
            db.deals.insert_one(deal)
            print("Saving deal:", deal, flush=True)  # Log deal details
            return jsonify({"response": ai_response.content, "message": "Vendor negotiation completed."})

            # if os.path.exists(file_path):
            #     with open(file_path, "r") as file:
            #         existing_data = json.load(file)
            # else:
            #     existing_data = []

            # existing_data.append(deal)

            # with open(file_path, "w") as file:
            #     json.dump(existing_data, file, indent=4)
            #     json.dump(existing_data, file, indent=4)

    return jsonify({"response": ai_response.content, "message": "Vendor negotiation ongoing."})

# --------------- Retailer Negotiation ---------------

@app.route("/sendMsgFromRetailer", methods=["POST"])
def sendMsgFromRetailer():
    retailer_msg = request.json.get("input", "")
    if not retailer_msg:
        return jsonify({"error": "No input provided"}), 400

    global retailer_prompt_template
    retailer_prompt_template = create_base_prompt(retailer_msg, "retailer")
    
    return jsonify({"message": "Retailer's message stored for retailer negotiation."})

@app.route("/negotiateRetailer", methods=["POST"])
def negotiateRetailer():
    input_data = request.json.get("input", "")
    retailer_phno = request.json.get("to", "")
    from_message = request.json.get("from", "")

    config = {"configurable": {"session_id": retailer_phno}}
    chain = retailer_prompt_template | model
    with_message_history = RunnableWithMessageHistory(chain, get_retailer_history)

    ai_response = with_message_history.invoke(
        [HumanMessage(content=input_data)],
        config=config,
    )

    retailer_message = input_data.lower()

    if "yes" in retailer_message:
        price_match = re.search(r'₹\s?(\d{1,3}(?:,\d{3})*(?:\.\d{1,2})?)', retailer_message)
        print(price_match)
        item_match = re.search(r'item\s*:\s*(.+)', retailer_message)

        if price_match and item_match:
            agreed_price = float(price_match.group(1).replace(",", ""))
            item = item_match.group(1).strip()

            deal = {
                "from_message": from_message,
                "vendor_phone": vendor_phno,
                "agreed_price": price_match,
                "item": item_match,
                "status": "confirmed",
                "timestamp": pd.Timestamp.now().isoformat(),
            }

            deals_collection.insert_one(deal)
        else:
            return jsonify({
                "response": ai_response.content,
                "message": "Failed to confirm the deal. Price or item not found in the vendor's message.",
            })
    else:
        return jsonify({
            "response": ai_response.content,
            "message": "Vendor did not confirm the deal."
        })


if __name__ == "__main__":
    app.run(debug=True)
