import React from "react";
import { TaxonomyKey } from "../../input/repository/TaxonomyKey";

export interface Props {
  label: string;
  taxonomyKeys: readonly TaxonomyKey[];
  selectedTaxonomyId: string;
  setSelectedTaxonomyId: (taxonomyId: string) => void;
}

export const TaxonomySelectionBox = ({
  label,
  taxonomyKeys,
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
        {taxonomyKeys.map(taxonomyKey => (
          <option key={taxonomyKey.id} value={taxonomyKey.id}>
            {taxonomyKey.name}
          </option>
        ))}
      </select>
    </div>
  );
};
