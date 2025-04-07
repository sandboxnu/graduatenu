import { Schedule2, Template } from "@graduate/common";

export function convertScheduleToTemplate(scheduleObj: {
  name: string;
  schedule: Schedule2<null>;
}): Template {
  const templateName = scheduleObj.name || "Imported Plan";
  const templateData: NonNullable<Template["templateData"]> = {
    [templateName]: {},
  };

  scheduleObj.schedule.years.forEach((year, index) => {
    const yearKey = `Year ${index + 1}`;
    const terms = ["fall", "spring", "summer1", "summer2"] as const;

    const yearData: Record<string, string[]> = {};

    terms.forEach((term) => {
      const termObj = year[term];
      if (termObj.status !== "CLASSES") return;

      const courseStrings = termObj.classes.map((course) =>
        `${course.subject} ${course.classId}`.trim()
      );

      if (courseStrings.length > 0) {
        const formattedTerm =
          term === "summer1"
            ? "Summer 1"
            : term === "summer2"
            ? "Summer 2"
            : term.charAt(0).toUpperCase() + term.slice(1);

        yearData[formattedTerm] = courseStrings;
      }
    });

    if (Object.keys(yearData).length > 0) {
      templateData[templateName][yearKey] = yearData;
    }
  });

  return {
    name: templateName,
    yearVersion: 2024, // <-- required numeric version field
    templateData,
  };
}
