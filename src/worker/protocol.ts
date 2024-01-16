import { TranslationsByPhrase } from "@giancosta86/hermes";
import { RawTaxonomy, TaxonomyDto } from "@giancosta86/omnicourse-core";

type WithCorrelationId = Readonly<{
  correlationId: bigint;
}>;

export type WorkerRequest = Readonly<{
  type: "prepareTaxonomyDto";
  locale: Intl.BCP47LanguageTag;
  translations: TranslationsByPhrase;
  rawTaxonomy: RawTaxonomy;
}> &
  WithCorrelationId;

export type WorkerResponse = Readonly<
  | {
      type: "taxonomyDtoReady";
      taxonomyDto: TaxonomyDto;
    }
  | {
      type: "taxonomyError";
      errorMessage: string;
    }
> &
  WithCorrelationId;
