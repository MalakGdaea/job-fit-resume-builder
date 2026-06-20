import { NextRequest, NextResponse } from "next/server";
import { storage } from "@/lib/data/storage";
import { generatePDF, generateDOCX } from "@/lib/resume/export";

const exportFormats = ["pdf", "docx"] as const;

type ExportFormat = (typeof exportFormats)[number];

type ExportRequestBody = {
  resumeId?: unknown;
  format?: unknown;
};

type GeneratedExport = {
  buffer: Buffer;
  contentType: string;
  filename: string;
};

function isExportFormat(format: unknown): format is ExportFormat {
  return exportFormats.includes(format as ExportFormat);
}

async function generateResumeExport(
  resumeId: string,
  format: ExportFormat
): Promise<GeneratedExport | null> {
  const resume = await storage.resume.get(resumeId);

  if (!resume) {
    return null;
  }

  if (format === "pdf") {
    return {
      buffer: await generatePDF(resume),
      contentType: "application/pdf",
      filename: `resume-${resumeId}.pdf`,
    };
  }

  return {
    buffer: await generateDOCX(resume),
    contentType:
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    filename: `resume-${resumeId}.docx`,
  };
}

export async function POST(request: NextRequest) {
  try {
    const { resumeId, format } = (await request.json()) as ExportRequestBody;

    if (typeof resumeId !== "string" || resumeId.trim().length === 0) {
      return NextResponse.json(
        { error: "Resume ID is required" },
        { status: 400 }
      );
    }

    if (!isExportFormat(format)) {
      return NextResponse.json(
        { error: "Format must be 'pdf' or 'docx'" },
        { status: 400 }
      );
    }

    const generatedExport = await generateResumeExport(resumeId, format);

    if (!generatedExport) {
      return NextResponse.json(
        { error: "Resume not found" },
        { status: 404 }
      );
    }

    const { buffer, contentType, filename } = generatedExport;

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
