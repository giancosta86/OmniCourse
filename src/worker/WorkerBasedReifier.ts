import { LocaleLike, TranslationsByPhrase } from "@giancosta86/hermes";
import {
  Taxonomy,
  TaxonomyReifier,
  RawTaxonomy
} from "@giancosta86/omnicourse-core";
import { WorkerResponse, WorkerRequest } from "./protocol";

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

        const responseEventHandler = (event: MessageEvent<WorkerResponse>) => {
          const responseMessage = event.data;

          if (responseMessage.correlationId != thisCorrelationid) {
            return;
          }

          backingWorker.removeEventListener("message", responseEventHandler);

          switch (responseMessage.type) {
            case "taxonomyJsonReady": {
              const taxonomy = Taxonomy.fromValidJson(
                responseMessage.taxonomyJson
              );
              return resolve(taxonomy);
            }

            case "taxonomyError":
              return reject(responseMessage.errorMessage);
          }
        };

        backingWorker.addEventListener("message", responseEventHandler);

        const requestMessage: WorkerRequest = {
          correlationId: thisCorrelationid,
          type: "prepareTaxonomyJson",
          locale: LocaleLike.toLanguageTag(locale),
          translations,
          rawTaxonomy
        };

        backingWorker.postMessage(requestMessage);
      });
  }
}
