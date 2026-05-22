const steps = [
  { step: "01", icon: "🎓", title: "Sign Up Free", description: "Create your account in 2 minutes. Complete a quick profile so we can personalize your learning path. No credit card needed.", highlight: "Takes 2 minutes" },
  { step: "02", icon: "🛡️", title: "Learn the Fundamentals", description: "Start with Module 1 completely free. Real cybersecurity content, AI tutor support, and hands-on exercises. No fluff.", highlight: "Always free" },
  { step: "03", icon: "🏆", title: "Get Certified & Get Hired", description: "Unlock full access for ETB 299/month. Complete all modules, pass the final assessment, and earn your XyberSec certificate.", highlight: "ETB 299/month" },
]

export function HowItWorks() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-12 bg-muted/20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-primary text-sm font-semibold tracking-wider uppercase mb-3">THE PROCESS</p>
          <h2 className="text-3xl font-bold text-foreground mb-4">From Zero to Certified in 3 Steps</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">A clear path from complete beginner to job-ready cybersecurity professional.</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {steps.map((step, idx) => (
            <div key={step.step} className="relative">
              <div className="relative flex flex-col p-6 rounded-2xl border border-border bg-background hover:border-primary/30 transition-colors h-full">
                <span className="text-6xl font-black text-border absolute top-4 right-5 select-none">{step.step}</span>
                <span className="text-3xl mb-4">{step.icon}</span>
                <h3 className="text-lg font-semibold text-foreground mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1">{step.description}</p>
                <span className="self-start text-xs font-semibold text-primary bg-primary/10 border border-primary/20 px-3 py-1 rounded-full">{step.highlight}</span>
              </div>
              {idx < steps.length - 1 ? <div className="hidden lg:block absolute -right-4 top-1/2 text-muted-foreground">→</div> : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
