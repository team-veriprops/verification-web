import { useTaskStore } from "../libs/useTaskStore";
import { LawyerForm } from "./forms/LawyerForm";
import { SurveyorForm } from "./forms/SurveyorForm";
import { RegistryForm } from "./forms/RegistryForm";
import { FieldAgentForm } from "./forms/FieldAgentForm";
import { useState } from "react";
import { VerifierRole, TaskStatus } from "../models";

export default function TaskResponseForm() {
  const [formData, setFormData] = useState(
    // task.formDraft ||
    {}
  );
  const {
    currentTask,
  } = useTaskStore();

  const canSubmit =
    currentTask?.status === TaskStatus.IN_PROGRESS ||
    currentTask?.status === TaskStatus.ACCEPTED;

  const handleSaveDraft = () => {
    // saveDraft(task.id, formData);
  };

  const getRoleForm = () => {
    switch (currentTask?.role_required) {
      case VerifierRole.LAWYER:
        return (
          <LawyerForm
            task={currentTask}
            data={formData}
            onChange={setFormData}
          />
        );
      case VerifierRole.SURVEYOR:
        return (
          <SurveyorForm
            task={currentTask}
            data={formData}
            onChange={setFormData}
          />
        );
      case VerifierRole.FIELD_AGENT:
        return (
          <FieldAgentForm
            task={currentTask}
            data={formData}
            onChange={setFormData}
          />
        );
      case VerifierRole.REGISTRY:
        return (
          <RegistryForm
            task={currentTask}
            canSubmit={canSubmit}
            handleSaveDraft={handleSaveDraft}
          />
        );
    }
  };

  return <>{getRoleForm()}</>;
}
