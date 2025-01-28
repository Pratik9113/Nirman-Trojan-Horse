import pandas as pd
import numpy as np

# Define the number of products and raw materials
num_products = 500  # Number of unique products
num_raw_materials = 10  # Number of raw materials
num_months = 12  # Number of months for historical sales data

# Set random seed for reproducibility
np.random.seed(42)
category = {
    'Furniture': {
        'Sofa': {
            'Leather Sofa': '01',
            'Fabric Sofa': '02',
            'Sectional Sofa': '03',
            'Recliner Sofa': '04',
            'Sleeper Sofa': '05',
            'Chesterfield Sofa': '06',
            'Lawson Sofa': '07',
            'Mid-Century Modern Sofa': '08',
            'Camelback Sofa': '09',
            'Cabriole Sofa': '10',
            'Tuxedo Sofa': '11',
            'Settee Sofa': '12',
            'Divan Sofa': '13',
            'Chaise Lounge Sofa': '14',
            'Loveseat Sofa': '15',
            'Futon Sofa': '16',
            'Canapé Sofa': '17',
            'Other': '18'
        },
        'Bed': '02',
        'Table': '03',
        'Chair': '04',
        'Cabinet': '05',
        'Wardrobe': '06',
        'Dining Table': '07',
        'Bookshelf': '08',
        'Desk': '09',
        'Bench': '10',
        'Other': '11'
    },
    'Electronics': '02',
    'Clothing': '03',
    'Food': '04',
    'Books': '05',
    'Toys': '06',
    'Cosmetics': '07',
    'Jewelry': '08',
    'Sports': '09',
    'Shoes': '10',
    'Accessories': '11',
    'Tools': '12',
    'Stationery': '13',
    'Appliances': '14',
    'Other': '15'
}




# Generate custom product id
product_id = []


data = {
    "product_id": [f"P{str(i).zfill(4)}" for i in range(1, num_products + 1)],
    "product_price": np.random.uniform(10, 100, size=num_products),  # Prices between $10 and $100
    "raw_material": np.random.choice([f"RM{str(i).zfill(2)}" for i in range(1, num_raw_materials + 1)], size=num_products),
    "number_of_quantity": np.random.randint(10, 1000, size=num_products),  # Quantity in demand
    "category": np.random.choice([i for i in category.keys()], size=num_products),
    "type_of_product": np.random.choice([i for i in category.keys], size=num_products),
    "number_of_products_in_stock": np.random.randint(0, 500, size=num_products),  # Current stock
    "raw_material_used": np.random.uniform(0.5, 10, size=num_products),  # Raw material used per product
}

# Generate historical sales data for the last 12 months (sum of random sales for simplicity)
historical_sales = [
    sum(np.random.randint(10, 500, size=num_months)) for _ in range(num_products)
]
data["historical_sales_data"] = historical_sales

# Generate seasonality indicators (1 = Peak season, 0 = Off-season)
seasonality_indicators = np.random.choice([0, 1], size=num_products, p=[0.7, 0.3])
data["seasonality_indicator"] = seasonality_indicators

# Generate discounts/promotions (percentage discounts between 0% and 50%)
discounts = np.random.uniform(0, 50, size=num_products)
data["discounts/promotions"] = discounts

# Convert the data dictionary into a pandas DataFrame
df = pd.DataFrame(data)

# Save the dataset to a CSV file
df.to_csv("enhanced_stock_prediction_dataset.csv", index=False)

print("Dataset created and saved as 'enhanced_stock_prediction_dataset.csv'")
