"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CertificationsStep } from "@/components/profile/onboarding/CertificationsStep";
import { EducationStep } from "@/components/profile/onboarding/EducationStep";
import { PersonalInfoStep } from "@/components/profile/onboarding/PersonalInfoStep";
import { ProgressIndicator } from "@/components/profile/onboarding/ProgressIndicator";
import { ProjectsStep } from "@/components/profile/onboarding/ProjectsStep";
import { SkillsStep } from "@/components/profile/onboarding/SkillsStep";
import { WorkExperienceStep } from "@/components/profile/onboarding/WorkExperienceStep";
import {
  type OnboardingStep,
} from "@/components/profile/onboarding/types";
import { useOnboardingProfileForm } from "@/components/profile/onboarding/useOnboardingProfileForm";

export default function OnboardingPage() {
  const router = useRouter();
  const profileForm = useOnboardingProfileForm();
  const [step, setStep] = useState<OnboardingStep>("personal");
  const [isSaving, setIsSaving] = useState(false);

  const saveProfile = async () => {
    setIsSaving(true);

    try {
      const response = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileForm.createProfile()),
      });

      if (!response.ok) {
        throw new Error("Failed to save profile");
      }

      router.push("/builder");
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Failed to save profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
            Build Your Master Profile
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            Enter your real work history, skills, and achievements. This is your
            source of truth.
          </p>
        </div>

        <ProgressIndicator currentStep={step} onStepChange={setStep} />

        <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-800 p-6">
          {step === "personal" && (
            <PersonalInfoStep
              personalInfo={profileForm.personalInfo}
              onUpdate={profileForm.updatePersonalInfo}
              onNext={() => setStep("experience")}
            />
          )}
          {step === "experience" && (
            <WorkExperienceStep
              workExperience={profileForm.workExperience}
              onAdd={profileForm.addWorkExperience}
              onUpdate={profileForm.updateWorkExperience}
              onRemove={profileForm.removeWorkExperience}
              onBack={() => setStep("personal")}
              onNext={() => setStep("education")}
            />
          )}
          {step === "education" && (
            <EducationStep
              education={profileForm.education}
              onAdd={profileForm.addEducation}
              onUpdate={profileForm.updateEducation}
              onRemove={profileForm.removeEducation}
              onBack={() => setStep("experience")}
              onNext={() => setStep("skills")}
            />
          )}
          {step === "skills" && (
            <SkillsStep
              skills={profileForm.skills}
              onUpdate={profileForm.updateSkills}
              onBack={() => setStep("education")}
              onNext={() => setStep("projects")}
            />
          )}
          {step === "projects" && (
            <ProjectsStep
              projects={profileForm.projects}
              onAdd={profileForm.addProject}
              onUpdate={profileForm.updateProject}
              onRemove={profileForm.removeProject}
              onBack={() => setStep("skills")}
              onNext={() => setStep("certifications")}
            />
          )}
          {step === "certifications" && (
            <CertificationsStep
              certifications={profileForm.certifications}
              isSaving={isSaving}
              onAdd={profileForm.addCertification}
              onUpdate={profileForm.updateCertification}
              onRemove={profileForm.removeCertification}
              onBack={() => setStep("projects")}
              onSave={saveProfile}
            />
          )}
        </div>
      </div>
    </div>
  );
}
