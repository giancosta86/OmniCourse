import React, { ReactNode, useMemo, useState } from "react";
import { List } from "@rimbu/list";
import { DictionaryLibrary, LocaleLike } from "@giancosta86/hermes";
import { formatError } from "@giancosta86/format-error";
import { RawTaxonomyFetcher } from "@giancosta86/omnicourse-core";
import { useAsyncFetcher } from "@giancosta86/captain-hook";
import { useBackgroundTaxonomyReifier } from "@/worker";
import { LearningContextProvider, TaxonomyPreview } from "./LearningContext";
import { Main } from "./Main";
import { ChartSettings } from "./Main/SubjectChart";

export type TaxonomyPreviewsFetcher = () => Promise<Iterable<TaxonomyPreview>>;

export interface OmniCourseProps {
  locale: LocaleLike;
  dictionaryLibrary?: DictionaryLibrary;
  onMobile: boolean;
  taxonomySelectLabel: string;
  taxonomyPreviewsFetcher: TaxonomyPreviewsFetcher;
  rawTaxonomyFetcher: RawTaxonomyFetcher;
  loadingNode: ReactNode;
  chartSettings?: Partial<ChartSettings>;
}

export const OmniCourse = ({
  locale,
  dictionaryLibrary,
  onMobile,
  taxonomySelectLabel,
  taxonomyPreviewsFetcher,
  rawTaxonomyFetcher,
  loadingNode,
  chartSettings
}: OmniCourseProps) => {
  const [taxonomyPreviews, setTaxonomyPreviews] = useState<
    List.NonEmpty<TaxonomyPreview> | undefined
  >(undefined);

  useAsyncFetcher({
    fetcher: taxonomyPreviewsFetcher,
    onData: fetchedTaxonomyPreviews => {
      TaxonomyPreview.validateCollection(fetchedTaxonomyPreviews);

      const actualTaxonomyPreviews = List.from(
        fetchedTaxonomyPreviews
      ).assumeNonEmpty();

      setTaxonomyPreviews(actualTaxonomyPreviews);
    },
    onError: err => {
      console.error(err);
      alert(`Cannot load the taxonomy previews. ${formatError(err)}`);
    },
    dependencies: [taxonomyPreviewsFetcher]
  });

  const dictionary = useMemo(
    () =>
      (dictionaryLibrary ?? DictionaryLibrary.empty()).getDictionary(locale),
    [dictionaryLibrary, locale]
  );

  const translations = useMemo(
    () => dictionary.toRawTranslations(),
    [dictionary]
  );

  const taxonomyReifier = useBackgroundTaxonomyReifier(locale, translations);

  return taxonomyPreviews && taxonomyReifier ? (
    <LearningContextProvider
      locale={locale}
      dictionary={dictionary}
      taxonomyReifier={taxonomyReifier}
      onMobile={onMobile}
      taxonomyPreviews={taxonomyPreviews}
      rawTaxonomyFetcher={rawTaxonomyFetcher}
    >
      <Main
        loadingNode={loadingNode}
        taxonomySelectLabel={taxonomySelectLabel}
        chartSettings={chartSettings}
      />
    </LearningContextProvider>
  ) : (
    <div className="loadingBox">loadingNode</div>
  );
};
