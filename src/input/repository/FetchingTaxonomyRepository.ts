import { Taxonomy } from "../../Taxonomy";
import { RawTaxonomy, toTaxonomy } from "../raw";
import { TaxonomyKey } from "./TaxonomyKey";
import { TaxonomyRepository } from "./TaxonomyRepository";

export type RawTaxonomyFetcher = (taxonomyId: string) => Promise<RawTaxonomy>;

export class FetchingTaxonomyRepository implements TaxonomyRepository {
  constructor(private readonly rawTaxonomyFetcher: RawTaxonomyFetcher) {}

  async getByKey(taxonomyKey: TaxonomyKey): Promise<Taxonomy> {
    const rawTaxonomy = await this.rawTaxonomyFetcher(taxonomyKey.id);

    return toTaxonomy(taxonomyKey.name, rawTaxonomy);
  }
}
