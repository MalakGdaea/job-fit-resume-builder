import { NextRequest, NextResponse } from "next/server";
import { storage } from "@/lib/data/storage";
import type { Profile } from "@/types/profile";

function hasRequiredProfileFields(profile: Profile): boolean {
  return Boolean(
    profile.id && profile.personalInfo?.fullName && profile.personalInfo?.email
  );
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (id) {
      const profile = await storage.profile.get(id);
      if (!profile) {
        return NextResponse.json(
          { error: "Profile not found" },
          { status: 404 }
        );
      }
      return NextResponse.json({ profile });
    }

    const profiles = await storage.profile.getAll();
    return NextResponse.json({ profiles });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const profile: Profile = await request.json();

    if (!hasRequiredProfileFields(profile)) {
      return NextResponse.json(
        { error: "Missing required fields: id, fullName, email" },
        { status: 400 }
      );
    }

    const savedProfile: Profile = {
      ...profile,
      updatedAt: new Date().toISOString(),
    };

    await storage.profile.save(savedProfile);

    return NextResponse.json({ success: true, profileId: savedProfile.id });
  } catch (error) {
    console.error("Error saving profile:", error);
    return NextResponse.json(
      { error: "Failed to save profile" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const profile: Profile = await request.json();

    if (!profile.id) {
      return NextResponse.json(
        { error: "Profile ID is required" },
        { status: 400 }
      );
    }

    const existing = await storage.profile.get(profile.id);
    if (!existing) {
      return NextResponse.json(
        { error: "Profile not found" },
        { status: 404 }
      );
    }

    const savedProfile: Profile = {
      ...profile,
      createdAt: existing.createdAt,
      updatedAt: new Date().toISOString(),
    };

    await storage.profile.save(savedProfile);

    return NextResponse.json({ success: true, profileId: savedProfile.id });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Profile ID is required" },
        { status: 400 }
      );
    }

    const deleted = await storage.profile.delete(id);

    if (!deleted) {
      return NextResponse.json(
        { error: "Profile not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting profile:", error);
    return NextResponse.json(
      { error: "Failed to delete profile" },
      { status: 500 }
    );
  }
}
