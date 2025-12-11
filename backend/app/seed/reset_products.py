from app.database import SessionLocal
from app.models import Product

db = SessionLocal()

# DELETE OLD PRODUCTS
db.query(Product).delete()
db.commit()

print("❌ Old products deleted. Now run seed_products.py to insert new ones.")
