export default function Checkout() {
  return (
    <section className="py-20" style={{ backgroundImage: 'url("/background image3.jpeg")' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto bg-white/90 rounded-2xl shadow-lg p-8 space-y-6">
          <h2 className="font-playfair text-3xl font-bold text-gray-800">Checkout</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input className="border px-4 py-3 rounded" placeholder="Full Name" />
            <input className="border px-4 py-3 rounded" placeholder="Phone" />
            <input className="border px-4 py-3 rounded md:col-span-2" placeholder="Address" />
            <input className="border px-4 py-3 rounded" placeholder="City" />
            <input className="border px-4 py-3 rounded" placeholder="Pincode" />
          </div>
          <button className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white py-3 rounded-xl font-semibold">Proceed to Payment</button>
        </div>
      </div>
    </section>
  );
}


