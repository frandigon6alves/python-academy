"use client";

import { ErrorState, Loading } from "@/components/ui/QueryState";
import { useCourses } from "@/lib/api/hooks/content";
import { useProgress } from "@/lib/api/hooks/learning";
import { CourseCard } from "./CourseCard";
import styles from "./CourseCatalogue.module.css";

export function CourseCatalogue() {
  const courses = useCourses();
  // Only fetched for signed-in learners; visitors simply see no progress bars.
  const progress = useProgress();

  if (courses.isPending) return <Loading />;
  if (courses.isError) return <ErrorState error={courses.error} onRetry={() => courses.refetch()} />;

  return (
    <div className={styles.grid}>
      {courses.data.map((course, index) => (
        <CourseCard
          key={course.slug}
          course={course}
          position={index + 1}
          progress={progress.data?.courses.find((item) => item.course_slug === course.slug)}
        />
      ))}
    </div>
  );
}
