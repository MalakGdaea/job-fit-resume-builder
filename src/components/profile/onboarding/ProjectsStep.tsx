import type { Project } from "@/types/profile";
import {
  AddItemButton,
  EmptyState,
  ItemCard,
  StepActions,
  StepSection,
  TextAreaField,
  TextField,
} from "@/components/profile/onboarding/FormControls";
import {
  parseCommaList,
  parseLineList,
} from "@/components/profile/onboarding/utils";

type ProjectsStepProps = {
  projects: Project[];
  onAdd: () => void;
  onUpdate: (id: string, updates: Partial<Project>) => void;
  onRemove: (id: string) => void;
  onBack: () => void;
  onNext: () => void;
};

export function ProjectsStep({
  projects,
  onAdd,
  onUpdate,
  onRemove,
  onBack,
  onNext,
}: ProjectsStepProps) {
  return (
    <StepSection title="Projects (Optional)">
      {projects.length === 0 && <EmptyState>No projects added yet.</EmptyState>}
      {projects.map((project, index) => (
        <ItemCard
          key={project.id}
          title={`Project ${index + 1}`}
          subtitle={project.name || "Add project details"}
          onRemove={() => onRemove(project.id)}
        >
          <TextField
            label="Project name *"
            value={project.name}
            onChange={(name) => onUpdate(project.id, { name })}
            placeholder="Portfolio website, analytics dashboard, mobile app"
          />
          <TextField
            label="Project URL"
            type="url"
            value={project.url ?? ""}
            onChange={(url) => onUpdate(project.id, { url })}
            placeholder="https://github.com/username/project"
          />
          <div className="grid gap-4 md:grid-cols-2">
            <TextField
              label="Start date"
              type="month"
              value={project.startDate ?? ""}
              onChange={(startDate) => onUpdate(project.id, { startDate })}
            />
            <TextField
              label="End date"
              type="month"
              value={project.endDate ?? ""}
              onChange={(endDate) => onUpdate(project.id, { endDate })}
            />
          </div>
          <TextAreaField
            label="Description *"
            rows={3}
            value={project.description}
            onChange={(description) => onUpdate(project.id, { description })}
            placeholder="Describe what the project does, who it serves, and your role."
          />
          <TextField
            label="Technologies"
            value={project.technologies.join(", ")}
            onChange={(value) =>
              onUpdate(project.id, { technologies: parseCommaList(value) })
            }
            placeholder="React, TypeScript, PostgreSQL"
          />
          <TextAreaField
            label="Highlights"
            rows={5}
            value={project.highlights.join("\n")}
            onChange={(value) =>
              onUpdate(project.id, { highlights: parseLineList(value) })
            }
            placeholder="One project highlight per line"
          />
        </ItemCard>
      ))}
      <AddItemButton label="+ Add Project" onClick={onAdd} />
      <StepActions
        onBack={onBack}
        onNext={onNext}
        nextLabel="Next: Certifications"
      />
    </StepSection>
  );
}
