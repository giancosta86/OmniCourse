import { useCallback, useState } from "react";
import {
  RawTaxonomyFetcher,
  Subject,
  TaxonomyLevel,
  TaxonomyPath,
  Taxonomy,
  TaxonomyReifier
} from "@giancosta86/omnicourse-core";
import { useAsyncFetcher } from "@giancosta86/captain-hook";
import { formatError } from "@giancosta86/format-error";
import { TaxonomyPreview } from "./TaxonomyPreview";

export interface UseTaxonomyPathParams {
  selectedTaxonomyPreview: TaxonomyPreview;
  rawTaxonomyFetcher: RawTaxonomyFetcher;
  taxonomyReifier: TaxonomyReifier;
}

export const useTaxonomyPath = ({
  selectedTaxonomyPreview,
  rawTaxonomyFetcher,
  taxonomyReifier
}: UseTaxonomyPathParams) => {
  const [taxonomyPath, setTaxonomyPath] = useState<TaxonomyPath | undefined>(
    undefined
  );

  useAsyncFetcher<[Taxonomy, TaxonomyPath | undefined]>({
    fetcher: async () => {
      const oldTaxonomyPath = taxonomyPath;
      setTaxonomyPath(undefined);

      const rawTaxonomy = await rawTaxonomyFetcher(selectedTaxonomyPreview.id);

      const taxonomy = await taxonomyReifier(rawTaxonomy);

      return [taxonomy, oldTaxonomyPath];
    },

    onData: ([fetchedTaxonomy, oldTaxonomyPath]) => {
      const newTaxonomyPath = (
        oldTaxonomyPath?.navigateTaxonomy(fetchedTaxonomy) ??
        TaxonomyPath.fromTaxonomy(fetchedTaxonomy)
      ).toMeaningful();

      setTaxonomyPath(newTaxonomyPath);
    },

    onError: err => {
      console.error(err);

      alert(
        `Cannot sync path for taxonomy '${
          selectedTaxonomyPreview.name
        }'. ${formatError(err)}`
      );
    },

    dependencies: [selectedTaxonomyPreview, rawTaxonomyFetcher]
  });

  const pushToTaxonomyPath = useCallback(
    (subject: Subject) => {
      setTaxonomyPath(taxonomyPath?.push(subject).toMeaningful());
    },
    [taxonomyPath]
  );

  const revertTaxonomyPathTo = useCallback(
    (taxonomyLevel: TaxonomyLevel) => {
      setTaxonomyPath(taxonomyPath?.revertTo(taxonomyLevel).toMeaningful());
    },
    [taxonomyPath]
  );

  return { taxonomyPath, pushToTaxonomyPath, revertTaxonomyPathTo };
};
