import { HashMap } from "@rimbu/hashed";
import { Dictionary, LocaleLike } from "@giancosta86/hermes";
import { RawTaxonomy, TaxonomyJson } from "@giancosta86/omnicourse-core";
import { ErrorParts, formatError } from "@giancosta86/format-error";
import { WorkerResponse, WorkerRequest } from "./protocol";

type RequestProcessor = (request: WorkerRequest) => WorkerResponse;

const requestProcessors = HashMap.of<WorkerRequest["type"], RequestProcessor>([
  "prepareTaxonomyJson",
  processPrepareTaxonomyJson
]);

export function processRequest(request: WorkerRequest): WorkerResponse {
  const processor = requestProcessors.get(request.type);
  if (!processor) {
    throw new Error(`Unsupported request type: '${request.type}'`);
  }

  return processor(request);
}

function processPrepareTaxonomyJson({
  correlationId,
  locale,
  translations,
  rawTaxonomy
}: WorkerRequest & { type: "prepareTaxonomyJson" }): WorkerResponse & {
  type: "taxonomyJsonReady" | "taxonomyError";
} {
  const dictionary = Dictionary.fromRawTranslations(translations);

  try {
    const taxonomyJson = prepareTaxonomyJson({
      locale,
      dictionary,
      rawTaxonomy
    });

    return {
      correlationId,
      type: "taxonomyJsonReady",
      taxonomyJson
    };
  } catch (err) {
    return {
      correlationId,
      type: "taxonomyError",
      errorMessage: formatError(err, ErrorParts.Message)
    };
  }
}

type PreparationParams = {
  locale: LocaleLike;
  dictionary: Dictionary;
  rawTaxonomy: RawTaxonomy;
};

function prepareTaxonomyJson({
  locale,
  dictionary,
  rawTaxonomy
}: PreparationParams): TaxonomyJson {
  const translatedRawTaxonomy = RawTaxonomy.translate(dictionary, rawTaxonomy);

  const taxonomy = RawTaxonomy.reify(locale, translatedRawTaxonomy);

  return TaxonomyJson.from(taxonomy);
}
