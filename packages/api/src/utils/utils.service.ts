import { Injectable } from "@nestjs/common";
import { ParsedCourse } from "@graduate/common";
import * as pdf from "pdf-parse";

@Injectable()
export class UtilsService {
  // Reads the pdf and returns it as a string to be parsed for courses
  async parsePdfCourses(fileBuffer: Buffer): Promise<ParsedCourse[]> {
    try {
      const data = await pdf(fileBuffer);

      return this.parseCourses(data.text);
    } catch (error) {
      console.error("PDF parsing error:", error);
      throw new Error(`Failed to parse PDF: ${error.message}`);
    }
  }

  // Parses through the text and extracts unique course subjects and class IDs
  private parseCourses(pdfText: string): ParsedCourse[] {
    const courseRegex = /([A-Z]{2,4})\s*(\d{4}[A-Z]*)/g;
    const courses: ParsedCourse[] = [];
    const seenCourses = new Set<string>();

    let match;
    while ((match = courseRegex.exec(pdfText)) !== null) {
      const subject = match[1];
      const classId = match[2];
      const courseKey = `${subject}${classId}`;

      if (!seenCourses.has(courseKey)) {
        seenCourses.add(courseKey);
        courses.push({ subject, classId });
      }
    }

    return courses;
  }
}
