import { NextRequest, NextResponse } from "next/server";
import { AiResponseValidationError } from "@/lib/ai/validation";
import { storage } from "@/lib/data/storage";
import { tailorResume } from "@/lib/ai/tailor";

type GenerateRequestBody = {
  company?: unknown;
  jobDescription?: unknown;
  jobTitle?: unknown;
  profileId?: unknown;
};

function getRequiredString(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const trimmedValue = value.trim();

  return trimmedValue.length > 0 ? trimmedValue : null;
}

function getOptionalString(value: unknown): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }

  const trimmedValue = value.trim();

  return trimmedValue.length > 0 ? trimmedValue : undefined;
}

function getJobDescription(body: GenerateRequestBody): string | null {
  return getRequiredString(body.jobDescription);
}

function getJobTitle(body: GenerateRequestBody): string | null {
  return getRequiredString(body.jobTitle);
}

function getCompany(body: GenerateRequestBody): string | undefined {
  return getOptionalString(body.company);
}

function getProfileId(body: GenerateRequestBody): string | null {
  const profileId = getRequiredString(body.profileId);

  if (!profileId) {
    return null;
  }

  return profileId;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as GenerateRequestBody;
    const jobDescription = getJobDescription(body);
    const jobTitle = getJobTitle(body);
    const company = getCompany(body);
    const profileId = getProfileId(body);

    if (!jobDescription) {
      return NextResponse.json(
        { error: "Job description is required" },
        { status: 400 }
      );
    }

    if (!jobTitle) {
      return NextResponse.json(
        { error: "Job title is required" },
        { status: 400 }
      );
    }

    if (!profileId) {
      return NextResponse.json(
        { error: "Profile ID is required. Please choose a saved profile." },
        { status: 400 }
      );
    }

    const profile = await storage.profile.get(profileId);

    if (!profile) {
      return NextResponse.json(
        { error: "Profile not found. Please create or choose a saved profile." },
        { status: 404 }
      );
    }

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
