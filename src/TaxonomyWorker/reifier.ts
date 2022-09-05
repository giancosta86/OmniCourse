import { v4 as uuid4 } from "uuid";
import { RawTaxonomy, TaxonomyReifier } from "../input/raw";
import { Taxonomy } from "../Taxonomy";
import { MessageFromWorker, MessageToWorker } from "./protocol";

export function createTaxonomyReifierFromWorker(
  taxonomyWorker: Worker
): TaxonomyReifier {
  return function (
    taxonomyName: string,
    rawTaxonomy: RawTaxonomy
  ): Promise<Taxonomy> {
    return new Promise<Taxonomy>((resolve, reject) => {
      const correlationId = uuid4();

      const eventHandler = (event: MessageEvent<MessageFromWorker>) => {
        const responseMessage = event.data;

        if (responseMessage.correlationId != correlationId) {
          return;
        }

        taxonomyWorker.removeEventListener("message", eventHandler);

        switch (responseMessage.type) {
          case "taxonomyReady":
            return resolve(responseMessage.taxonomy);

          case "taxonomyError":
            return reject(responseMessage.errorMessage);
        }
      };

      taxonomyWorker.addEventListener("message", eventHandler);

      const requestMessage: MessageToWorker = {
        type: "computeTaxonomy",
        correlationId,
        taxonomyName,
        rawTaxonomy
      };

      taxonomyWorker.postMessage(requestMessage);
    });
  };
}
