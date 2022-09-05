import { Taxonomy } from "../Taxonomy";
import { RawTaxonomy } from "../input/raw";

type WithCorrelationId = Readonly<{ correlationId: string }>;

export type MessageToWorker = Readonly<
  WithCorrelationId & {
    type: "computeTaxonomy";
    taxonomyName: string;
    rawTaxonomy: RawTaxonomy;
  }
>;

export type MessageFromWorker = Readonly<
  WithCorrelationId &
    (
      | {
          type: "taxonomyReady";
          taxonomy: Taxonomy;
        }
      | {
          type: "taxonomyError";
          errorMessage: string;
        }
    )
>;
