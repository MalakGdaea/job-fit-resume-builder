import {
  onboardingSteps,
} from "@/constants/onboarding";
import type { OnboardingStep } from "@/types/onboarding";

type ProgressIndicatorProps = {
  currentStep: OnboardingStep;
  onStepChange: (step: OnboardingStep) => void;
};

export function ProgressIndicator({
  currentStep,
  onStepChange,
}: ProgressIndicatorProps) {
  return (
    <div className="mb-8 flex gap-2">
      {onboardingSteps.map((step) => (
        <button
          key={step}
          onClick={() => onStepChange(step)}
          className={`flex-1 h-2 rounded-full transition-colors ${
            currentStep === step
              ? "bg-zinc-900 dark:bg-zinc-50"
              : "bg-zinc-200 dark:bg-zinc-800"
          }`}
          aria-label={`Go to ${step} step`}
        />
      ))}
    </div>
  );
}
