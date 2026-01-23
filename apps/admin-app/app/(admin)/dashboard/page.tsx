const stats = [
  { label: "Total Customers", value: "12,480", delta: "+4.3%" },
  { label: "Active Sellers", value: "842", delta: "+2.1%" },
  { label: "Live Products", value: "18,392", delta: "+1.2%" },
  { label: "Pending Reviews", value: "64", delta: "-8.6%" },
];

const alerts = [
  {
    title: "Returns spike in Electronics",
    detail: "Monitor sellers with return rates above 3%.",
  },
  {
    title: "Inventory alerts",
    detail: "17 products fell below safety stock today.",
  },
  {
    title: "High value customers",
    detail: "24 customers crossed the $1,000 spend tier.",
  },
];

export default function DashboardPage() {
  return (
    <section className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
          Overview
        </p>
        <h2 className="text-3xl font-semibold text-foreground">Dashboard</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Track marketplace health, active sellers, and customer momentum.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border border-border bg-card p-5 shadow-sm"
          >
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              {item.label}
            </p>
            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-2xl font-semibold text-foreground">
                {item.value}
              </span>
              <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                {item.delta}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-foreground">
              Activity Pulse
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              A snapshot of marketplace operations in the last 24 hours.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-border/60 bg-muted/50 p-4">
                <p className="text-sm font-medium text-foreground">Orders placed</p>
                <p className="mt-2 text-2xl font-semibold text-foreground">1,204</p>
                <p className="text-xs text-muted-foreground">+6% vs. yesterday</p>
              </div>
              <div className="rounded-xl border border-border/60 bg-muted/50 p-4">
                <p className="text-sm font-medium text-foreground">Revenue</p>
                <p className="mt-2 text-2xl font-semibold text-foreground">$94,520</p>
                <p className="text-xs text-muted-foreground">+3.2% vs. yesterday</p>
              </div>
              <div className="rounded-xl border border-border/60 bg-muted/50 p-4">
                <p className="text-sm font-medium text-foreground">New sellers</p>
                <p className="mt-2 text-2xl font-semibold text-foreground">12</p>
                <p className="text-xs text-muted-foreground">Onboarded today</p>
              </div>
              <div className="rounded-xl border border-border/60 bg-muted/50 p-4">
                <p className="text-sm font-medium text-foreground">Support tickets</p>
                <p className="mt-2 text-2xl font-semibold text-foreground">38</p>
                <p className="text-xs text-muted-foreground">Average SLA 2h</p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-foreground">Alerts</h3>
          <div className="mt-4 space-y-4">
            {alerts.map((alert) => (
              <div key={alert.title} className="rounded-xl border border-border/60 p-4">
                <p className="text-sm font-semibold text-foreground">{alert.title}</p>
                <p className="mt-1 text-xs text-muted-foreground">{alert.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
