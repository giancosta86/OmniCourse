import { HashMap } from "@rimbu/hashed";
import { Dictionary, LocaleLike } from "@giancosta86/hermes";
import { RawTaxonomy, TaxonomyDto } from "@giancosta86/omnicourse-core";
import { ErrorParts, formatError } from "@giancosta86/format-error";
import { WorkerResponse, WorkerRequest } from "./protocol";

type RequestProcessor = (request: WorkerRequest) => WorkerResponse;

const requestProcessors = HashMap.of<WorkerRequest["type"], RequestProcessor>([
  "prepareTaxonomyDto",
  processPrepareTaxonomyDto
]);

export function processRequest(request: WorkerRequest): WorkerResponse {
  const processor = requestProcessors.get(request.type);
  if (!processor) {
    throw new Error(`Unsupported request type: '${request.type}'`);
  }

  return processor(request);
}

function processPrepareTaxonomyDto({
  correlationId,
  locale,
  translations,
  rawTaxonomy
}: WorkerRequest & { type: "prepareTaxonomyDto" }): WorkerResponse & {
  type: "taxonomyDtoReady" | "taxonomyError";
} {
  const dictionary = Dictionary.fromRawTranslations(translations);

  try {
    const taxonomyDto = prepareTaxonomyDto({
      locale,
      dictionary,
      rawTaxonomy
    });

    return {
      correlationId,
      type: "taxonomyDtoReady",
      taxonomyDto
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

function prepareTaxonomyDto({
  locale,
  dictionary,
  rawTaxonomy
}: PreparationParams): TaxonomyDto {
  const translatedRawTaxonomy = RawTaxonomy.translate(dictionary, rawTaxonomy);

  const taxonomy = RawTaxonomy.reify(locale, translatedRawTaxonomy);

  return TaxonomyDto.from(taxonomy);
}
