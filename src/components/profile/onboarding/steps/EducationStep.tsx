import type { Education } from "@/types/profile";
import {
  AddItemButton,
  CheckboxField,
  ItemCard,
  StepActions,
  StepSection,
  TextAreaField,
  TextField,
} from "@/components/profile/onboarding/controls";
import { parseLineList } from "@/lib/profile/onboardingForm";

type EducationStepProps = {
  education: Education[];
  onAdd: () => void;
  onUpdate: (id: string, updates: Partial<Education>) => void;
  onRemove: (id: string) => void;
  onBack: () => void;
  onNext: () => void;
};

function getEducationSubtitle(education: Education): string {
  if (education.degree || education.institution) {
    return [education.degree, education.institution].filter(Boolean).join(" at ");
  }

  return "Add school details";
}

export function EducationStep({
  education,
  onAdd,
  onUpdate,
  onRemove,
  onBack,
  onNext,
}: EducationStepProps) {
  return (
    <StepSection title="Education" description="Add your educational background.">
      {education.map((educationItem, index) => (
        <ItemCard
          key={educationItem.id}
          title={`Education ${index + 1}`}
          subtitle={getEducationSubtitle(educationItem)}
          onRemove={() => onRemove(educationItem.id)}
        >
          <TextField
            label="School *"
            value={educationItem.institution}
            onChange={(institution) =>
              onUpdate(educationItem.id, { institution })
            }
            placeholder="University or school name"
          />
          <div className="grid gap-4 md:grid-cols-2">
            <TextField
              label="Degree *"
              value={educationItem.degree}
              onChange={(degree) => onUpdate(educationItem.id, { degree })}
              placeholder="Bachelor's, Master's, Certificate"
            />
            <TextField
              label="Field of study *"
              value={educationItem.field}
              onChange={(field) => onUpdate(educationItem.id, { field })}
              placeholder="Computer Science"
            />
          </div>
          <CheckboxField
            checked={educationItem.endDate === null}
            onChange={(checked) =>
              onUpdate(educationItem.id, { endDate: checked ? null : "" })
            }
            label="I am currently studying here"
          />
          <div className="grid gap-4 md:grid-cols-2">
            <TextField
              label="Start date *"
              type="month"
              value={educationItem.startDate}
              onChange={(startDate) => onUpdate(educationItem.id, { startDate })}
            />
            <TextField
              label="End date"
              type="month"
              value={educationItem.endDate ?? ""}
              disabled={educationItem.endDate === null}
              onChange={(endDate) => onUpdate(educationItem.id, { endDate })}
            />
          </div>
          <TextField
            label="Grade or GPA"
            value={educationItem.gpa ?? ""}
            onChange={(gpa) => onUpdate(educationItem.id, { gpa })}
            placeholder="3.8 GPA, First Class Honors, 90%"
          />
          <TextAreaField
            label="Activities, honors, or awards"
            rows={4}
            value={(educationItem.honors ?? []).join("\n")}
            onChange={(value) =>
              onUpdate(educationItem.id, { honors: parseLineList(value) })
            }
            placeholder="One activity, honor, or award per line"
          />
        </ItemCard>
      ))}
      <AddItemButton label="+ Add Education" onClick={onAdd} />
      <StepActions onBack={onBack} onNext={onNext} nextLabel="Next: Skills" />
    </StepSection>
  );
}
