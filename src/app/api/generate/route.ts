import { NextRequest, NextResponse } from "next/server";
import { AiResponseValidationError } from "@/lib/ai/validation";
import { storage } from "@/lib/data/storage";
import { tailorResume } from "@/lib/ai/tailor";

type GenerateRequestBody = {
  jobDescription?: unknown;
};

function getJobDescription(body: GenerateRequestBody): string | null {
  if (typeof body.jobDescription !== "string") {
    return null;
  }

  const jobDescription = body.jobDescription.trim();

  return jobDescription.length > 0 ? jobDescription : null;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as GenerateRequestBody;
    const jobDescription = getJobDescription(body);

    if (!jobDescription) {
      return NextResponse.json(
        { error: "Job description is required" },
        { status: 400 }
      );
    }

    // TODO: In production, authenticate the user and get their specific profile
    const profiles = await storage.profile.getAll();

    if (profiles.length === 0) {
      return NextResponse.json(
        { error: "No profile found. Please create a profile first at /onboarding" },
        { status: 404 }
      );
    }

    const [profile] = profiles;

    const jobTitle = undefined;
    const company = undefined;

    const resume = await tailorResume(
      profile,
      jobDescription,
      jobTitle,
      company
    );

    await storage.resume.save(resume);

    return NextResponse.json({
      success: true,
      resumeId: resume.id,
      fitScore: resume.fitScore.overall,
    });
  } catch (error) {
    console.error("Error generating resume:", error);

    if (error instanceof Error) {
      if (error instanceof AiResponseValidationError) {
        return NextResponse.json(
          {
            error: "AI returned a resume that could not be safely validated.",
            issues: error.issues,
          },
          { status: 502 }
        );
      }

      if (error.message.includes("API key")) {
        return NextResponse.json(
          { error: "AI service configuration error. Please check API keys." },
          { status: 500 }
        );
      }

      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "Failed to generate resume" },
      { status: 500 }
    );
  }
}
