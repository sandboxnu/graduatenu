import {
  Schedule2,
  ScheduleCourse2,
  StatusEnum,
  Template,
} from "@graduate/common";
import { createEmptySchedule } from "./createEmptySchedule";

/**
 * Creates a schedule from a template
 *
 * @param   template     The template to create a schedule from
 * @param   courseLookup Optional lookup object with course details from the API
 * @returns              A new schedule populated with courses from the template
 */
export function createScheduleFromTemplate(
  template: Template,
  courseLookup?: Record<string, ScheduleCourse2<null>>
): Schedule2<null> {
  // Start with an empty schedule
  const schedule = createEmptySchedule();

  try {
    // Check if we have the template data
    if (!template.templateData || !template.name) {
      console.error("Missing template data or name");
      return schedule;
    }

    // Get the plan data from the template
    const planData = template.templateData[template.name];
    if (!planData) {
      console.error("No plan data found in template");
      return schedule;
    }

    // Process each year in the template
    Object.keys(planData).forEach((yearKey) => {
      // Extract the year number from the year key (e.g., "Year 1" -> 1)
      const yearMatch = yearKey.match(/Year (\d+)/i);
      if (!yearMatch) return;

      const yearNum = parseInt(yearMatch[1], 10);
      if (isNaN(yearNum) || yearNum < 1 || yearNum > schedule.years.length)
        return;

      // Get the year object from the schedule (0-indexed)
      const yearObj = schedule.years[yearNum - 1];

      // Set all terms to inactive by default
      yearObj.fall.status = StatusEnum.INACTIVE;
      yearObj.spring.status = StatusEnum.INACTIVE;
      yearObj.summer1.status = StatusEnum.INACTIVE;
      yearObj.summer2.status = StatusEnum.INACTIVE;

      const yearData = planData[yearKey];

      // Process each term in the year
      Object.keys(yearData).forEach((termKey) => {
        const courses = yearData[termKey];
        if (!Array.isArray(courses)) return;

        // Map the term key to the schedule term
        let termObj: {
          status: StatusEnum;
          classes: ScheduleCourse2<null>[];
        };

        switch (termKey.toLowerCase()) {
          case "fall":
            termObj = yearObj.fall;
            break;
          case "spring":
            termObj = yearObj.spring;
            break;
          case "summer 1":
            termObj = yearObj.summer1;
            break;
          case "summer 2":
            termObj = yearObj.summer2;
            break;
          default:
            return; // Skip unknown terms
        }

        // If there are courses, set status to CLASSES
        if (courses.length > 0) {
          termObj.status = StatusEnum.CLASSES;
          termObj.classes = []; // Clear any existing classes

          // Process each course
          courses.forEach((courseStr) => {
            // Parse course string format
            const courseParts = courseStr.match(/([A-Z]+)\s+(\d+[A-Z]*)(.*)/);
            if (!courseParts) {
              console.warn("Couldn't parse course:", courseStr);
              return;
            }

            const subject = courseParts[1];
            const classId = courseParts[2];
            const courseKey = `${subject} ${classId}`;

            // Look up the course in the API data
            const courseDetails = courseLookup?.[courseKey];

            // Debug logging to help identify course lookup issues
            console.log(
              `Course ${courseKey}: Found in lookup: ${!!courseDetails}`,
              courseDetails
                ? `credits: ${courseDetails.numCreditsMin}-${courseDetails.numCreditsMax}`
                : "not found"
            );

            // Create a course object
            const course: ScheduleCourse2<null> = {
              // Use the name from the API if available, otherwise use the template string
              name: courseDetails?.name || courseStr,
              subject,
              classId,
              // If we have course details, use its credit values exactly as provided
              // This ensures 0-credit courses remain 0-credit
              numCreditsMin: courseDetails ? courseDetails.numCreditsMin : 1,
              numCreditsMax: courseDetails ? courseDetails.numCreditsMax : 1,
              prereqs: courseDetails?.prereqs,
              coreqs: courseDetails?.coreqs,
              nupaths: courseDetails?.nupaths,
              id: null,
            };

            // Log the final course object for validation
            console.log(
              `Added course: ${course.subject} ${course.classId}, credits: ${course.numCreditsMin}-${course.numCreditsMax}`
            );

            // Add course to the term
            termObj.classes.push(course);
          });
        }
      });
    });

    console.log("Final schedule:", schedule);
    return schedule;
  } catch (error) {
    console.error("Error creating schedule from template:", error);
    return createEmptySchedule();
  }
}
