import { Injectable } from "@nestjs/common";
import { ParsedCourse } from "@graduate/common";
import * as pdfjsLib from "pdfjs-dist";

@Injectable()
export class UtilsService {
  async parsePdfCourses(fileBuffer: Buffer): Promise<ParsedCourse[]> {
    try {
      // Extract text from PDF
      const text = await this.extractPDFText(fileBuffer);

      // Parse courses from text
      return this.parseCourses(text);
    } catch (error) {
      throw new Error(`Failed to parse PDF: ${error.message}`);
    }
  }

  private async extractPDFText(fileBuffer: Buffer): Promise<string> {
    const pdf = await pdfjsLib.getDocument({ data: fileBuffer }).promise;
    let fullText = "";

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map((item: any) => item.str).join(" ");
      fullText += pageText + "\n";
    }

    return fullText;
  }

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
