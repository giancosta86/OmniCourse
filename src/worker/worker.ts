import { WorkerRequest } from "./protocol";
import { processRequest } from "./worker.logic";

self.addEventListener("message", event => {
  const request = event.data as WorkerRequest;

  const response = processRequest(request);

  self.postMessage(response);
});
