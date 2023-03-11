import React from "react";
import { useLearningContext } from "../../LearningContext";
import { Breadcrumbs } from "./Breadcrumbs";
import { TaxonomySelectionBox } from "./TaxonomySelectionBox";

export interface PathBarProps {
  taxonomySelectLabel: string;
}

export const PathBar = ({ taxonomySelectLabel }: PathBarProps) => {
  const {
    taxonomyPreviews,
    selectedTaxonomyPreview,
    setSelectedTaxonomyId,
    taxonomyPath,
    revertTaxonomyPathTo
  } = useLearningContext();

  return (
    <nav className="pathBar">
      {taxonomyPreviews && selectedTaxonomyPreview && (
        <TaxonomySelectionBox
          label={taxonomySelectLabel}
          taxonomyPreviews={taxonomyPreviews}
          selectedTaxonomyId={selectedTaxonomyPreview.id}
          setSelectedTaxonomyId={setSelectedTaxonomyId}
        />
      )}

      {taxonomyPath && (
        <Breadcrumbs
          taxonomyPath={taxonomyPath}
          revertTaxonomyPathTo={revertTaxonomyPathTo}
        />
      )}
    </nav>
  );
};
