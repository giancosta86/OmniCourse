import { TranslationsByPhrase } from "@giancosta86/hermes";
import { RawTaxonomy, TaxonomyJson } from "@giancosta86/omnicourse-core";

type WithCorrelationId = Readonly<{
  correlationId: bigint;
}>;

export type WorkerRequest = Readonly<{
  type: "prepareTaxonomyJson";
  locale: Intl.BCP47LanguageTag;
  translations: TranslationsByPhrase;
  rawTaxonomy: RawTaxonomy;
}> &
  WithCorrelationId;

export type WorkerResponse = Readonly<
  | {
      type: "taxonomyJsonReady";
      taxonomyJson: TaxonomyJson;
    }
  | {
      type: "taxonomyError";
      errorMessage: string;
    }
> &
  WithCorrelationId;
