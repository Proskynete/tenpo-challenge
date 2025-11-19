import { tmdbApi } from "../lib/api";
import type { MoviesResponse } from "../models/movies";

export const moviesService = {
  async getPopularMovies(page: number = 1): Promise<MoviesResponse> {
    const response = await tmdbApi.get<MoviesResponse>("/movie/popular", {
      params: { page },
    });
    return response.data;
  },
};
