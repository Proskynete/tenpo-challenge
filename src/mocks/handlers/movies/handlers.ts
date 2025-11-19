import { http } from "msw";
import { getPopularMovies } from "./resolvers/get-polular-movies.resolver";

const endpoints = {
  popularMovies: "*/api/movies/popular",
};

const handlers = [http.get(endpoints.popularMovies, getPopularMovies)];

export default handlers;
