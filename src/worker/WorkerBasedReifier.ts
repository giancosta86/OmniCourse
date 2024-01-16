import { LocaleLike, TranslationsByPhrase } from "@giancosta86/hermes";
import {
  Taxonomy,
  TaxonomyReifier,
  RawTaxonomy
} from "@giancosta86/omnicourse-core";
import { WorkerFacade } from "@giancosta86/worker-facade";
import { WorkerResponse, WorkerRequest } from "./protocol";

export namespace WorkerBasedReifier {
  export function create(
    backingWorker: WorkerFacade,
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
            case "taxonomyDtoReady": {
              const taxonomy = Taxonomy.fromValidDto(response.taxonomyDto);
              return resolve(taxonomy);
            }

            case "taxonomyError":
              return reject(response.errorMessage);
          }
        };

        backingWorker.addEventListener("message", responseEventHandler);

        const request: WorkerRequest = {
          correlationId,
          type: "prepareTaxonomyDto",
          locale: LocaleLike.toLanguageTag(locale),
          translations,
          rawTaxonomy
        };

        backingWorker.postMessage(request);
      });
  }
}
