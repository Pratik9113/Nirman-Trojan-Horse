import pandas as pd
import sendgrid
from sendgrid.helpers.mail import Mail
from datetime import datetime, timedelta


SENDGRID_API_KEY = ""
SENDER_EMAIL = "NirmanGati@pranavtitambe.in"


df = pd.DataFrame({
    'customer_id': [1, 2, 1, 3, 2, 4, 1],
    'customer_name': ['Alice', 'Bob', 'Alice', 'Charlie', 'Bob', 'David', 'Alice'],
    'customer_email': ['alice@example.com', 'bob@example.com', 'alice@example.com',
                       'charlie@example.com', 'bob@example.com', 'prajjwal0904@gmail.com', 'alice@example.com'],
    'total_monthly_revenue': [20000, 5000, 15000, 10000, 25000, 50000, 10000],
    'last_purchase_date': [
        '2025-01-10', '2025-01-15', '2025-01-20', '2025-01-12',
        '2025-01-05', '2025-01-25', '2025-01-18'
    ]
})

df['last_purchase_date'] = pd.to_datetime(df['last_purchase_date'])


buyer_revenue = df.groupby(['customer_id', 'customer_name', 'customer_email'])[['total_monthly_revenue']].sum().reset_index()


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


buyer_revenue[['reward_tier', 'reward']] = buyer_revenue['total_monthly_revenue'].apply(lambda x: pd.Series(assign_tier(x)))


one_month_ago = datetime.now() - timedelta(days=30)
buyer_revenue = buyer_revenue.merge(df[['customer_id', 'last_purchase_date']].drop_duplicates(), on='customer_id')
buyer_revenue['reward_valid'] = buyer_revenue['last_purchase_date'].apply(lambda x: 'Valid' if x >= one_month_ago else 'Expired')


buyer_revenue['loyalty_points'] = (buyer_revenue['total_monthly_revenue'] // 1000).astype(int)
buyer_revenue['cashback_amount'] = buyer_revenue['loyalty_points'] * 10 


buyer_revenue = buyer_revenue.sort_values(by='total_monthly_revenue', ascending=False)


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
    <p>The rewards will be valid only till next 30 days, use your rewards before they expire!</p>
    <p>Best Regards, <br> Your Company</p>
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


for _, row in buyer_revenue.iterrows():
    if row['reward_valid'] == 'Valid' and row['reward_tier'] != 'No Tier':
        send_reward_email(row['customer_email'], row['customer_name'], row['reward'], row['cashback_amount'])


print(buyer_revenue[['customer_name', 'customer_email', 'total_monthly_revenue', 'reward_tier', 'reward', 'reward_valid', 'loyalty_points', 'cashback_amount']])