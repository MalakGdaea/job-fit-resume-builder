"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function BuilderPage() {
  const router = useRouter();
  const [jobDescription, setJobDescription] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!jobDescription.trim()) {
      setError("Please enter a job description");
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobDescription }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate resume");
      }

      const { resumeId } = await response.json();
      router.push(`/resume/${resumeId}`);
    } catch (err) {
      console.error("Error generating resume:", err);
      setError(err instanceof Error ? err.message : "Failed to generate resume");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
            Tailor Your Resume
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            Paste the job description below and we&apos;ll tailor your resume to match it using only your real experience.
          </p>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-800 p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Job Description *
              </label>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the full job description here...

Example:
We're looking for a Senior Frontend Engineer with 5+ years of experience in React, TypeScript, and modern web technologies. You'll lead the development of our user-facing applications..."
                rows={16}
                className="w-full px-4 py-3 border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-50 focus:border-transparent resize-y"
              />
              <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                {jobDescription.length} characters
              </p>
            </div>

            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
              </div>
            )}

            <button
              onClick={handleGenerate}
              disabled={isGenerating || !jobDescription.trim()}
              className="w-full bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 py-3 px-6 rounded-md font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isGenerating ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Generating Resume...
                </span>
              ) : (
                "Generate Tailored Resume"
              )}
            </button>

            <div className="mt-6 p-4 bg-zinc-100 dark:bg-zinc-800 rounded-md">
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 mb-2">
                How it works:
              </h3>
              <ul className="text-sm text-zinc-600 dark:text-zinc-400 space-y-1">
                <li>AI analyzes the job requirements and your profile</li>
                <li>Highlights your most relevant experience and skills</li>
                <li>Reorders achievements to emphasize job-relevant accomplishments</li>
                <li>Writes a tailored professional summary</li>
                <li><strong>Never fabricates or invents experience</strong></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => router.push("/onboarding")}
            className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 underline"
          >
            Need to update your profile?
          </button>
        </div>
      </div>
    </div>
  );
}
