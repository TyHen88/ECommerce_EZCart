const sellers = [
  {
    name: "SoundTech",
    owner: "Liam Carter",
    tier: "Top Rated",
    status: "Active",
    products: "126",
  },
  {
    name: "BrightHome",
    owner: "Emma Lewis",
    tier: "Verified",
    status: "Active",
    products: "58",
  },
  {
    name: "UrbanTrail",
    owner: "Daniel Ruiz",
    tier: "New",
    status: "Review",
    products: "12",
  },
  {
    name: "PulseWear",
    owner: "Olivia Grant",
    tier: "Verified",
    status: "Active",
    products: "74",
  },
  {
    name: "WorkCraft",
    owner: "Isabella Brooks",
    tier: "At Risk",
    status: "Paused",
    products: "34",
  },
];

export default function SellerListPage() {
  return (
    <section className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
          Admin
        </p>
        <h2 className="text-3xl font-semibold text-foreground">Seller List</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Keep tabs on seller tiers, activity, and catalog depth.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="grid grid-cols-5 gap-4 border-b border-border/60 bg-muted/50 px-6 py-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          <span>Seller</span>
          <span>Owner</span>
          <span>Tier</span>
          <span>Status</span>
          <span>Products</span>
        </div>
        <div className="divide-y divide-border/60">
          {sellers.map((seller) => (
            <div
              key={seller.name}
              className="grid grid-cols-5 gap-4 px-6 py-4 text-sm text-muted-foreground"
            >
              <span className="font-medium text-foreground">{seller.name}</span>
              <span>{seller.owner}</span>
              <span className="font-medium">{seller.tier}</span>
              <span>{seller.status}</span>
              <span className="font-semibold text-foreground">{seller.products}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
