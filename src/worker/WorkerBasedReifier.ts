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
        const correlationId = nextCorrelationId++;

        const responseEventHandler = (event: MessageEvent<WorkerResponse>) => {
          const response = event.data;

          if (response.correlationId != correlationId) {
            return;
          }

          backingWorker.removeEventListener("message", responseEventHandler);

          switch (response.type) {
            case "taxonomyJsonReady": {
              const taxonomy = Taxonomy.fromValidJson(response.taxonomyJson);
              return resolve(taxonomy);
            }

            case "taxonomyError":
              return reject(response.errorMessage);
          }
        };

        backingWorker.addEventListener("message", responseEventHandler);

        const request: WorkerRequest = {
          correlationId,
          type: "prepareTaxonomyJson",
          locale: LocaleLike.toLanguageTag(locale),
          translations,
          rawTaxonomy
        };

        backingWorker.postMessage(request);
      });
  }
}
