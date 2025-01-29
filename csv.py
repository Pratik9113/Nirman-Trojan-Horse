import pandas as pd
import random

# Generate sample data
data = []

# Define product IDs and item names
product_ids = ['P001', 'P002', 'P003', 'P004', 'P005']
items = ['Chair', 'Sofa', 'Bed', 'Almari', 'Table']

# Define the manufacturer's phone number
manufacturer_phone = '9876543210'

# Generate data for 100 entries
for _ in range(100):
    product_id = random.choice(product_ids)
    item = items[product_ids.index(product_id)]
    vendor_phone = f"{random.randint(6000000000, 9999999999)}"  # Random vendor phone number
    agreed_price = random.randint(5000, 20000)
    status = random.choice(['Confirmed', 'Pending', 'Cancelled'])
    
    # Append the entry to the data list
    data.append([product_id, vendor_phone, manufacturer_phone, agreed_price, status, item])

# Create DataFrame
df = pd.DataFrame(data, columns=['Product ID', 'Vendor Phone', 'Manufacturer Phone', 'Agreed Price', 'Status', 'Item'])

# Save as CSV
csv_file_path = '/mnt/data/product_vendor_data.csv'
df.to_csv(csv_file_path, index=False)

csv_file_path
