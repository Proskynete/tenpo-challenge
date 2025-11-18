import axios from "axios";
import type { MoviesResponse } from "../models/movies";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;

export const moviesService = {
  async getPopularMovies(page: number = 1): Promise<MoviesResponse> {
    const response = await axios.get<MoviesResponse>(
      `${TMDB_BASE_URL}/movie/popular`,
      {
        params: {
          api_key: TMDB_API_KEY,
          page,
          language: "es-ES", // Spanish language for better UX
        },
      }
    );
    return response.data;
  },
};
