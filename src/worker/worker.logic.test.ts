import {
  Subject,
  Taxonomy,
  TaxonomyDto,
  Work
} from "@giancosta86/omnicourse-core";
import { WorkerRequest } from "./protocol";
import { processRequest } from "./worker.logic";

describe("Processing a request", () => {
  describe("when passing an unexpected type string", () => {
    it("should throw", () => {
      expect(() => {
        processRequest({
          type: "Dodo"
        } as any);
      }).toThrow("Unsupported request type: 'Dodo'");
    });
  });

  describe("when passing a malformed raw taxonomy", () => {
    it("should return an error message", () => {
      const request: WorkerRequest = {
        correlationId: 90n,
        type: "prepareTaxonomyDto",
        locale: "en",
        translations: {},
        rawTaxonomy: {
          name: "MyTaxonomy",
          rootSubjects: {
            Alpha: {
              Beta: [
                {
                  title: "Sample Work"
                }
              ]
            }
          }
        }
      };

      const response = processRequest(request);

      if (response.type != "taxonomyError") {
        fail();
      }

      expect(response.correlationId).toBe(request.correlationId);

      expect(response.errorMessage).toBe(
        "Missing 'minutes' field in work 'Sample Work'"
      );
    });
  });

  describe("when passing a valid raw taxonomy", () => {
    describe("when not requesting translations", () => {
      it("should return a message with the returned dto", () => {
        const request: WorkerRequest = {
          correlationId: 80n,
          type: "prepareTaxonomyDto",
          locale: "en",
          translations: {},
          rawTaxonomy: {
            name: "My taxonomy",
            rootSubjects: {
              Alpha: {
                Beta: [
                  {
                    title: "Sigma",
                    minutes: 92
                  },

                  {
                    title: "Tau",
                    minutes: 95
                  }
                ],

                Gamma: [
                  {
                    title: "Ipsilon",
                    minutes: 498
                  }
                ]
              }
            }
          }
        };

        const response = processRequest(request);

        if (response.type != "taxonomyDtoReady") {
          fail();
        }

        expect(response.correlationId).toBe(request.correlationId);

        expect(response.taxonomyDto).toEqual(
          TaxonomyDto.from(
            Taxonomy.create("My taxonomy", [
              Subject.create("Alpha", [
                Subject.create("Gamma", [Work.create("Ipsilon", 498)]),

                Subject.create("Beta", [
                  Work.create("Tau", 95),
                  Work.create("Sigma", 92)
                ])
              ])
            ])
          )
        );
      });
    });

    describe("when requesting translation via a dictionary", () => {
      it("should return a message with the returned dto", () => {
        const request: WorkerRequest = {
          correlationId: 150n,
          type: "prepareTaxonomyDto",
          locale: "en",
          translations: {
            Alpha: "A",
            Beta: "B"
          },
          rawTaxonomy: {
            name: "My taxonomy",
            rootSubjects: {
              Alpha: {
                Beta: [
                  {
                    title: "Sigma",
                    minutes: 92
                  },

                  {
                    title: "Tau",
                    minutes: 95
                  }
                ],

                Gamma: [
                  {
                    title: "Ipsilon",
                    minutes: 498
                  }
                ]
              }
            }
          }
        };

        const response = processRequest(request);

        if (response.type != "taxonomyDtoReady") {
          fail();
        }

        expect(response.correlationId).toBe(request.correlationId);

        expect(response.taxonomyDto).toEqual(
          TaxonomyDto.from(
            Taxonomy.create("My taxonomy", [
              Subject.create("A", [
                Subject.create("Gamma", [Work.create("Ipsilon", 498)]),

                Subject.create("B", [
                  Work.create("Tau", 95),
                  Work.create("Sigma", 92)
                ])
              ])
            ])
          )
        );
      });
    });
  });
});
