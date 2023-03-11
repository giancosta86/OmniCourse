import { useCallback, useMemo, useState } from "react";
import { List } from "@rimbu/list";
import { HashMap } from "@rimbu/hashed";
import { TaxonomyPreview } from "./TaxonomyPreview";

export const useSelectedTaxonomy = (
  taxonomyPreviews: List.NonEmpty<TaxonomyPreview>
) => {
  const taxonomyPreviewsById = useMemo(
    () =>
      HashMap.from(
        taxonomyPreviews.map(taxonomyPreview => [
          taxonomyPreview.id,
          taxonomyPreview
        ])
      ),
    [taxonomyPreviews]
  );

  const [selectedTaxonomyPreview, setSelectedTaxonomyPreview] =
    useState<TaxonomyPreview>(taxonomyPreviews.first());

  const setSelectedTaxonomyId = useCallback(
    (taxonomyId: string) => {
      const taxonomyPreview = taxonomyPreviewsById?.get(taxonomyId);

      if (!taxonomyPreview) {
        throw new Error(
          `Cannot find taxonomy preview having id '${taxonomyId}'`
        );
      }

      setSelectedTaxonomyPreview(taxonomyPreview);
    },
    [taxonomyPreviewsById]
  );

  return {
    selectedTaxonomyPreview,
    setSelectedTaxonomyId
  };
};
