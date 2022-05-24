import React from "react";
import { Breadcrumbs } from "./Breadcrumbs";
import { TaxonomySelectionBox } from "./TaxonomySelectionBox";
import { useLearningContext } from "../LearningContext";

export interface Props {
  taxonomySelectLabel: string;
}

export const PathBar = ({ taxonomySelectLabel }: Props) => {
  const {
    taxonomyKeys,
    selectedTaxonomyKey,
    setSelectedTaxonomyId,
    taxonomyPath,
    revertTaxonomyPathTo
  } = useLearningContext();

  return (
    <nav className="pathBar">
      {taxonomyKeys && selectedTaxonomyKey && (
        <TaxonomySelectionBox
          label={taxonomySelectLabel}
          taxonomyKeys={taxonomyKeys}
          selectedTaxonomyId={selectedTaxonomyKey.id}
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
