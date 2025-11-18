import { handlers as authHandlers } from "./auth";
import moviesHandlers from "./movies/handlers";

export const handlers = [...authHandlers, ...moviesHandlers];
