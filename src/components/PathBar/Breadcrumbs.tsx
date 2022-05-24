import classNames from "classnames";
import React from "react";
import { isMeaningful, TaxonomyLevel } from "../../TaxonomyLevel";
import { TaxonomyPath } from "../../TaxonomyPath";

export interface Props {
  taxonomyPath: TaxonomyPath;
  revertTaxonomyPathTo: (taxonomyLevel: TaxonomyLevel) => void;
}

export const Breadcrumbs = ({ taxonomyPath, revertTaxonomyPathTo }: Props) => (
  <div className="breadcrumbs">
    {taxonomyPath.previousLevels.map((taxonomyLevel, index) => (
      <div
        className={classNames([
          "breadcrumb",
          "previous",
          isMeaningful(taxonomyLevel) ? "meaningful" : null
        ])}
        key={`${index} - ${taxonomyLevel.name}`}
        onClick={() => revertTaxonomyPathTo(taxonomyLevel)}
      >
        {taxonomyLevel.name}
      </div>
    ))}

    <div className="breadcrumb current">{taxonomyPath.currentLevel.name}</div>
  </div>
);
