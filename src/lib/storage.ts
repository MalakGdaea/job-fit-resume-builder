/**
 * Storage layer for profiles and resumes.
 * Backed by PostgreSQL through Prisma.
 */

import { Prisma, type ProfileRecord, type ResumeRecord } from "@prisma/client";
import { getPrisma } from "@/lib/db";
import type { Profile } from "@/types/profile";
import type { Resume } from "@/types/resume";

function cleanJson<T>(value: T): Prisma.InputJsonValue {
  return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue;
}

function parseDate(value: string): Date {
  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return new Date();
  }

  return parsed;
}

function toProfile(record: ProfileRecord): Profile {
  return {
    id: record.id,
    personalInfo: record.personalInfo as unknown as Profile["personalInfo"],
    workExperience: record.workExperience as unknown as Profile["workExperience"],
    education: record.education as unknown as Profile["education"],
    skills: record.skills as unknown as Profile["skills"],
    projects: record.projects as unknown as Profile["projects"],
    certifications: record.certifications as unknown as Profile["certifications"],
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
  };
}

function toResume(record: ResumeRecord): Resume {
  return {
    id: record.id,
    profileId: record.profileId,
    jobTitle: record.jobTitle,
    company: record.company ?? undefined,
    personalInfo: record.personalInfo as unknown as Resume["personalInfo"],
    summary: record.summary,
    workExperience: record.workExperience as unknown as Resume["workExperience"],
    education: record.education as unknown as Resume["education"],
    skills: record.skills as unknown as Resume["skills"],
    projects: record.projects as unknown as Resume["projects"],
    certifications: record.certifications as unknown as Resume["certifications"],
    fitScore: record.fitScore as unknown as Resume["fitScore"],
    createdAt: record.createdAt.toISOString(),
    jobDescription: record.jobDescription ?? undefined,
  };
}

export const storage = {
  profile: {
    save: async (profile: Profile): Promise<void> => {
      const prisma = getPrisma();

      await prisma.profileRecord.upsert({
        where: { id: profile.id },
        create: {
          id: profile.id,
          personalInfo: cleanJson(profile.personalInfo),
          workExperience: cleanJson(profile.workExperience),
          education: cleanJson(profile.education),
          skills: cleanJson(profile.skills),
          projects: cleanJson(profile.projects),
          certifications: cleanJson(profile.certifications),
          createdAt: parseDate(profile.createdAt),
          updatedAt: parseDate(profile.updatedAt),
        },
        update: {
          personalInfo: cleanJson(profile.personalInfo),
          workExperience: cleanJson(profile.workExperience),
          education: cleanJson(profile.education),
          skills: cleanJson(profile.skills),
          projects: cleanJson(profile.projects),
          certifications: cleanJson(profile.certifications),
          updatedAt: parseDate(profile.updatedAt),
        },
      });
    },

    get: async (id: string): Promise<Profile | null> => {
      const prisma = getPrisma();

      const profile = await prisma.profileRecord.findUnique({
        where: { id },
      });

      return profile ? toProfile(profile) : null;
    },

    getAll: async (): Promise<Profile[]> => {
      const prisma = getPrisma();

      const profiles = await prisma.profileRecord.findMany({
        orderBy: { updatedAt: "desc" },
      });

      return profiles.map(toProfile);
    },

    delete: async (id: string): Promise<boolean> => {
      const prisma = getPrisma();

      try {
        await prisma.profileRecord.delete({
          where: { id },
        });
        return true;
      } catch {
        return false;
      }
    },
  },

  resume: {
    save: async (resume: Resume): Promise<void> => {
      const prisma = getPrisma();

      await prisma.resumeRecord.upsert({
        where: { id: resume.id },
        create: {
          id: resume.id,
          profileId: resume.profileId,
          jobTitle: resume.jobTitle,
          company: resume.company ?? null,
          personalInfo: cleanJson(resume.personalInfo),
          summary: resume.summary,
          workExperience: cleanJson(resume.workExperience),
          education: cleanJson(resume.education),
          skills: cleanJson(resume.skills),
          projects: cleanJson(resume.projects),
          certifications: cleanJson(resume.certifications),
          fitScore: cleanJson(resume.fitScore),
          createdAt: parseDate(resume.createdAt),
          jobDescription: resume.jobDescription ?? null,
        },
        update: {
          jobTitle: resume.jobTitle,
          company: resume.company ?? null,
          personalInfo: cleanJson(resume.personalInfo),
          summary: resume.summary,
          workExperience: cleanJson(resume.workExperience),
          education: cleanJson(resume.education),
          skills: cleanJson(resume.skills),
          projects: cleanJson(resume.projects),
          certifications: cleanJson(resume.certifications),
          fitScore: cleanJson(resume.fitScore),
          jobDescription: resume.jobDescription ?? null,
        },
      });
    },

    get: async (id: string): Promise<Resume | null> => {
      const prisma = getPrisma();

      const resume = await prisma.resumeRecord.findUnique({
        where: { id },
      });

      return resume ? toResume(resume) : null;
    },

    getByProfileId: async (profileId: string): Promise<Resume[]> => {
      const prisma = getPrisma();

      const resumes = await prisma.resumeRecord.findMany({
        where: { profileId },
        orderBy: { createdAt: "desc" },
      });

      return resumes.map(toResume);
    },

    delete: async (id: string): Promise<boolean> => {
      const prisma = getPrisma();

      try {
        await prisma.resumeRecord.delete({
          where: { id },
        });
        return true;
      } catch {
        return false;
      }
    },
  },
};
