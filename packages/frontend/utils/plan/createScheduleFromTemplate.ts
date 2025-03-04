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
 * @param   template The template to create a schedule from
 * @returns          A new schedule populated with courses from the template
 */
export function createScheduleFromTemplate(
  template: Template
): Schedule2<null> {
  // Start with an empty schedule
  const schedule = createEmptySchedule();

  try {
    console.log("Creating schedule from template:", template);

    // Check if we have the template data
    if (!template.templateData || !template.name) {
      console.error("Missing template data or name");
      return schedule as Schedule2<null>;
    }

    // Get the plan data from the template
    const planData = template.templateData[template.name];

    if (!planData) {
      console.error("No plan data found in template");
      return schedule as Schedule2<null>;
    }

    console.log("Processing plan data:", planData);

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
      console.log(`Processing ${yearKey}:`, yearData);

      // Process each term in the year
      Object.keys(yearData).forEach((termKey) => {
        const courses = yearData[termKey];
        if (!Array.isArray(courses)) return;

        console.log(`Processing ${termKey} with ${courses.length} courses`);

        // Map the term key to the schedule term
        let termObj;
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
            console.log("Unknown term:", termKey);
            return; // Skip unknown terms
        }

        // If there are courses, set status to CLASSES
        if (courses.length > 0) {
          termObj.status = StatusEnum.CLASSES;
          termObj.classes = []; // Clear any existing classes

          // Process each course
          courses.forEach((courseStr) => {
            // Parse course string format: "SUBJECT CLASSID"
            const courseParts = courseStr.match(/([A-Z]+)\s+(\d+[A-Z]*)/);
            if (!courseParts) {
              console.warn("Couldn't parse course:", courseStr);
              return;
            }

            const subject = courseParts[1];
            const classId = courseParts[2];

            console.log(`Adding course: ${subject} ${classId}`);

            // Create a course object
            const course: ScheduleCourse2<null> = {
              name: courseStr, // Use full course string as name for now
              subject,
              classId,
              numCreditsMin: 4, // Default credits
              numCreditsMax: 4, // Default credits
              id: null,
            };

            // Add course to the term
            termObj.classes.push(course);
          });
        }
      });
    });

    console.log("Final schedule:", schedule);
    return schedule as Schedule2<null>;
  } catch (error) {
    console.error("Error creating schedule from template:", error);
    return createEmptySchedule() as Schedule2<null>;
  }
}
