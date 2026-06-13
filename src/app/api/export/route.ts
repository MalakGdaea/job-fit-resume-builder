/**
 * Resume export API route
 * Exports resumes to PDF or DOCX format
 */

import { NextRequest, NextResponse } from "next/server";
import { storage } from "@/lib/storage";
import { generatePDF, generateDOCX } from "@/lib/export";

export async function POST(request: NextRequest) {
  try {
    const { resumeId, format } = await request.json();

    // Validate input
    if (!resumeId) {
      return NextResponse.json(
        { error: "Resume ID is required" },
        { status: 400 }
      );
    }

    if (!format || !["pdf", "docx"].includes(format)) {
      return NextResponse.json(
        { error: "Format must be 'pdf' or 'docx'" },
        { status: 400 }
      );
    }

    // Get the resume
    const resume = await storage.resume.get(resumeId);

    if (!resume) {
      return NextResponse.json(
        { error: "Resume not found" },
        { status: 404 }
      );
    }

    // Generate the file
    let buffer: Buffer;
    let contentType: string;
    let filename: string;

    if (format === "pdf") {
      buffer = await generatePDF(resume);
      contentType = "application/pdf";
      filename = `resume-${resumeId}.pdf`;
    } else {
      buffer = await generateDOCX(resume);
      contentType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
      filename = `resume-${resumeId}.docx`;
    }

    // Return the file
    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": buffer.length.toString(),
      },
    });
  } catch (error) {
    console.error("Error exporting resume:", error);
    return NextResponse.json(
      { error: "Failed to export resume" },
      { status: 500 }
    );
  }
}
