// src/utils/pdfParser.ts

export interface ParsedCourse {
  subject: string;
  classId: string;
}

/**
 * Temporary mock function to test the workflow This simulates extracting text
 * from your actual PDF
 */
export async function extractPDFText(file: File): Promise<string> {
  console.log("Mock: Extracting text from PDF:", file.name);

  // Return mock text that looks like your degree audit
  const mockText = `
    CS 1990 (4.0 Hours) Elective
    ECON1115 (4.0 Hours) Principles of Macroeconomics
    ECON1116 (4.0 Hours) Principles of Microeconomics
    ENGW1111 (4.0 Hours) First-Year Writing
    MATH1341 (4.0 Hours) Calculus BC ++
    MATH1342 (4.0 Hours) Calculus BC ++
    PHYS1145 (4.0 Hours) Physics for Life Sciences 1
    CS 1800 (4.0 Hours) Discrete Structures
    CS 2500 (4.0 Hours) Fundamentals of Computer Sci
    CS 2510 (4.0 Hours) Fundamentals of Computer Sci 2
    CS 3500 (4.0 Hours) Object-Oriented Design
  `;

  console.log("Mock: Processing PDF pages...");
  return mockText;
}

/**
 * Parses course codes from UAchieve PDF text Looks for patterns like "CS 1990"
 * or "ECON1115" followed by any text
 */
export function parsePdfCourses(pdfText: string): ParsedCourse[] {
  // Simplified regex to match course patterns:
  // - Subject: 2-4 capital letters
  // - Optional space
  // - Course number: 4 digits optionally followed by letters
  const courseRegex = /([A-Z]{2,4})\s*(\d{4}[A-Z]*)/g;

  const courses: ParsedCourse[] = [];
  const seenCourses = new Set<string>();

  let match;
  while ((match = courseRegex.exec(pdfText)) !== null) {
    const subject = match[1];
    const classId = match[2];
    const courseKey = `${subject}${classId}`;

    // Debug: log each course found
    console.log(`Found course: ${subject} ${classId}`);

    // Avoid duplicates
    if (!seenCourses.has(courseKey)) {
      seenCourses.add(courseKey);
      courses.push({ subject, classId });
    }
  }

  console.log(`Total unique courses parsed: ${courses.length}`);
  return courses;
}

/**
 * Debug function to log what text was extracted from PDF Useful for
 * troubleshooting parsing issues
 */
export function debugPdfText(pdfText: string): void {
  console.log("=== PDF Text Debug ===");
  console.log("Full text length:", pdfText.length);
  console.log("First 500 characters:");
  console.log(pdfText.substring(0, 500));
  console.log("=== End Debug ===");
}
