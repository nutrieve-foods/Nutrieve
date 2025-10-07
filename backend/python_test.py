import psycopg2
from sqlalchemy import create_engine

# Test connection
try:
    conn = psycopg2.connect(
        host="localhost",
        database="nutrieve_db",
        user="postgres",
        password="Madgoku@18"
    )
    print("✅ Database connection successful!")
    
    # Test query
    cur = conn.cursor()
    cur.execute("SELECT COUNT(*) FROM products;")
    count = cur.fetchone()[0]
    print(f"✅ Found {count} products in database")
    
    conn.close()
except Exception as e:
    print(f"❌ Database connection failed: {e}")