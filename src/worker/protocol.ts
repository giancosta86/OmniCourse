import { TranslationsByPhrase } from "@giancosta86/hermes";
import { RawTaxonomy, TaxonomyJson } from "@giancosta86/omnicourse-core";

type WithCorrelationId = Readonly<{
  correlationId: bigint;
}>;

export type MessageToWorker = Readonly<{
  type: "prepareTaxonomy";
  locale: Intl.BCP47LanguageTag;
  translations: TranslationsByPhrase;
  rawTaxonomy: RawTaxonomy;
}> &
  WithCorrelationId;

export type MessageFromWorker = Readonly<
  | {
      type: "taxonomyReady";
      taxonomyJson: TaxonomyJson;
    }
  | {
      type: "taxonomyError";
      errorMessage: string;
    }
> &
  WithCorrelationId;
