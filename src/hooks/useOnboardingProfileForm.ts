"use client";

import { useState } from "react";
import type {
  Certification,
  Education,
  Profile,
  Project,
  WorkExperience,
} from "@/types/profile";
import type { PersonalInfo, SkillGroups } from "@/types/onboarding";
import {
  createEmptyCertification,
  createEmptyEducation,
  createEmptyProject,
  createEmptyWorkExperience,
} from "@/lib/profile/onboardingForm";

const initialPersonalInfo: PersonalInfo = {
  fullName: "",
  email: "",
  phone: "",
  location: "",
  linkedin: "",
  github: "",
  portfolio: "",
  summary: "",
};

const initialSkills: SkillGroups = {
  technical: [],
  soft: [],
  languages: [],
};

function updateCollectionItem<T extends { id: string }>(
  collection: T[],
  id: string,
  updates: Partial<T>
): T[] {
  return collection.map((item) =>
    item.id === id ? { ...item, ...updates } : item
  );
}

function removeCollectionItem<T extends { id: string }>(
  collection: T[],
  id: string
): T[] {
  return collection.filter((item) => item.id !== id);
}

export function useOnboardingProfileForm() {
  const [personalInfo, setPersonalInfo] =
    useState<PersonalInfo>(initialPersonalInfo);
  const [workExperience, setWorkExperience] = useState<WorkExperience[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [skills, setSkills] = useState<SkillGroups>(initialSkills);
  const [projects, setProjects] = useState<Project[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);

  const updatePersonalInfo = (updates: Partial<PersonalInfo>) => {
    setPersonalInfo((current) => ({ ...current, ...updates }));
  };

  const updateSkills = (updates: Partial<SkillGroups>) => {
    setSkills((current) => ({ ...current, ...updates }));
  };

  const createProfile = (): Profile => {
    const now = new Date().toISOString();

    return {
      id: crypto.randomUUID(),
      personalInfo,
      workExperience,
      education,
      skills,
      projects,
      certifications,
      createdAt: now,
      updatedAt: now,
    };
  };

  return {
    personalInfo,
    updatePersonalInfo,
    workExperience,
    addWorkExperience: () =>
      setWorkExperience((current) => [...current, createEmptyWorkExperience()]),
    updateWorkExperience: (id: string, updates: Partial<WorkExperience>) =>
      setWorkExperience((current) =>
        updateCollectionItem(current, id, updates)
      ),
    removeWorkExperience: (id: string) =>
      setWorkExperience((current) => removeCollectionItem(current, id)),
    education,
    addEducation: () =>
      setEducation((current) => [...current, createEmptyEducation()]),
    updateEducation: (id: string, updates: Partial<Education>) =>
      setEducation((current) => updateCollectionItem(current, id, updates)),
    removeEducation: (id: string) =>
      setEducation((current) => removeCollectionItem(current, id)),
    skills,
    updateSkills,
    projects,
    addProject: () => setProjects((current) => [...current, createEmptyProject()]),
    updateProject: (id: string, updates: Partial<Project>) =>
      setProjects((current) => updateCollectionItem(current, id, updates)),
    removeProject: (id: string) =>
      setProjects((current) => removeCollectionItem(current, id)),
    certifications,
    addCertification: () =>
      setCertifications((current) => [...current, createEmptyCertification()]),
    updateCertification: (id: string, updates: Partial<Certification>) =>
      setCertifications((current) => updateCollectionItem(current, id, updates)),
    removeCertification: (id: string) =>
      setCertifications((current) => removeCollectionItem(current, id)),
    createProfile,
  };
}
