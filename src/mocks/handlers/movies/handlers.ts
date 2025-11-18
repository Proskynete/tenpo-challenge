import { http, passthrough } from "msw";

const endpoints = {
  popularMovies: "*/api/movies/popular",
};

const handlers = [
  http.get(endpoints.popularMovies, () => {
    return passthrough();
  }),
];

export default handlers;
