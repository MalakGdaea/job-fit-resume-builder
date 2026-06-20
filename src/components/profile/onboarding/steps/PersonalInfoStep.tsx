import {
  StepActions,
  StepSection,
  TextAreaField,
  TextField,
} from "@/components/profile/onboarding/controls";
import type { PersonalInfo } from "@/types/onboarding";

type PersonalInfoStepProps = {
  personalInfo: PersonalInfo;
  onUpdate: (updates: Partial<PersonalInfo>) => void;
  onNext: () => void;
};

export function PersonalInfoStep({
  personalInfo,
  onUpdate,
  onNext,
}: PersonalInfoStepProps) {
  return (
    <StepSection title="Personal Information">
      <TextField
        label="Full Name *"
        required
        value={personalInfo.fullName}
        onChange={(fullName) => onUpdate({ fullName })}
      />
      <TextField
        label="Email *"
        type="email"
        required
        value={personalInfo.email}
        onChange={(email) => onUpdate({ email })}
      />
      <div className="grid grid-cols-2 gap-4">
        <TextField
          label="Phone"
          type="tel"
          value={personalInfo.phone ?? ""}
          onChange={(phone) => onUpdate({ phone })}
        />
        <TextField
          label="Location"
          value={personalInfo.location ?? ""}
          onChange={(location) => onUpdate({ location })}
        />
      </div>
      <TextField
        label="LinkedIn"
        type="url"
        value={personalInfo.linkedin ?? ""}
        onChange={(linkedin) => onUpdate({ linkedin })}
        placeholder="https://linkedin.com/in/username"
      />
      <TextField
        label="GitHub"
        type="url"
        value={personalInfo.github ?? ""}
        onChange={(github) => onUpdate({ github })}
        placeholder="https://github.com/username"
      />
      <TextField
        label="Portfolio"
        type="url"
        value={personalInfo.portfolio ?? ""}
        onChange={(portfolio) => onUpdate({ portfolio })}
        placeholder="https://yoursite.com"
      />
      <TextAreaField
        label="Professional Summary"
        rows={4}
        value={personalInfo.summary ?? ""}
        onChange={(summary) => onUpdate({ summary })}
        placeholder="A brief overview of your professional background..."
      />
      <StepActions
        nextLabel="Next: Work Experience"
        onNext={onNext}
        nextDisabled={!personalInfo.fullName || !personalInfo.email}
      />
    </StepSection>
  );
}
