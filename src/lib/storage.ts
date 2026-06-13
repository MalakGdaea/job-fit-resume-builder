/**
 * Storage layer for profiles and resumes.
 * Local JSON-file storage is enough for a local MVP.
 * TODO: Replace with a production database before deploying for real users.
 */

import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import type { Profile } from "@/types/profile";
import type { Resume } from "@/types/resume";

interface StorageData {
  profiles: Profile[];
  resumes: Resume[];
}

type FileSystemError = Error & {
  code?: string;
};

const storageDir = path.join(process.cwd(), ".data");
const storageFile = path.join(storageDir, "storage.json");

const emptyData = (): StorageData => ({
  profiles: [],
  resumes: [],
});

async function loadData(): Promise<StorageData> {
  try {
    const rawData = await readFile(storageFile, "utf-8");
    const parsed = JSON.parse(rawData) as Partial<StorageData>;

    return {
      profiles: parsed.profiles ?? [],
      resumes: parsed.resumes ?? [],
    };
  } catch (error) {
    if ((error as FileSystemError).code === "ENOENT") {
      return emptyData();
    }

    throw error;
  }
}

async function saveData(data: StorageData): Promise<void> {
  await mkdir(storageDir, { recursive: true });
  await writeFile(storageFile, JSON.stringify(data, null, 2), "utf-8");
}

export const storage = {
  profile: {
    save: async (profile: Profile): Promise<void> => {
      const data = await loadData();
      const existingIndex = data.profiles.findIndex((item) => item.id === profile.id);

      if (existingIndex >= 0) {
        data.profiles[existingIndex] = profile;
      } else {
        data.profiles.push(profile);
      }

      await saveData(data);
    },

    get: async (id: string): Promise<Profile | null> => {
      const data = await loadData();
      return data.profiles.find((profile) => profile.id === id) ?? null;
    },

    getAll: async (): Promise<Profile[]> => {
      const data = await loadData();
      return data.profiles;
    },

    delete: async (id: string): Promise<boolean> => {
      const data = await loadData();
      const initialCount = data.profiles.length;
      data.profiles = data.profiles.filter((profile) => profile.id !== id);

      if (data.profiles.length === initialCount) {
        return false;
      }

      await saveData(data);
      return true;
    },
  },

  resume: {
    save: async (resume: Resume): Promise<void> => {
      const data = await loadData();
      const existingIndex = data.resumes.findIndex((item) => item.id === resume.id);

      if (existingIndex >= 0) {
        data.resumes[existingIndex] = resume;
      } else {
        data.resumes.push(resume);
      }

      await saveData(data);
    },

    get: async (id: string): Promise<Resume | null> => {
      const data = await loadData();
      return data.resumes.find((resume) => resume.id === id) ?? null;
    },

    getByProfileId: async (profileId: string): Promise<Resume[]> => {
      const data = await loadData();
      return data.resumes.filter((resume) => resume.profileId === profileId);
    },

    delete: async (id: string): Promise<boolean> => {
      const data = await loadData();
      const initialCount = data.resumes.length;
      data.resumes = data.resumes.filter((resume) => resume.id !== id);

      if (data.resumes.length === initialCount) {
        return false;
      }

      await saveData(data);
      return true;
    },
  },
};
