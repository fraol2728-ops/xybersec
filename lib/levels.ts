export const LEVELS = [
  { level: 1, minXP: 0, maxXP: 999, title: "Rookie" },
  { level: 2, minXP: 1000, maxXP: 2499, title: "Apprentice" },
  { level: 3, minXP: 2500, maxXP: 4999, title: "Analyst" },
  { level: 4, minXP: 5000, maxXP: 9999, title: "Operator" },
  { level: 5, minXP: 10000, maxXP: 19999, title: "Specialist" },
  { level: 6, minXP: 20000, maxXP: 39999, title: "Expert" },
  { level: 7, minXP: 40000, maxXP: 79999, title: "Elite" },
  { level: 8, minXP: 80000, maxXP: 999999, title: "Legend" },
];

export function getLevelFromXP(xp: number): {
  level: number;
  title: string;
  currentXP: number;
  minXP: number;
  maxXP: number;
  progressPercent: number;
  xpToNext: number;
} {
  const levelData = [...LEVELS].reverse().find((l) => xp >= l.minXP) ?? LEVELS[0];

  const progressPercent = Math.round(((xp - levelData.minXP) / (levelData.maxXP - levelData.minXP + 1)) * 100);

  return {
    level: levelData.level,
    title: levelData.title,
    currentXP: xp,
    minXP: levelData.minXP,
    maxXP: levelData.maxXP,
    progressPercent: Math.min(progressPercent, 100),
    xpToNext: Math.max(0, levelData.maxXP + 1 - xp),
  };
}

export const XP_REWARDS = {
  LESSON_COMPLETE: 50,
  MODULE_COMPLETE: 200,
  COURSE_COMPLETE: 1000,
  FIRST_LESSON: 100,
  STREAK_7_DAYS: 500,
  STREAK_30_DAYS: 2000,
};
