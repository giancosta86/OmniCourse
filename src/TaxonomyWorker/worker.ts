import { toTaxonomy } from "../input/raw";
import { MessageFromWorker, MessageToWorker } from "./protocol";

self.addEventListener("message", event => {
  const message = event.data as MessageToWorker;

  switch (message.type) {
    case "computeTaxonomy":
      computeTaxonomy(message);
      return;
  }
});

function computeTaxonomy({
  correlationId,
  taxonomyName,
  rawTaxonomy
}: MessageToWorker & { type: "computeTaxonomy" }) {
  try {
    const taxonomy = toTaxonomy(taxonomyName, rawTaxonomy);
    const taxonomyMessage: MessageFromWorker = {
      type: "taxonomyReady",
      correlationId,
      taxonomy
    };
    self.postMessage(taxonomyMessage);
  } catch (err) {
    const errorMessage: MessageFromWorker = {
      type: "taxonomyError",
      correlationId,
      errorMessage: err instanceof Error ? err.message : String(err)
    };
    self.postMessage(errorMessage);
  }
}
