from fastapi import APIRouter

router = APIRouter(prefix="/api/products", tags=["products"])


_PRODUCTS = [
    {"id": i + 1, "name": name, "price": price, "image": None, "description": desc}
    for i, (name, price, desc) in enumerate(
        ("Tomato Powder", 185, "Tangy zest for sauces and soups"),
        ("Onion Powder", 230, "Rich, savory depth in every sprinkle"),
        ("Garlic Powder", 375, "Bold aroma for instant flavor"),
        ("Ginger Powder", 300, "Warm spice for teas and curries"),
        ("Turmeric Powder", 185, "Golden health and flavor"),
        ("Red Chili Powder", 375, "Fiery and vibrant"),
        ("Coriander Powder", 250, "Fresh herbal notes"),
        ("Black Pepper Powder", 1200, "Sharp pungent finish"),
        ("Amla (Indian gooseberry) Powder", 500, "Vitamin C rich tartness"),
        ("Ashwagandha Powder", 1400, "Ayurvedic vitality herb"),
        ("Shatavari Powder", 1550, "Earthy sweetness and color"),
        ("Safed Musli Powder", 2350, "Greens in a spoonful"),
        ("Brahmi Powder", 1050, "Natural sweetness for blends"),
        ("Tulsi(Holy Basil) Powder", 325, "Velvety body for soups"),
        ("Moringa Powder", 500, "Tart zing for chaats"),
        ("Neem Powder", 235, "Fresh herbal notes"),
        ("Mint Powder", 245, "Refreshing cool aroma"),
        ("Beetroot Powder", 315, "Toasty spice warmth"),
        ("Carrot Powder", 250, "Distinct bitter-sweet profile"),
        ("Spinach Powder", 270, "Rich nutty warmth"),
        ("Karela/Bitter Gourd Powder", 270, "Punchy pungency"),
        ("Apple Powder", 500, "Intense warm spice"),
        ("Banana Powder", 325, "Sweet woody spice"),
        ("Coconut Powder", 500, "Savory aromatic base"),
        ("Green Chili Powder", 400, "Clean heat for blends"),
        ("White Pepper Powder", 400, "Quintessential South Indian aroma"),
        ("Onion Granules", 400, "Tangy depth for gravies"),
        ("Green Peas Powder", 160, "Natural caramel sweetness"),
        ("Lemon Powder", 180, "Citrusy brightness in a dash"),
        ("Cardamom Powder", 480, "Sweet floral spice"),
        
        
        
        
        
        
        
        
    )
]


@router.get("")
def list_products():
    return _PRODUCTS


