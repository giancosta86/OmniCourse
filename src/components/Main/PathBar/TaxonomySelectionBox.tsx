import React from "react";
import { List } from "@rimbu/list";
import { TaxonomyPreview } from "../../LearningContext";

export interface Props {
  label: string;
  taxonomyPreviews: List<TaxonomyPreview>;
  selectedTaxonomyId: string;
  setSelectedTaxonomyId: (taxonomyId: string) => void;
}

export const TaxonomySelectionBox = ({
  label,
  taxonomyPreviews,
  selectedTaxonomyId,
  setSelectedTaxonomyId
}: Props) => {
  return (
    <div className="taxonomySelectionBox">
      <label>{label}</label>
      <select
        value={selectedTaxonomyId}
        onChange={event => {
          setSelectedTaxonomyId(event.target.value);
        }}
      >
        {taxonomyPreviews.map(taxonomyPreview => (
          <option key={taxonomyPreview.id} value={taxonomyPreview.id}>
            {taxonomyPreview.name}
          </option>
        ))}
      </select>
    </div>
  );
};
