const stats = [
  { value: "Free", label: "First module always free", icon: "🎓", color: "text-primary" },
  { value: "ETB 299", label: "Full access per month", icon: "💳", color: "text-foreground" },
  { value: "AI", label: "Tutor in every lesson", icon: "🤖", color: "text-secondary" },
  { value: "🇪🇹", label: "Built for Ethiopia", icon: "", color: "text-foreground" },
]

export function StatsBar() {
  return (
    <section className="py-12 px-4 sm:px-6 lg:px-12 border-y border-border bg-muted/30">
      <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="flex flex-col items-center text-center p-6 rounded-xl bg-background border border-border hover:border-primary/30 transition-colors">
            <span className="text-3xl mb-1">{stat.icon}</span>
            <p className={`text-2xl font-bold mb-1 ${stat.color}`}>{stat.value}</p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
