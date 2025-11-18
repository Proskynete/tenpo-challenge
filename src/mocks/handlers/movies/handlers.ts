import { http, HttpResponse } from "msw";
import { mockMovies } from "./mock-data";

const ITEMS_PER_PAGE = 20;

const endpoints = {
  popularMovies: "*/api/movies/popular",
};

const handlers = [
  http.get(endpoints.popularMovies, ({ request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1", 10);

    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const results = mockMovies.slice(startIndex, endIndex);

    return HttpResponse.json({
      page,
      results,
      total_pages: Math.ceil(mockMovies.length / ITEMS_PER_PAGE),
      total_results: mockMovies.length,
    });
  }),
];

export default handlers;
