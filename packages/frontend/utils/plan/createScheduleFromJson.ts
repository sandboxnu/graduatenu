import { Schedule2, ScheduleCourse2, StatusEnum } from "@graduate/common";
import { createEmptySchedule } from "./createEmptySchedule";

/**
 * Creates a schedule from a template
 *
 * @param   template     The template to create a schedule from
 * @param   courseLookup Optional lookup object with course details from the API
 * @returns              A new schedule populated with courses from the template
 */
export function createScheduleFromJson(data: any): Schedule2<null> {
  // Start with an empty schedule
  const schedule = createEmptySchedule();

  try {
    console.log("Creating schedule from JSON:", data);

    // Check if we have the json data
    if (!data) {
      console.error("Missing JSON data");
      return schedule;
    }

    // Get the plan data from the json
    const planData = data["schedule"]["years"];
    if (!planData) {
      console.error("No plan data found in JSON");
      return schedule;
    }

    console.log("Processing plan data:", planData);

    // Process each year in the template
    Object.keys(planData).forEach((yearKey) => {
      const yearNum = planData[yearKey]["year"];
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
        const courses = yearData[termKey]["classes"];
        if (!Array.isArray(courses)) return;

        console.log(`Processing ${termKey} with ${courses.length} courses`);

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
          case "summer1":
            termObj = yearObj.summer1;
            break;
          case "summer2":
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
            console.log(courseStr);
            const subject = courseStr["subject"];
            const classId = courseStr["classId"];

            // Create a course object
            const course: ScheduleCourse2<null> = {
              name: courseStr["name"],
              subject,
              classId,
              numCreditsMin: courseStr["numCreditsMin"],
              numCreditsMax: courseStr["numCreditsMax"],
              prereqs: courseStr["prereqs"],
              coreqs: courseStr["coreqs"],
              nupaths: courseStr["nupaths"],
              id: courseStr["id"],
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
