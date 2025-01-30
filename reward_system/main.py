import pandas as pd
from pymongo import MongoClient
import sendgrid
from sendgrid.helpers.mail import Mail
from datetime import datetime, timedelta


SENDGRID_API_KEY = ""
SENDER_EMAIL = "NirmanGati@pranavtitambe.in"


MONGO_URI = "mongodb+srv://pranavtitambe04:pranavtitambe04@cluster0.j95ly.mongodb.net/your_database_name?retryWrites=true&w=majority"
client = MongoClient(MONGO_URI)


db = client["test"]  
customers_collection = db["retailers"]  
transactions_collection = db["transaction_between_manufacturer_retailers"]
rewards_collection = db["reward"]  


one_month_ago = datetime.now() - timedelta(days=30)


customers = list(customers_collection.find({}, {"_id": 1, "name": 1, "email": 1}))
customers_df = pd.DataFrame(customers)


transactions = list(transactions_collection.find(
    {"transaction_date": {"$gte": one_month_ago}}, 
    {"customer_id": 1, "transaction_amount": 1, "transaction_date": 1}
))
transactions_df = pd.DataFrame(transactions)


if not transactions_df.empty:
    transactions_df["transaction_date"] = pd.to_datetime(transactions_df["transaction_date"])

   
    monthly_revenue = transactions_df.groupby("customer_id")["transaction_amount"].sum().reset_index()
    monthly_revenue.rename(columns={"transaction_amount": "total_monthly_revenue"}, inplace=True)

   
    last_purchase = transactions_df.groupby("customer_id")["transaction_date"].max().reset_index()
    last_purchase.rename(columns={"transaction_date": "last_purchase_date"}, inplace=True)

    
    customers_df = customers_df.merge(monthly_revenue, left_on="_id", right_on="customer_id", how="left")
    customers_df = customers_df.merge(last_purchase, left_on="_id", right_on="customer_id", how="left")

    
    customers_df.fillna({"total_monthly_revenue": 0, "last_purchase_date": datetime.min}, inplace=True)

    
    customers_df["loyalty_points"] = (customers_df["total_monthly_revenue"] // 1000).astype(int)

    
    customers_df["cashback_amount"] = customers_df["loyalty_points"] * 10

   
    def assign_tier(revenue):
        if revenue >= 50000:
            return 'Platinum', '20% Discount + Free Delivery'
        elif revenue >= 30000:
            return 'Gold', '15% Discount + Free Delivery'
        elif revenue >= 15000:
            return 'Silver', '10% Discount'
        elif revenue >= 5000:
            return 'Bronze', '5% Discount'
        else:
            return 'No Tier', 'No Rewards'

    customers_df[['reward_tier', 'reward']] = customers_df['total_monthly_revenue'].apply(lambda x: pd.Series(assign_tier(x)))

    
    customers_df["reward_valid"] = customers_df["last_purchase_date"].apply(lambda x: "Valid" if x >= one_month_ago else "Expired")

   
    customers_df.drop(columns=["_id", "customer_id"], inplace=True)

    
    rewards_collection.drop() 
    rewards_collection.insert_many(customers_df.to_dict(orient="records"))
    print("✅ Customer rewards data updated in MongoDB.")


def is_first_of_month():
    return datetime.today().day == 1


def send_reward_email(to_email, customer_name, reward, cashback):
    sg = sendgrid.SendGridAPIClient(api_key=SENDGRID_API_KEY)
    subject = "🎉 Congratulations! You've Earned Exclusive Rewards"
    content = f"""
    <p>Dear {customer_name},</p>
    <p>Thank you for being a valued customer! You have earned the following rewards:</p>
    <ul>
        <li><strong>Reward:</strong> {reward}</li>
        <li><strong>Cashback:</strong> ₹{cashback}</li>
    </ul>
    <p>The rewards will be valid for the next 30 days. Use them before they expire!</p>
    <p>Best Regards, <br> Company Name</p>
    """

    email = Mail(
        from_email=SENDER_EMAIL,
        to_emails=to_email,
        subject=subject,
        html_content=content
    )

    try:
        sg.send(email)
        print(f"✅ Email Sent to {customer_name} ({to_email})")
    except Exception as e:
        print(f"❌ Email failed for {customer_name} ({to_email}): {e}")


if is_first_of_month():
    for _, row in customers_df.iterrows():
        if row["reward_valid"] == "Valid" and row["reward_tier"] != "No Tier":
            send_reward_email(row["customer_email"], row["customer_name"], row["reward"], row["cashback_amount"])


print(customers_df[["customer_name", "customer_email", "total_monthly_revenue", "reward_tier", "reward", "reward_valid", "loyalty_points", "cashback_amount"]])
