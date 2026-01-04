from app.database import SessionLocal
from app.models import Product

db = SessionLocal()

products = [
    # Fruits
    ("Banana Powder", 699, "Banana_Powder.jpg", "Fruit"),
    ("Lemon Powder", 599, "Lemon_Powder.jpg", "Fruit"),

    # Spices & Herbs
    ("Ginger Powder", 699, "Ginger_Powder.jpg", "Spices & Herbs"),
    ("Turmeric Powder", 499, "Turmeric_Powder.jpg", "Spices & Herbs"),
    ("Green Chili Powder", 899, "Green_Chili_Powder.jpg", "Spices & Herbs"),
    ("Red Chili Powder", 799, "Red_Chili_Powder.jpg", "Spices & Herbs"),
    ("Coriander Seeds Powder", 499, "Coriander_Powder.jpg", "Spices & Herbs"),
    ("Mint Powder", 599, "Mint_Powder.jpg", "Spices & Herbs"),
    ("Cumin (jeera) Powder", 999, "Cumin_Powder.jpg", "Spices & Herbs"),
    ("Cinnamon Powder", 1599, "Cinnamon_Powder.jpg", "Spices & Herbs"),
    ("Curry Leaves Powder", 599, "Curry_Leaves_Powder.jpg", "Spices & Herbs"),
    ("Kasuri Methi Powder", 899, "Kasuri_Methi_Powder.jpg", "Spices & Herbs"),
    ("Paprika Powder", 899, "Paprika_Powder.jpg", "Spices & Herbs"),

    # Veggies
    ("Tomato Powder", 799, "Tomato_Powder.jpg", "Veggies"),
    ("Onion Powder", 499, "Onion_Powder.jpg", "Veggies"),
    ("Garlic Powder", 699, "Garlic_Powder.jpg", "Veggies"),
    ("Carrot Powder", 699, "Carrot_Powder.jpg", "Veggies"),
    ("Spinach Powder", 699, "Spinach_Powder.jpg", "Veggies"),
    ("Bitter Gourd Powder", 699, "Bitter_Gourd_Powder.jpg", "Veggies"),
    ("Onion Granules", 899, "Onion_Granules.jpg", "Veggies"),
    ("Coriander Leaves Powder", 399, "Coriander_Leaves_Powder.jpg", "Veggies"),
    ("Amla Powder", 899, "Amla_Powder.jpg", "Veggies"),
]

for name, price, img, category in products:
    p = Product(
        name=name,
        base_price=price,      # PRICE PER KG
        image=img,
        category=category,
        description=f"Premium quality {name.lower()}",
        stock_quantity=100
    )
    db.add(p)

db.commit()
db.close()

print("✅ Products seeded successfully with updated prices & categories!")
