import { useState } from "react";
import {
  StepActions,
  StepSection,
  TagList,
  TextField,
} from "@/components/profile/onboarding/FormControls";
import type { SkillGroups } from "@/components/profile/onboarding/types";
import { parseCommaList } from "@/components/profile/onboarding/utils";

type SkillsStepProps = {
  skills: SkillGroups;
  onUpdate: (updates: Partial<SkillGroups>) => void;
  onBack: () => void;
  onNext: () => void;
};

type SkillInputProps = {
  label: string;
  placeholder: string;
  skills: string[];
  onChange: (skills: string[]) => void;
};

function SkillInput({ label, placeholder, skills, onChange }: SkillInputProps) {
  const [inputValue, setInputValue] = useState(skills.join(", "));

  const saveSkills = () => {
    if (inputValue) {
      onChange(parseCommaList(inputValue));
    }
  };

  return (
    <div>
      <TextField
        label={label}
        value={inputValue}
        onChange={setInputValue}
        onBlur={saveSkills}
        placeholder={placeholder}
      />
      <TagList items={skills} />
    </div>
  );
}

export function SkillsStep({
  skills,
  onUpdate,
  onBack,
  onNext,
}: SkillsStepProps) {
  return (
    <StepSection title="Skills">
      <SkillInput
        label="Technical Skills"
        placeholder="e.g., JavaScript, React, Node.js (comma-separated)"
        skills={skills.technical}
        onChange={(technical) => onUpdate({ technical })}
      />
      <SkillInput
        label="Soft Skills"
        placeholder="e.g., Leadership, Communication (comma-separated)"
        skills={skills.soft}
        onChange={(soft) => onUpdate({ soft })}
      />
      <SkillInput
        label="Languages"
        placeholder="e.g., English (Native), Spanish (Fluent)"
        skills={skills.languages}
        onChange={(languages) => onUpdate({ languages })}
      />
      <StepActions onBack={onBack} onNext={onNext} nextLabel="Next: Projects" />
    </StepSection>
  );
}
