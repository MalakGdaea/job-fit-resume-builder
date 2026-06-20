import type { WorkExperience } from "@/types/profile";
import {
  AddItemButton,
  CheckboxField,
  ItemCard,
  StepActions,
  StepSection,
  TextAreaField,
  TextField,
} from "@/components/profile/onboarding/FormControls";
import { parseLineList } from "@/components/profile/onboarding/utils";

type WorkExperienceStepProps = {
  workExperience: WorkExperience[];
  onAdd: () => void;
  onUpdate: (id: string, updates: Partial<WorkExperience>) => void;
  onRemove: (id: string) => void;
  onBack: () => void;
  onNext: () => void;
};

function getExperienceSubtitle(experience: WorkExperience): string {
  if (experience.position || experience.company) {
    return [experience.position, experience.company].filter(Boolean).join(" at ");
  }

  return "Add role details";
}

export function WorkExperienceStep({
  workExperience,
  onAdd,
  onUpdate,
  onRemove,
  onBack,
  onNext,
}: WorkExperienceStepProps) {
  return (
    <StepSection
      title="Work Experience"
      description="Add your work history. You can skip this and add it later."
    >
      {workExperience.map((experience, index) => (
        <ItemCard
          key={experience.id}
          title={`Experience ${index + 1}`}
          subtitle={getExperienceSubtitle(experience)}
          onRemove={() => onRemove(experience.id)}
        >
          <div className="grid gap-4 md:grid-cols-2">
            <TextField
              label="Title *"
              value={experience.position}
              onChange={(position) => onUpdate(experience.id, { position })}
              placeholder="Software Engineer"
            />
            <TextField
              label="Company *"
              value={experience.company}
              onChange={(company) => onUpdate(experience.id, { company })}
              placeholder="Company name"
            />
          </div>
          <TextField
            label="Location"
            value={experience.location ?? ""}
            onChange={(location) => onUpdate(experience.id, { location })}
            placeholder="City, country or Remote"
          />
          <CheckboxField
            checked={experience.endDate === null}
            onChange={(checked) =>
              onUpdate(experience.id, { endDate: checked ? null : "" })
            }
            label="I am currently working in this role"
          />
          <div className="grid gap-4 md:grid-cols-2">
            <TextField
              label="Start date *"
              type="month"
              value={experience.startDate}
              onChange={(startDate) => onUpdate(experience.id, { startDate })}
            />
            <TextField
              label="End date"
              type="month"
              value={experience.endDate ?? ""}
              disabled={experience.endDate === null}
              onChange={(endDate) => onUpdate(experience.id, { endDate })}
            />
          </div>
          <TextAreaField
            label="Description"
            rows={3}
            value={experience.description}
            onChange={(description) => onUpdate(experience.id, { description })}
            placeholder="Briefly describe your role and scope."
          />
          <TextAreaField
            label="Achievements"
            rows={5}
            value={experience.achievements.join("\n")}
            onChange={(value) =>
              onUpdate(experience.id, { achievements: parseLineList(value) })
            }
            placeholder="One achievement per line"
            helpText="Use real accomplishments only. These become resume bullet points."
          />
        </ItemCard>
      ))}
      <AddItemButton label="+ Add Work Experience" onClick={onAdd} />
      <StepActions
        onBack={onBack}
        onNext={onNext}
        nextLabel="Next: Education"
      />
    </StepSection>
  );
}
