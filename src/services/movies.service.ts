import axios from "axios";

const API_BASE_URL = "/api/movies";

export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
  vote_count: number;
}

export interface MoviesResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export const moviesService = {
  async getPopularMovies(page: number = 1): Promise<MoviesResponse> {
    const response = await axios.get<MoviesResponse>(
      `${API_BASE_URL}/popular`,
      {
        params: { page },
      }
    );
    return response.data;
  },
};
