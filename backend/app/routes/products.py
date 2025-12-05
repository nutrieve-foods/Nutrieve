from fastapi import APIRouter

router = APIRouter(prefix="/api/products", tags=["products"])

# Sample products data
PRODUCTS = [
    {"id": i + 1, "name": name, "price": price, "image": f"/{name.replace(' ', '_').replace('/', '_').replace('(', '').replace(')', '')}.jpg", "description": desc, "category": "Spice Powders"}
    for i, (name, price, desc) in enumerate([
        ("Tomato Powder", 185, "Tangy, sweet instant zest"),
        ("Onion Powder", 230, "Intense savory depth"),
        ("Garlic Powder", 375, "Bold aromatic base"),
        ("Ginger Powder", 300, "Pungent warm spice"),
        ("Turmeric Powder", 185, "Earthy golden flavor"),
        ("Red Chili Powder", 375, "Fiery vibrant heat"),
        ("Coriander Powder", 250, "Warm citrus herbal"),
        ("Black Pepper Powder", 1200, "Sharp pungent finish"),
        ("Amla Powder", 500, "Intensely tart Vitamin-C"),
        ("Ashwagandha Powder", 1400, "Earthy vitality herb"),
        ("Shatavari Powder", 1550, "Mildly sweet cooling root"),
        ("Safed Musli Powder", 2350, "Subtly sweet wellness"),
        ("Brahmi Powder", 1050, "Bitter focus herb"),
        ("Tulsi Powder", 325, "Pungent sweet aromatic"),
        ("Moringa Powder", 500, "Grassy nutrient-dense"),
        ("Neem Powder", 235, "Intensely bitter purification"),
        ("Mint Powder", 245, "Cool refreshing aroma"),
        ("Beetroot Powder", 315, "Sweet earthy color"),
        ("Carrot Powder", 250, "Mild sweet vegetable"),
        ("Spinach Powder", 270, "Earthy concentrated greens"),
        ("Bitter Gourd Powder", 270, "Powerful bitter vegetable"),
        ("Apple Powder", 500, "Naturally sweet fruit"),
        ("Banana Powder", 325, "Sweet creamy smooth"),
        ("Coconut Powder", 500, "Rich sweet tropical"),
        ("Green Chili Powder", 400, "Clean sharp heat"),
        ("White Pepper Powder", 400, "Earthy mild heat"),
        ("Onion Granules", 400, "Textured robust savory"),
        ("Green Peas Powder", 160, "Sweet protein-rich"),
        ("Lemon Powder", 180, "Bright citrus tang"),
        ("Cardamom Powder", 480, "Sweet floral spice"),
    ])
]

@router.get("")
def list_products():
    """Get all products"""
    try:
        print(f"Returning {len(PRODUCTS)} products")
        return PRODUCTS
    except Exception as e:
        print(f"Error in list_products: {e}")
        raise

@router.get("/{product_id}")
def get_product(product_id: int):
    """Get single product by ID"""
    try:
        product = next((p for p in PRODUCTS if p["id"] == product_id), None)
        if not product:
            from fastapi import HTTPException
            raise HTTPException(status_code=404, detail="Product not found")
        return product
    except Exception as e:
        print(f"Error in get_product: {e}")
        raise

