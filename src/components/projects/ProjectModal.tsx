"use client";

import { Modal } from "@/components/ui/Modal";
import { ProjectDetails } from "./ProjectDetails";
import type { ProjectView } from "./types";

interface ProjectModalProps {
  view: ProjectView | null;
  onClose: () => void;
  onPickConcept?: (conceptId: string) => void;
}

export function ProjectModal({ view, onClose, onPickConcept }: ProjectModalProps) {
  return (
    <Modal open={Boolean(view)} onClose={onClose} title={view?.project.title ?? ""}>
      {view && <ProjectDetails view={view} onPickConcept={onPickConcept} fullPageHref={`/projects/${view.project.id}`} />}
    </Modal>
  );
}
