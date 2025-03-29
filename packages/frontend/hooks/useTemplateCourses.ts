import { Template } from "@graduate/common";
import { useFetchCourses } from "./useFetchCourses";

export function useTemplateCourses(
  template: Template | null,
  catalogYear: number | null
) {
  // Extract course codes from template
  const coursesToFetch = extractCoursesFromTemplate(template);

  // Fetch course details from API
  const {
    courses: courseDetails,
    isLoading,
    error,
  } = useFetchCourses(coursesToFetch, catalogYear || new Date().getFullYear());

  // Create a lookup map for easy access
  const courseLookup =
    courseDetails?.reduce((acc, course) => {
      const key = `${course.subject} ${course.classId}`;
      acc[key] = course;
      return acc;
    }, {} as Record<string, any>) || {};

  return {
    courseLookup,
    isLoading,
    error,
  };
}

/** Extracts unique course identifiers from a template for API fetching */
function extractCoursesFromTemplate(template: Template | null) {
  if (!template || !template.templateData || !template.name) {
    return [];
  }

  const planData = template.templateData[template.name];
  if (!planData) {
    return [];
  }

  const uniqueCourses = new Set<string>();
  const coursesList: { subject: string; classId: string }[] = [];

  // Extract all courses from the template
  Object.keys(planData).forEach((yearKey) => {
    const yearData = planData[yearKey];

    Object.keys(yearData).forEach((termKey) => {
      const courses = yearData[termKey];
      if (!Array.isArray(courses)) return;

      courses.forEach((courseStr) => {
        // Parse course string format (e.g., "CS 3500: Object-Oriented Design" or "CS 3500")
        const courseParts = courseStr.match(/([A-Z]+)\s+(\d+[A-Z]*)/);
        if (!courseParts) return;

        const subject = courseParts[1];
        const classId = courseParts[2];
        const courseKey = `${subject} ${classId}`;

        // Add only unique courses
        if (!uniqueCourses.has(courseKey)) {
          uniqueCourses.add(courseKey);
          coursesList.push({ subject, classId });
        }
      });
    });
  });

  return coursesList;
}
