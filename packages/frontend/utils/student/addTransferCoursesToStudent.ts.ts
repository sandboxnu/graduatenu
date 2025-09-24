import { API } from "@graduate/api-client";
import { ScheduleCourse2, StudentModel } from "@graduate/common";
import { cleanDndIdsFromStudent } from "../";

interface UploadedCourse {
  subject: string;
  classId: string;
}

/**
 * Adds uploaded courses as transfer courses to a student
 *
 * @param   student         The current student object
 * @param   uploadedCourses Array of courses parsed from PDF
 * @param   courseLookup    Course details from API
 * @param   isGuest         Whether the user is in guest mode
 * @returns                 Promise that resolves when transfer courses are saved
 */
export async function addTransferCoursesToStudent(
  student: StudentModel<string>,
  uploadedCourses: UploadedCourse[],
  courseLookup: Record<string, ScheduleCourse2<null>>,
  isGuest: boolean
): Promise<void> {
  try {
    // Convert uploaded courses to transfer course format
    const newTransferCourses: ScheduleCourse2<null>[] = uploadedCourses.map(
      ({ subject, classId }) => {
        const courseKey = `${subject} ${classId}`;
        const courseDetails = courseLookup[courseKey];

        console.log(
          `Adding transfer course ${courseKey}: Found in lookup: ${!!courseDetails}`
        );

        return {
          name: courseDetails?.name || `${subject} ${classId}`,
          subject,
          classId,
          numCreditsMin: courseDetails?.numCreditsMin || 4,
          numCreditsMax: courseDetails?.numCreditsMax || 4,
          prereqs: courseDetails?.prereqs,
          coreqs: courseDetails?.coreqs,
          nupaths: courseDetails?.nupaths,
          id: null,
        };
      }
    );

    // Update student's transfer courses (avoid duplicates)
    const existingTransferCourses = student.coursesTransfered || [];
    const combinedTransferCourses = [...existingTransferCourses];

    // Only add courses that don't already exist
    newTransferCourses.forEach((newCourse) => {
      const isDuplicate = existingTransferCourses.some(
        (existing) =>
          existing.subject === newCourse.subject &&
          existing.classId === newCourse.classId
      );

      if (!isDuplicate) {
        combinedTransferCourses.push(newCourse);
      }
    });

    // Update student object
    const updatedStudent: StudentModel<string> = {
      ...student,
      coursesTransfered: combinedTransferCourses,
    };

    // Save the updated student
    const studentWithoutDndIds = cleanDndIdsFromStudent(updatedStudent);

    if (isGuest) {
      window.localStorage.setItem(
        "student",
        JSON.stringify(studentWithoutDndIds)
      );
    } else {
      await API.student.update(studentWithoutDndIds);
    }

    console.log(
      `Successfully added ${newTransferCourses.length} transfer courses to student`
    );
  } catch (error) {
    console.error("Error adding transfer courses to student:", error);
    throw error;
  }
}
