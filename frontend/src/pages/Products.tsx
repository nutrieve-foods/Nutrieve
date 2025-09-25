import { useEffect, useState } from 'react';

type Product = { id: number; name: string; price: number; image?: string | null; description?: string };

export default function ProductsPage() {
  const [items, setItems] = useState<Product[]>([]);
  const [cart, setCart] = useState<Record<number, number>>({});

  useEffect(() => {
    (async () => {
      const base = ((import.meta as any).env?.VITE_API_URL as string) || 'http://localhost:8000';
      const r = await fetch(base + '/api/products');
      setItems(await r.json());
    })();
  }, []);

  function inc(id: number) {
    setCart(c => ({ ...c, [id]: (c[id] || 0) + 1 }));
  }
  function dec(id: number) {
    setCart(c => {
      const n = Math.max((c[id] || 0) - 1, 0);
      const next = { ...c } as any;
      if (n === 0) delete next[id]; else next[id] = n;
      return next;
    });
  }

  const total = items.reduce((sum, p) => sum + (cart[p.id] || 0) * p.price, 0);

  return (
    <section id="products" className="py-20" style={{  backgroundImage: `
      linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)),
      url("https://www.transparenttextures.com/patterns/wood-pattern.png")
    `,
    backgroundColor: '#6b4226', }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="font-playfair text-4xl md:text-5xl font-bold text-white mb-2">All Products</h2>
          <p className="text-white/90">Add to cart and proceed to checkout.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {items.map(p => (
            <div key={p.id} className="group bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
              <div className="relative overflow-hidden">
                <img src={p.image || '/background_image.jpg'} alt={p.name} className="w-full h-64 object-cover" />
              </div>
              <div className="p-6 space-y-3">
                <div className="font-playfair text-xl font-semibold text-gray-800">{p.name}</div>
                <div className="text-gray-600 text-sm">{p.description}</div>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold text-gray-800">₹{p.price}</div>
                  <div className="flex items-center gap-2">
                    <button className="px-3 py-1 rounded bg-gray-100" onClick={() => dec(p.id)}>-</button>
                    <div className="min-w-6 text-center">{cart[p.id] || 0}</div>
                    <button className="px-3 py-1 rounded bg-gray-100" onClick={() => inc(p.id)}>+</button>
                  </div>
                </div>
                <button className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white py-3 rounded-xl font-semibold" onClick={() => inc(p.id)}>Add to Cart</button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 bg-white rounded-2xl p-6 flex items-center justify-between shadow">
          <div className="text-gray-700">Items: {Object.values(cart).reduce((a, b) => a + b, 0)} • Total: ₹{total}</div>
          <a href="#/checkout" className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-6 py-3 rounded-xl font-semibold">Buy Now</a>
        </div>
      </div>
    </section>
  );
}


