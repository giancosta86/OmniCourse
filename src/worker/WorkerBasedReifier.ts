import { LocaleLike, TranslationsByPhrase } from "@giancosta86/hermes";
import {
  Taxonomy,
  TaxonomyReifier,
  RawTaxonomy
} from "@giancosta86/omnicourse-core";
import { MessageFromWorker, MessageToWorker } from "./protocol";

export namespace WorkerBasedReifier {
  export function create(
    backingWorker: Worker,
    locale: LocaleLike,
    translations: TranslationsByPhrase
  ): TaxonomyReifier {
    let nextCorrelationId: bigint = 0n;

    return (rawTaxonomy: RawTaxonomy) =>
      new Promise<Taxonomy>((resolve, reject) => {
        const thisCorrelationid = nextCorrelationId++;

        const responseEventHandler = (
          event: MessageEvent<MessageFromWorker>
        ) => {
          const responseMessage = event.data;

          if (responseMessage.correlationId != thisCorrelationid) {
            return;
          }

          backingWorker.removeEventListener("message", responseEventHandler);

          switch (responseMessage.type) {
            case "taxonomyReady": {
              const taxonomy = Taxonomy.fromJson(responseMessage.taxonomyJson);
              return resolve(taxonomy);
            }

            case "taxonomyError":
              return reject(responseMessage.errorMessage);
          }
        };

        backingWorker.addEventListener("message", responseEventHandler);

        const requestMessage: MessageToWorker = {
          correlationId: thisCorrelationid,
          type: "prepareTaxonomy",
          locale: LocaleLike.toLanguageTag(locale),
          translations,
          rawTaxonomy
        };

        backingWorker.postMessage(requestMessage);
      });
  }
}
