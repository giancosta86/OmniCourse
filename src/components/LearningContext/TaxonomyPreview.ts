import { HashSet } from "@rimbu/hashed";
import { Iterable } from "@giancosta86/stream-utils";
import { TaxonomyId } from "@giancosta86/omnicourse-core";

export type TaxonomyPreview = Readonly<{
  id: TaxonomyId;
  name: string;
}>;

export namespace TaxonomyPreview {
  export function validateCollection(
    previews: Iterable<TaxonomyPreview>
  ): void {
    if (Iterable.isEmpty(previews)) {
      throw new Error("Empty collection of taxonomy previews!");
    }

    ensureUniqueFieldValueInPreviews(previews, "id");
    ensureUniqueFieldValueInPreviews(previews, "name");
  }
}

function ensureUniqueFieldValueInPreviews(
  previews: Iterable<TaxonomyPreview>,
  fieldName: keyof TaxonomyPreview
) {
  const uniqueValues = HashSet.builder<string>();

  for (const preview of previews) {
    const fieldValue = preview[fieldName];

    if (fieldValue == null || fieldValue === "") {
      throw new Error(
        `Taxonomy preview with missing/empty ${fieldName}: ${JSON.stringify(
          preview
        )}`
      );
    }

    if (typeof fieldValue != "string") {
      throw new Error(
        `Taxonomy preview ${fieldName} <${fieldValue}> is not a string`
      );
    }

    if (!uniqueValues.add(fieldValue)) {
      throw new Error(
        `Duplicate taxonomy preview ${fieldName}: '${fieldValue}'`
      );
    }
  }
}
