import { handlers as authHandlers } from "./auth";
import { handlers as movieHadlers } from "./movies";

export const handlers = [...authHandlers, ...movieHadlers];
