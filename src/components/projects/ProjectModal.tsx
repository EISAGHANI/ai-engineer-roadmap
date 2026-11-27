"use client";

import { Modal } from "@/components/ui/Modal";
import { ProjectDetails } from "./ProjectDetails";
import type { ProjectView } from "./types";
import { useLocalePath } from "@/i18n/client";

interface ProjectModalProps {
  view: ProjectView | null;
  onClose: () => void;
  onPickConcept?: (conceptId: string) => void;
}

export function ProjectModal({ view, onClose, onPickConcept }: ProjectModalProps) {
  const lp = useLocalePath();
  return (
    <Modal open={Boolean(view)} onClose={onClose} title={view?.project.title ?? ""}>
      {view && <ProjectDetails view={view} onPickConcept={onPickConcept} fullPageHref={lp(`/projects/${view.project.id}`)} />}
    </Modal>
  );
}
