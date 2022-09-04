import React, { useCallback } from "react";
import classNames from "classnames";
import { isMeaningful, TaxonomyLevel } from "../../TaxonomyLevel";
import { TaxonomyPath } from "../../TaxonomyPath";

export interface Props {
  taxonomyPath: TaxonomyPath;
  revertTaxonomyPathTo: (taxonomyLevel: TaxonomyLevel) => void;
}

export const Breadcrumbs = ({ taxonomyPath, revertTaxonomyPathTo }: Props) => {
  const onBreadcrumbClicked = useCallback(
    (taxonomyLevel: TaxonomyLevel) => {
      if (!isMeaningful(taxonomyLevel)) {
        return;
      }

      revertTaxonomyPathTo(taxonomyLevel);
    },
    [revertTaxonomyPathTo]
  );

  return (
    <div className="breadcrumbs">
      {taxonomyPath.previousLevels.map((taxonomyLevel, index) => (
        <div
          className={classNames([
            "breadcrumb",
            "previous",
            isMeaningful(taxonomyLevel) ? "meaningful" : null
          ])}
          key={`${index} - ${taxonomyLevel.name}`}
          onClick={() => onBreadcrumbClicked(taxonomyLevel)}
        >
          {taxonomyLevel.name}
        </div>
      ))}

      <div className="breadcrumb current">{taxonomyPath.currentLevel.name}</div>
    </div>
  );
};
