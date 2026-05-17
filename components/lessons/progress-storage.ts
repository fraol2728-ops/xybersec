import { getUserProgress, saveLessonProgress } from "@/lib/actions";

export const progressEventName = "lesson-progress-updated";

export interface CourseProgressSnapshot {
  courseId: string;
  completedLessonIds: string[];
  progress: number;
}

const progressCache = new Map<string, CourseProgressSnapshot>();

function normalizeCompletedLessons(completedLessons: string[] = []) {
  return completedLessons;
}

function emitProgressEvent(courseId: string) {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(
    new CustomEvent(progressEventName, {
      detail: { courseId },
    }),
  );
}

export async function getCompletedLessonIds(courseId: string) {
  const cachedProgress = progressCache.get(courseId);
  if (cachedProgress) {
    return cachedProgress.completedLessonIds;
  }

  const progress = await getUserProgress("", courseId);
  const snapshot = {
    courseId,
    completedLessonIds: normalizeCompletedLessons(progress.completedLessons),
    progress: progress.progress,
  };

  progressCache.set(courseId, snapshot);
  return snapshot.completedLessonIds;
}

export async function getCourseProgress(courseId: string) {
  const completedLessonIds = await getCompletedLessonIds(courseId);
  const cachedProgress = progressCache.get(courseId);

  return {
    courseId,
    completedLessonIds,
    progress: cachedProgress?.progress ?? 0,
  };
}

export async function saveCompletedLessonIds(
  courseId: string,
  lessonId: string,
) {
  const progress = await saveLessonProgress("", courseId, lessonId);
  const snapshot = {
    courseId,
    completedLessonIds: normalizeCompletedLessons(progress.completedLessons),
    progress: progress.progress,
  };

  progressCache.set(courseId, snapshot);
  emitProgressEvent(courseId);
  return snapshot;
}

export function getAllCourseProgress() {
  return Array.from(progressCache.values());
}
