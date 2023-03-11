import { TaxonomyPreview } from "./TaxonomyPreview";

describe("Validating a taxonomy preview collection", () => {
  describe("for valid previews", () => {
    it("should pass", () => {
      TaxonomyPreview.validateCollection([
        { id: "a", name: "Alpha" },
        { id: "b", name: "Beta" }
      ]);
    });
  });

  describe("for empty collection", () => {
    it("should throw", () => {
      expect(() => {
        TaxonomyPreview.validateCollection([]);
      }).toThrow("Empty collection of taxonomy previews!");
    });
  });

  describe("when a preview has no id", () => {
    it("should throw", () => {
      expect(() => {
        TaxonomyPreview.validateCollection([
          { id: "a", name: "Alpha" },
          { name: "Beta" } as unknown as TaxonomyPreview
        ]);
      }).toThrow('Taxonomy preview with missing/empty id: {"name":"Beta"}');
    });
  });

  describe("when a preview has no name", () => {
    it("should throw", () => {
      expect(() => {
        TaxonomyPreview.validateCollection([
          { id: "a", name: "Alpha" },
          { id: "b" } as unknown as TaxonomyPreview
        ]);
      }).toThrow('Taxonomy preview with missing/empty name: {"id":"b"}');
    });
  });

  describe("when two previews have the same id", () => {
    it("should throw", () => {
      expect(() => {
        TaxonomyPreview.validateCollection([
          { id: "w", name: "Alpha" },
          { id: "w", name: "Beta" }
        ]);
      }).toThrow("Duplicate taxonomy preview id: 'w'");
    });
  });

  describe("when two previews have the same name", () => {
    it("should throw", () => {
      expect(() => {
        TaxonomyPreview.validateCollection([
          { id: "a", name: "Alpha" },
          { id: "b", name: "Alpha" }
        ]);
      }).toThrow("Duplicate taxonomy preview name: 'Alpha'");
    });
  });

  describe("when a preview has non-string id", () => {
    it("should throw", () => {
      expect(() => {
        const taxonomyPreview = {
          id: 90,
          name: "Alpha"
        } as unknown as TaxonomyPreview;
        TaxonomyPreview.validateCollection([taxonomyPreview]);
      }).toThrow("Taxonomy preview id <90> is not a string");
    });
  });

  describe("when a preview has non-string name", () => {
    it("should throw", () => {
      expect(() => {
        const taxonomyPreview = {
          id: "a",
          name: 95
        } as unknown as TaxonomyPreview;
        TaxonomyPreview.validateCollection([taxonomyPreview]);
      }).toThrow("Taxonomy preview name <95> is not a string");
    });
  });
});
