import { Schedule2, ScheduleTerm2 } from "@graduate/common";

export const getCoReqWarnings = (term: ScheduleTerm2<null>) => {
  const warnings = [];
  const seen = new Set();
  for (const course of term.classes) {
    seen.add(course.subject + course.classId);
  }

  for (const course of term.classes) {
    // Course has coreqs
    if (course.coreqs) {
      for (coreq : course.coreqs) {
        
      }
    }
  }



  return warnings;
}