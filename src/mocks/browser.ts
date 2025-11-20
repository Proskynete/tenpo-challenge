import { setupWorker } from "msw/browser";

import { handlers } from "./handlers";

export const worker = setupWorker(...handlers);

export const mockWorker = {
  start: () => worker.start(),
  reset: () => worker.resetHandlers(),
  stop: () => worker.stop(),
};
