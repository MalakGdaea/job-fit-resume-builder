/**
 * Profile API route
 * Handles saving and loading user profiles
 */

import { NextRequest, NextResponse } from "next/server";
import { storage } from "@/lib/data/storage";
import type { Profile } from "@/types/profile";

// GET /api/profile - Get all profiles or specific profile by ID
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

    // Return all profiles (for development/testing)
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

// POST /api/profile - Save a new profile
export async function POST(request: NextRequest) {
  try {
    const profile: Profile = await request.json();

    // Basic validation
    if (!profile.id || !profile.personalInfo?.fullName || !profile.personalInfo?.email) {
      return NextResponse.json(
        { error: "Missing required fields: id, fullName, email" },
        { status: 400 }
      );
    }

    // Update timestamps
    profile.updatedAt = new Date().toISOString();

    await storage.profile.save(profile);

    return NextResponse.json({ success: true, profileId: profile.id });
  } catch (error) {
    console.error("Error saving profile:", error);
    return NextResponse.json(
      { error: "Failed to save profile" },
      { status: 500 }
    );
  }
}

// PUT /api/profile - Update existing profile
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

    // Update timestamps
    profile.updatedAt = new Date().toISOString();
    profile.createdAt = existing.createdAt; // Preserve original creation date

    await storage.profile.save(profile);

    return NextResponse.json({ success: true, profileId: profile.id });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}

// DELETE /api/profile - Delete a profile
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
