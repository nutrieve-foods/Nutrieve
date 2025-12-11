from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..deps.db import get_db
from ..models import Product

router = APIRouter(prefix="/api/admin", tags=["admin"])

PRODUCTS = [
    ("Tomato Powder", 185, "Tomato_Powder.jpg"),
    ("Onion Powder", 230, "Onion_Powder.jpg"),
    ("Garlic Powder", 375, "Garlic_Powder.jpg"),
    ("Ginger Powder", 300, "Ginger_Powder.jpg"),
    ("Turmeric Powder", 185, "Turmeric_Powder.jpg"),
    ("Red Chili Powder", 375, "Red_Chili_Powder.jpg"),
    ("Coriander Powder", 250, "Coriander_Powder.jpg"),
    ("Black Pepper Powder", 1200, "Black_Pepper_Powder.jpg"),
    ("Amla Powder", 500, "Amla_Powder.jpg"),
    ("Ashwagandha Powder", 1400, "Ashwagandha_Powder.jpg"),
    ("Shatavari Powder", 1550, "Shatavari_Powder.jpg"),
    ("Safed Musli Powder", 2350, "Safed_Musli_Powder.jpg"),
    ("Brahmi Powder", 1050, "Brahmi_Powder.jpg"),
    ("Tulsi Powder", 325, "Tulsi_Powder.jpg"),
    ("Moringa Powder", 500, "Moringa_Powder.jpg"),
    ("Neem Powder", 235, "Neem_Powder.jpg"),
    ("Mint Powder", 245, "Mint_Powder.jpg"),
    ("Beetroot Powder", 315, "Beetroot_Powder.jpg"),
    ("Carrot Powder", 250, "Carrot_Powder.jpg"),
    ("Spinach Powder", 270, "Spinach_Powder.jpg"),
    ("Bitter Gourd Powder", 270, "Bitter_Gourd_Powder.jpg"),
    ("Apple Powder", 500, "Apple_Powder.jpg"),
    ("Banana Powder", 325, "Banana_Powder.jpg"),
    ("Coconut Powder", 500, "Coconut_Powder.jpg"),
    ("Green Chili Powder", 400, "Green_Chili_Powder.jpg"),
    ("White Pepper Powder", 400, "White_Pepper_Powder.jpg"),
    ("Onion Granules", 400, "Onion_Granules.jpg"),
    ("Green Pea Powder", 400, "Green_Peas_Powder.jpg"),
    ("Lemon Powder", 180, "Lemon_Powder.jpg"),
]

@router.post("/seed-products")
def seed_products(db: Session = Depends(get_db)):
    created = 0
    for name, price, img in PRODUCTS:
        exists = db.query(Product).filter(Product.name == name).first()
        if exists:
            continue

        db.add(Product(
            name=name,
            base_price=price,
            image=img,
            description=f"Premium quality {name.lower()}."
        ))
        created += 1

    db.commit()
    return {"message": "Products seeded", "created": created}
