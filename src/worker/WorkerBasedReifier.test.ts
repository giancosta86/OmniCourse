import { Subject, Taxonomy, Work } from "@giancosta86/omnicourse-core";
import { WorkerMock } from "@giancosta86/worker-mock";
import { WorkerBasedReifier } from "./WorkerBasedReifier";
import { main } from "./worker.logic";

describe("Worker-based reifier", () => {
  describe("when passing a valid raw taxonomy", () => {
    it("should work", async () => {
      const workerMock = WorkerMock.create(main);

      const reifier = WorkerBasedReifier.create(workerMock, "en", {});

      const actualTaxonomy = await reifier({
        name: "My worker-based taxonomy",
        rootSubjects: {
          Alpha: [
            {
              title: "Yogi",
              minutes: 80
            },

            {
              title: "Bubu",
              minutes: 90
            }
          ]
        }
      });

      expect(actualTaxonomy).toEqual(
        Taxonomy.create("My worker-based taxonomy", [
          Subject.create("Alpha", [
            Work.create("Bubu", 90),
            Work.create("Yogi", 80)
          ])
        ])
      );
    });
  });

  describe("when passing an invalid raw taxonomy", () => {
    it("should throw", async () => {
      const workerMock = WorkerMock.create(main);

      const reifier = WorkerBasedReifier.create(workerMock, "en", {});

      const reificationPromise = reifier({
        name: "",
        rootSubjects: {
          Alpha: [
            {
              title: "Yogi",
              minutes: 80
            }
          ]
        }
      });

      await expect(reificationPromise).rejects.toBe("Empty taxonomy name");
    });
  });
});
