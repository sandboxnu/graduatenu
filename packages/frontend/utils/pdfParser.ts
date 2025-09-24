import * as pdfjsLib from "pdfjs-dist";

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export interface ParsedCourse {
  subject: string;
  classId: string;
}

/** Extracts text content from a PDF file */
export async function extractPDFText(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

  let fullText = "";

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items.map((item: any) => item.str).join(" ");
    fullText += pageText + "\n";
  }

  return fullText;
}

/** Parses course codes from UAchieve PDF text */
export function parsePdfCourses(pdfText: string): ParsedCourse[] {
  // Regex to match course patterns:
  const courseRegex = /([A-Z]{2,4})\s*(\d{4}[A-Z]*)/g;

  const courses: ParsedCourse[] = [];
  const seenCourses = new Set<string>();

  let match;
  while ((match = courseRegex.exec(pdfText)) !== null) {
    const subject = match[1];
    const classId = match[2];
    const courseKey = `${subject}${classId}`;

    // Avoid duplicates
    if (!seenCourses.has(courseKey)) {
      seenCourses.add(courseKey);
      courses.push({ subject, classId });
    }
  }

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
