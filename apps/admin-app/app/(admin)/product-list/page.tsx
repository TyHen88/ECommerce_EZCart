const products = [
  {
    name: "Aurora Wireless Headphones",
    seller: "SoundTech",
    status: "Live",
    price: "$189",
    stock: "142",
  },
  {
    name: "Nimbus Smartwatch",
    seller: "PulseWear",
    status: "Review",
    price: "$249",
    stock: "35",
  },
  {
    name: "Contour Ergonomic Chair",
    seller: "WorkCraft",
    status: "Live",
    price: "$399",
    stock: "76",
  },
  {
    name: "Lumen Desk Lamp",
    seller: "BrightHome",
    status: "Paused",
    price: "$78",
    stock: "12",
  },
  {
    name: "Streamline Backpack",
    seller: "UrbanTrail",
    status: "Live",
    price: "$129",
    stock: "203",
  },
];

export default function ProductListPage() {
  return (
    <section className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
          Admin
        </p>
        <h2 className="text-3xl font-semibold text-foreground">Product List</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Review product status, pricing, and inventory coverage.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="grid grid-cols-5 gap-4 border-b border-border/60 bg-muted/50 px-6 py-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          <span>Product</span>
          <span>Seller</span>
          <span>Status</span>
          <span>Price</span>
          <span>Stock</span>
        </div>
        <div className="divide-y divide-border/60">
          {products.map((product) => (
            <div
              key={product.name}
              className="grid grid-cols-5 gap-4 px-6 py-4 text-sm text-muted-foreground"
            >
              <span className="font-medium text-foreground">{product.name}</span>
              <span>{product.seller}</span>
              <span className="font-medium">{product.status}</span>
              <span className="font-semibold text-foreground">{product.price}</span>
              <span>{product.stock}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
