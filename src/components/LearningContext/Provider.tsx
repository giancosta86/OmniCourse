import React, { ReactNode } from "react";
import { List } from "@rimbu/list";
import { Dictionary, LocaleLike } from "@giancosta86/hermes";
import {
  RawTaxonomyFetcher,
  TaxonomyReifier
} from "@giancosta86/omnicourse-core";
import { LearningContext } from "./Context";
import { useLocalization } from "./useLocalization";
import { useTaxonomyPath } from "./useTaxonomyPath";
import { useSelectedTaxonomy } from "./useSelectedTaxonomy";
import { learningContext } from "./Instance";
import { TaxonomyPreview } from "./TaxonomyPreview";

export interface LearningContextProps {
  locale: LocaleLike;
  dictionary: Dictionary;
  taxonomyPreviews: List.NonEmpty<TaxonomyPreview>;
  rawTaxonomyFetcher: RawTaxonomyFetcher;
  taxonomyReifier: TaxonomyReifier;
  onMobile: boolean;
  children: ReactNode;
}

export const LearningContextProvider = ({
  locale,
  dictionary,
  taxonomyReifier,
  taxonomyPreviews,
  rawTaxonomyFetcher,
  onMobile,
  children
}: LearningContextProps) => {
  const { selectedTaxonomyPreview, setSelectedTaxonomyId } =
    useSelectedTaxonomy(taxonomyPreviews);

  const { taxonomyPath, pushToTaxonomyPath, revertTaxonomyPathTo } =
    useTaxonomyPath({
      rawTaxonomyFetcher,
      taxonomyReifier,
      selectedTaxonomyPreview
    });

  const { formatMinutes, formatIsoDate } = useLocalization(locale, dictionary);

  const contextValue: LearningContext = {
    taxonomyPreviews,
    selectedTaxonomyPreview,
    taxonomyPath,
    currentLevel: taxonomyPath?.currentLevel,
    onMobile,
    setSelectedTaxonomyId,
    pushToTaxonomyPath,
    revertTaxonomyPathTo,
    formatMinutes,
    formatIsoDate
  };

  return (
    <learningContext.Provider value={contextValue}>
      {children}
    </learningContext.Provider>
  );
};
