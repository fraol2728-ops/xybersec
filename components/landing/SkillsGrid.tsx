const skills = [
  { icon: "🌐", name: "Web App Hacking", desc: "XSS, SQLi, CSRF, bug bounty" },
  { icon: "🔌", name: "Network Pentesting", desc: "Scanning, exploitation, pivoting" },
  { icon: "🦠", name: "Malware Analysis", desc: "Reverse engineering, sandboxing" },
  { icon: "🔍", name: "Digital Forensics", desc: "Evidence, investigation, analysis" },
  { icon: "🎭", name: "Social Engineering", desc: "Phishing, pretexting, defense" },
  { icon: "🚩", name: "CTF Challenges", desc: "Competitions, flags, writeups" },
  { icon: "💰", name: "Bug Bounty", desc: "HackerOne, Bugcrowd, payouts" },
  { icon: "💻", name: "Linux & CLI", desc: "Terminal, scripting, tools" },
]

export function SkillsGrid() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-primary text-sm font-semibold tracking-wider uppercase mb-3">WHAT YOU WILL LEARN</p>
          <h2 className="text-3xl font-bold text-foreground mb-4">Master the Skills Employers Want</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">From web application hacking to network pentesting — build a complete cybersecurity skill set.</p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {skills.map((skill) => (
            <div key={skill.name} className="flex items-start gap-3 p-4 rounded-xl border border-border bg-muted/50 hover:border-primary/40 hover:bg-muted transition-all duration-200 group">
              <span className="text-2xl flex-shrink-0 group-hover:scale-110 transition-transform">{skill.icon}</span>
              <div>
                <p className="text-sm font-semibold text-foreground mb-0.5">{skill.name}</p>
                <p className="text-xs text-muted-foreground">{skill.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
