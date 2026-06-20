import type { Certification } from "@/types/profile";
import {
  AddItemButton,
  CheckboxField,
  EmptyState,
  ItemCard,
  StepActions,
  StepSection,
  TextField,
} from "@/components/profile/onboarding/FormControls";

type CertificationsStepProps = {
  certifications: Certification[];
  isSaving: boolean;
  onAdd: () => void;
  onUpdate: (id: string, updates: Partial<Certification>) => void;
  onRemove: (id: string) => void;
  onBack: () => void;
  onSave: () => void;
};

function getCertificationSubtitle(certification: Certification): string {
  if (certification.name || certification.issuer) {
    return [certification.name, certification.issuer]
      .filter(Boolean)
      .join(" from ");
  }

  return "Add certification details";
}

export function CertificationsStep({
  certifications,
  isSaving,
  onAdd,
  onUpdate,
  onRemove,
  onBack,
  onSave,
}: CertificationsStepProps) {
  return (
    <StepSection title="Certifications (Optional)">
      {certifications.length === 0 && (
        <EmptyState>No certifications added yet.</EmptyState>
      )}
      {certifications.map((certification, index) => (
        <ItemCard
          key={certification.id}
          title={`Certification ${index + 1}`}
          subtitle={getCertificationSubtitle(certification)}
          onRemove={() => onRemove(certification.id)}
        >
          <TextField
            label="Name *"
            value={certification.name}
            onChange={(name) => onUpdate(certification.id, { name })}
            placeholder="AWS Certified Developer, Google Data Analytics"
          />
          <TextField
            label="Issuing organization *"
            value={certification.issuer}
            onChange={(issuer) => onUpdate(certification.id, { issuer })}
            placeholder="Amazon Web Services, Coursera, Microsoft"
          />
          <CheckboxField
            checked={certification.expirationDate === null}
            onChange={(checked) =>
              onUpdate(certification.id, {
                expirationDate: checked ? null : "",
              })
            }
            label="This credential does not expire"
          />
          <div className="grid gap-4 md:grid-cols-2">
            <TextField
              label="Issue date *"
              type="month"
              value={certification.dateIssued}
              onChange={(dateIssued) =>
                onUpdate(certification.id, { dateIssued })
              }
            />
            <TextField
              label="Expiration date"
              type="month"
              value={certification.expirationDate ?? ""}
              disabled={certification.expirationDate === null}
              onChange={(expirationDate) =>
                onUpdate(certification.id, { expirationDate })
              }
            />
          </div>
          <TextField
            label="Credential ID"
            value={certification.credentialId ?? ""}
            onChange={(credentialId) =>
              onUpdate(certification.id, { credentialId })
            }
            placeholder="Credential number or license ID"
          />
          <TextField
            label="Credential URL"
            type="url"
            value={certification.url ?? ""}
            onChange={(url) => onUpdate(certification.id, { url })}
            placeholder="https://www.credential.net/..."
          />
        </ItemCard>
      ))}
      <AddItemButton label="+ Add Certification" onClick={onAdd} />
      <StepActions
        onBack={onBack}
        onNext={onSave}
        nextLabel={isSaving ? "Saving..." : "Complete & Continue"}
        nextDisabled={isSaving}
      />
    </StepSection>
  );
}
