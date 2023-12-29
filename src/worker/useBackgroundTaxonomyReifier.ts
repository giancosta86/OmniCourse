import { useEffect, useState } from "react";
import { TranslationsByPhrase, LocaleLike } from "@giancosta86/hermes";
import { TaxonomyReifier } from "@giancosta86/omnicourse-core";
import { WorkerBasedReifier } from "./WorkerBasedReifier";

export const useBackgroundTaxonomyReifier = (
  locale: LocaleLike,
  translations: TranslationsByPhrase
) => {
  const [taxonomyReifier, setTaxonomyReifier] = useState<
    TaxonomyReifier | undefined
  >(undefined);

  useEffect(() => {
    const taxonomyWorker = new Worker(new URL("./worker", import.meta.url));

    const workerBasedReifier = WorkerBasedReifier.create(
      taxonomyWorker,
      locale,
      translations
    );

    setTaxonomyReifier(() => workerBasedReifier);

    return () => {
      taxonomyWorker.terminate();
    };
  }, [locale, translations]);

  return taxonomyReifier;
};
