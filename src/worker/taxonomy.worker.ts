import { Dictionary, LocaleLike } from "@giancosta86/hermes";
import { RawTaxonomy, TaxonomyJson } from "@giancosta86/omnicourse-core";
import { formatError } from "@giancosta86/format-error";
import { MessageFromWorker, MessageToWorker } from "./protocol";

self.addEventListener("message", event => {
  const message = event.data as MessageToWorker;

  switch (message.type) {
    case "prepareTaxonomy":
      processPrepareTaxonomyMessage(message);
      return;
  }
});

function processPrepareTaxonomyMessage({
  correlationId,
  locale,
  translations,
  rawTaxonomy
}: MessageToWorker & { type: "prepareTaxonomy" }) {
  const dictionary = Dictionary.fromRawTranslations(translations);

  const resultMessage = prepareTaxonomy({
    correlationId,
    locale,
    dictionary,
    rawTaxonomy
  });

  self.postMessage(resultMessage);
}

type PreparationParams = {
  correlationId: bigint;
  locale: LocaleLike;
  dictionary: Dictionary;
  rawTaxonomy: RawTaxonomy;
};

function prepareTaxonomy({
  correlationId,
  locale,
  dictionary,
  rawTaxonomy
}: PreparationParams): MessageFromWorker & {
  type: "taxonomyReady" | "taxonomyError";
} {
  try {
    const localizedRawTaxonomy = RawTaxonomy.localize(
      locale,
      dictionary,
      rawTaxonomy
    );

    const taxonomy = RawTaxonomy.reify(localizedRawTaxonomy);

    const taxonomyJson = TaxonomyJson.from(taxonomy);

    return {
      correlationId,
      type: "taxonomyReady",
      taxonomyJson
    };
  } catch (err) {
    return {
      correlationId,
      type: "taxonomyError",
      errorMessage: formatError(err)
    };
  }
}
