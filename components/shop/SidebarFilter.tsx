export default function SidebarFilter() {
  return (
    <aside className="rounded-2xl border p-6">
      <h2 className="mb-6 text-xl font-bold">Filters</h2>

      {/* Categories */}
      <div className="mb-8">
        <h3 className="mb-3 font-semibold">Category</h3>

        <div className="space-y-2 text-gray-600">
          <label className="flex items-center gap-2">
            <input type="checkbox" />
            Shirts
          </label>

          <label className="flex items-center gap-2">
            <input type="checkbox" />
            T-Shirts
          </label>

          <label className="flex items-center gap-2">
            <input type="checkbox" />
            Jeans
          </label>

          <label className="flex items-center gap-2">
            <input type="checkbox" />
            Co-ord Sets
          </label>
        </div>
      </div>

      {/* Size */}
      <div className="mb-8">
        <h3 className="mb-3 font-semibold">Size</h3>

        <div className="flex flex-wrap gap-2">
          {["S", "M", "L", "XL"].map((size) => (
            <button
              key={size}
              className="rounded-lg border px-4 py-2 hover:bg-black hover:text-white"
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Price */}
      <div>
        <h3 className="mb-3 font-semibold">Price</h3>

        <input
          type="range"
          min="500"
          max="5000"
          className="w-full"
        />

        <p className="mt-2 text-sm text-gray-500">
          ₹500 – ₹5000
        </p>
      </div>
    </aside>
  );
}