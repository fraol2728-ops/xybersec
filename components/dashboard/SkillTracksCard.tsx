interface SkillTracksCardProps {
  skillProgress: Record<string, number>;
  learningGoals: string[];
}

const SKILL_CONFIG: Record<string, { label: string; icon: string; color: string; barColor: string }> = {
  web_hacking: {
    label: "Web App Hacking",
    icon: "🌐",
    color: "text-green-400",
    barColor: "bg-green-400",
  },
  network_pentesting: {
    label: "Network Security",
    icon: "🔌",
    color: "text-blue-400",
    barColor: "bg-blue-400",
  },
  linux: {
    label: "Linux & CLI",
    icon: "💻",
    color: "text-orange-400",
    barColor: "bg-orange-400",
  },
  malware_analysis: {
    label: "Malware Analysis",
    icon: "🦠",
    color: "text-red-400",
    barColor: "bg-red-400",
  },
  digital_forensics: {
    label: "Digital Forensics",
    icon: "🔍",
    color: "text-purple-400",
    barColor: "bg-purple-400",
  },
  ctf: {
    label: "CTF Challenges",
    icon: "🚩",
    color: "text-yellow-400",
    barColor: "bg-yellow-400",
  },
  bug_bounty: {
    label: "Bug Bounty",
    icon: "💰",
    color: "text-emerald-400",
    barColor: "bg-emerald-400",
  },
  social_engineering: {
    label: "Social Engineering",
    icon: "🎭",
    color: "text-pink-400",
    barColor: "bg-pink-400",
  },
};

export function SkillTracksCard({ skillProgress, learningGoals }: SkillTracksCardProps) {
  if (!learningGoals.length) {
    return (
      <div className="rounded-2xl border border-border bg-muted p-5">
        <h3 className="text-sm font-semibold text-foreground">Skill Tracks</h3>
        <p className="text-sm text-muted-foreground">Update your profile to see skill tracks.</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-muted p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">🎯 Skill Tracks</h3>
        <span className="text-xs text-muted-foreground">Based on your learning goals</span>
      </div>

      <div className="space-y-4">
        {learningGoals.map((goal) => {
          const config = SKILL_CONFIG[goal];
          if (!config) return null;
          const progress = skillProgress[goal] ?? 0;

          return (
            <div key={goal}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-sm">{config.icon}</span>
                  <span className={`text-xs font-medium ${config.color}`}>{config.label}</span>
                </div>
                <span className="text-xs text-muted-foreground font-mono">{progress}%</span>
              </div>
              <div className="w-full h-2 bg-background rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${config.barColor} transition-all duration-700`}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {learningGoals.length > 0 && Object.values(skillProgress).every((v) => v === 0) && (
        <p className="text-xs text-muted-foreground mt-4 text-center">Complete lessons to build your skill tracks!</p>
      )}
    </div>
  );
}
