import { beforeEach, describe, expect, it, vi } from "vitest";

import { tmdbApi } from "../../src/lib/api";
import type { MoviesResponse } from "../../src/models/movies";
import { moviesService } from "../../src/services/movies.service";

// Mock the API module
vi.mock("../../src/lib/api", () => ({
  tmdbApi: {
    get: vi.fn(),
  },
}));

describe("moviesService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getPopularMovies", () => {
    it("should fetch popular movies with default page", async () => {
      const mockResponse: MoviesResponse = {
        page: 1,
        results: [
          {
            id: 1,
            title: "Test Movie 1",
            overview: "Test overview",
            poster_path: "/test1.jpg",
            backdrop_path: "/backdrop1.jpg",
            release_date: "2024-01-01",
            vote_average: 8.5,
            vote_count: 1000,
            popularity: 100,
            adult: false,
            original_language: "en",
            original_title: "Test Movie 1",
            genre_ids: [1, 2, 3],
            video: false,
          },
          {
            id: 2,
            title: "Test Movie 2",
            overview: "Another test",
            poster_path: "/test2.jpg",
            backdrop_path: "/backdrop2.jpg",
            release_date: "2024-02-01",
            vote_average: 7.5,
            vote_count: 500,
            popularity: 90,
            adult: false,
            original_language: "en",
            original_title: "Test Movie 2",
            genre_ids: [4, 5],
            video: false,
          },
        ],
        total_pages: 10,
        total_results: 200,
      };

      vi.mocked(tmdbApi.get).mockResolvedValue({ data: mockResponse });

      const result = await moviesService.getPopularMovies();

      expect(tmdbApi.get).toHaveBeenCalledWith("/movie/popular", {
        params: { page: 1 },
      });
      expect(result).toEqual(mockResponse);
      expect(result.results).toHaveLength(2);
    });

    it("should fetch popular movies with specific page number", async () => {
      const mockResponse: MoviesResponse = {
        page: 3,
        results: [],
        total_pages: 10,
        total_results: 200,
      };

      vi.mocked(tmdbApi.get).mockResolvedValue({ data: mockResponse });

      const result = await moviesService.getPopularMovies(3);

      expect(tmdbApi.get).toHaveBeenCalledWith("/movie/popular", {
        params: { page: 3 },
      });
      expect(result.page).toBe(3);
    });

    it("should return empty results array when no movies found", async () => {
      const mockResponse: MoviesResponse = {
        page: 1,
        results: [],
        total_pages: 0,
        total_results: 0,
      };

      vi.mocked(tmdbApi.get).mockResolvedValue({ data: mockResponse });

      const result = await moviesService.getPopularMovies();

      expect(result.results).toEqual([]);
      expect(result.total_results).toBe(0);
    });

    it("should handle API errors", async () => {
      const error = new Error("API error");
      vi.mocked(tmdbApi.get).mockRejectedValue(error);

      await expect(moviesService.getPopularMovies()).rejects.toThrow(
        "API error"
      );
    });

    it("should fetch page 2 movies", async () => {
      const mockResponse: MoviesResponse = {
        page: 2,
        results: [
          {
            id: 3,
            title: "Page 2 Movie",
            overview: "Second page movie",
            poster_path: "/test3.jpg",
            backdrop_path: "/backdrop3.jpg",
            release_date: "2024-03-01",
            vote_average: 9.0,
            vote_count: 2000,
            popularity: 150,
            adult: false,
            original_language: "en",
            original_title: "Page 2 Movie",
            genre_ids: [1],
            video: false,
          },
        ],
        total_pages: 10,
        total_results: 200,
      };

      vi.mocked(tmdbApi.get).mockResolvedValue({ data: mockResponse });

      const result = await moviesService.getPopularMovies(2);

      expect(tmdbApi.get).toHaveBeenCalledWith("/movie/popular", {
        params: { page: 2 },
      });
      expect(result.page).toBe(2);
      expect(result.results).toHaveLength(1);
    });

    it("should include pagination metadata", async () => {
      const mockResponse: MoviesResponse = {
        page: 1,
        results: [],
        total_pages: 50,
        total_results: 1000,
      };

      vi.mocked(tmdbApi.get).mockResolvedValue({ data: mockResponse });

      const result = await moviesService.getPopularMovies();

      expect(result.page).toBe(1);
      expect(result.total_pages).toBe(50);
      expect(result.total_results).toBe(1000);
    });

    it("should handle network timeout errors", async () => {
      const timeoutError = new Error("Request timeout");
      vi.mocked(tmdbApi.get).mockRejectedValue(timeoutError);

      await expect(moviesService.getPopularMovies()).rejects.toThrow(
        "Request timeout"
      );
    });

    it("should handle 404 errors", async () => {
      const notFoundError = new Error("Not found");
      vi.mocked(tmdbApi.get).mockRejectedValue(notFoundError);

      await expect(moviesService.getPopularMovies()).rejects.toThrow(
        "Not found"
      );
    });

    it("should fetch last page", async () => {
      const mockResponse: MoviesResponse = {
        page: 500,
        results: [
          {
            id: 9999,
            title: "Last Movie",
            overview: "Last movie on last page",
            poster_path: "/last.jpg",
            backdrop_path: "/backdrop-last.jpg",
            release_date: "2024-12-31",
            vote_average: 6.0,
            vote_count: 10,
            popularity: 5,
            adult: false,
            original_language: "en",
            original_title: "Last Movie",
            genre_ids: [],
            video: false,
          },
        ],
        total_pages: 500,
        total_results: 10000,
      };

      vi.mocked(tmdbApi.get).mockResolvedValue({ data: mockResponse });

      const result = await moviesService.getPopularMovies(500);

      expect(result.page).toBe(500);
      expect(result.total_pages).toBe(500);
    });
  });
});
