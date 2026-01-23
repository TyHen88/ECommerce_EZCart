const customers = [
  {
    name: "Ava Hughes",
    email: "ava.hughes@example.com",
    status: "Active",
    lastOrder: "2 days ago",
    spend: "$1,240",
  },
  {
    name: "Noah Patel",
    email: "noah.patel@example.com",
    status: "Active",
    lastOrder: "5 days ago",
    spend: "$980",
  },
  {
    name: "Mia Johnson",
    email: "mia.johnson@example.com",
    status: "At Risk",
    lastOrder: "21 days ago",
    spend: "$310",
  },
  {
    name: "Leo Zhang",
    email: "leo.zhang@example.com",
    status: "Active",
    lastOrder: "1 day ago",
    spend: "$2,450",
  },
  {
    name: "Sophia Reed",
    email: "sophia.reed@example.com",
    status: "Inactive",
    lastOrder: "63 days ago",
    spend: "$120",
  },
];

export default function CustomerListPage() {
  return (
    <section className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
          Admin
        </p>
        <h2 className="text-3xl font-semibold text-foreground">Customer List</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Monitor customer activity, spend, and retention status.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="grid grid-cols-5 gap-4 border-b border-border/60 bg-muted/50 px-6 py-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          <span>Customer</span>
          <span>Email</span>
          <span>Status</span>
          <span>Last Order</span>
          <span>Lifetime Spend</span>
        </div>
        <div className="divide-y divide-border/60">
          {customers.map((customer) => (
            <div
              key={customer.email}
              className="grid grid-cols-5 gap-4 px-6 py-4 text-sm text-muted-foreground"
            >
              <span className="font-medium text-foreground">{customer.name}</span>
              <span>{customer.email}</span>
              <span className="font-medium">{customer.status}</span>
              <span>{customer.lastOrder}</span>
              <span className="font-semibold text-foreground">{customer.spend}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
