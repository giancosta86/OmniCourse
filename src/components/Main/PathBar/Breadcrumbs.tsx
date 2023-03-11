import React, { useCallback } from "react";
import classNames from "classnames";
import { TaxonomyLevel, TaxonomyPath } from "@giancosta86/omnicourse-core";

export interface BreadcrumbsProps {
  taxonomyPath: TaxonomyPath;
  revertTaxonomyPathTo: (taxonomyLevel: TaxonomyLevel) => void;
}

export const Breadcrumbs = ({
  taxonomyPath,
  revertTaxonomyPathTo
}: BreadcrumbsProps) => {
  const onBreadcrumbClicked = useCallback(
    (taxonomyLevel: TaxonomyLevel) => {
      if (!TaxonomyLevel.isMeaningful(taxonomyLevel)) {
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
            TaxonomyLevel.isMeaningful(taxonomyLevel) ? "meaningful" : null
          ])}
          key={index}
          onClick={() => onBreadcrumbClicked(taxonomyLevel)}
        >
          {taxonomyLevel.name}
        </div>
      ))}

      <div className="breadcrumb current">{taxonomyPath.currentLevel.name}</div>
    </div>
  );
};
