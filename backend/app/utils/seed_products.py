from app.database import SessionLocal
from app.models import Product

db = SessionLocal()

products = [
    ("Tomato Powder", 185, "Tomato_Powder.jpg", "Tangy, sweet instant zest for sauces and soups"),
    ("Onion Powder", 230, "Onion_Powder.jpg", "Strong aromatic seasoning for curries and snacks"),
    ("Garlic Powder", 375, "Garlic_Powder.jpg", "Rich garlicky flavor for instant seasoning"),
    ("Ginger Powder", 300, "Ginger_Powder.jpg", "Hot and aromatic cooking spice"),
    ("Turmeric Powder", 185, "Turmeric_Powder.jpg", "Pure haldi with strong colour & aroma"),
    ("Red Chili Powder", 375, "Red_Chili_Powder.jpg", "Spicy, vibrant red chili powder"),
    ("Coriander Powder", 250, "Coriander_Powder.jpg", "Fresh dhaniya flavor enhancer"),
    ("Black Pepper Powder", 1200, "Black_Pepper_Powder.jpg", "Strong peppery seasoning"),
    ("Amla Powder", 500, "Amla_Powder.jpg", "High-vitamin C herb for health drinks"),
    ("Ashwagandha Powder", 1400, "Ashwagandha_Powder.jpg", "Stress relief and immunity booster"),
    ("Shatavari Powder", 1550, "Shatavari_Powder.jpg", "Ayurvedic vitality herb"),
    ("Safed Musli Powder", 2350, "Safed_Musli_Powder.jpg", "Premium energy & wellness herb"),
    ("Brahmi Powder", 1050, "Brahmi_Powder.jpg", "Supports memory and focus"),
    ("Tulsi Powder", 325, "Tulsi_Powder.jpg", "Natural immunity booster"),
    ("Moringa Powder", 500, "Moringa_Powder.jpg", "High-nutrient green superfood"),
    ("Neem Powder", 235, "Neem_Powder.jpg", "Detoxifying ayurvedic herb"),
    ("Mint Powder", 245, "Mint_Powder.jpg", "Refreshing cool mint flavor"),
    ("Beetroot Powder", 315, "Beetroot_Powder.jpg", "Natural red color & nutrition"),
    ("Carrot Powder", 250, "Carrot_Powder.jpg", "Vitamin-rich carrot extract"),
    ("Spinach Powder", 270, "Spinach_Powder.jpg", "Iron-rich leafy green powder"),
    ("Bitter Gourd Powder", 270, "Bitter_Gourd_Powder.jpg", "Karela powder for health drinks"),
    ("Apple Powder", 500, "Apple_Powder.jpg", "Sweet fruit powder for shakes"),
    ("Banana Powder", 325, "Banana_Powder.jpg", "Smooth & creamy banana flavor"),
    ("Coconut Powder", 500, "Coconut_Powder.jpg", "Dry coconut for desserts"),
    ("Green Chili Powder", 400, "Green_Chili_Powder.jpg", "Fresh green chili heat"),
    ("White Pepper Powder", 400, "White_Pepper_Powder.jpg", "Mild smooth pepper flavor"),
    ("Onion Granules", 400, "Onion_Granules.jpg", "Crunchy onion seasoning"),
    ("Green Pea Powder", 400, "Green_Peas_Powder.jpg", "Protein-rich pea powder"),
    ("Lemon Powder", 180, "Lemon_Powder.jpg", "Tangy lemon zest powder"),
]

for name, price, img, desc in products:
    p = Product(
        name=name,
        base_price=price,
        image=img,
        description=f"Premium quality {name.lower()}.",
        stock_quantity=100
    )
    db.add(p)

db.commit()
db.close()
print("Products seeded successfully!")
