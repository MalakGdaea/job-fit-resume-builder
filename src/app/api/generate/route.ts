/**
 * Resume generation API route
 * Calls AI to tailor a resume based on job description
 */

import { NextRequest, NextResponse } from "next/server";
import { AiResponseValidationError } from "@/lib/ai/validation";
import { storage } from "@/lib/data/storage";
import { tailorResume } from "@/lib/ai/tailor";

export async function POST(request: NextRequest) {
  try {
    const { jobDescription } = await request.json();

    // Validate input
    if (!jobDescription || typeof jobDescription !== "string") {
      return NextResponse.json(
        { error: "Job description is required" },
        { status: 400 }
      );
    }

    // Get the user's profile (for now, get the most recent one)
    // TODO: In production, authenticate the user and get their specific profile
    const profiles = await storage.profile.getAll();

    if (profiles.length === 0) {
      return NextResponse.json(
        { error: "No profile found. Please create a profile first at /onboarding" },
        { status: 404 }
      );
    }

    // Use the most recently updated profile
    const profile = profiles.sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    )[0];

    // Optional: Extract job title and company from job description
    // For now, we'll let the AI handle this
    const jobTitle = undefined;
    const company = undefined;

    // Call AI to tailor the resume
    const resume = await tailorResume(
      profile,
      jobDescription,
      jobTitle,
      company
    );

    // Save the generated resume
    await storage.resume.save(resume);

    return NextResponse.json({
      success: true,
      resumeId: resume.id,
      fitScore: resume.fitScore.overall,
    });
  } catch (error) {
    console.error("Error generating resume:", error);

    // Handle specific error types
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
