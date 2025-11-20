import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "../test-utils";
import { MovieList } from "../../src/components/MovieList";
import { moviesService } from "../../src/services/movies.service";
import type { MoviesResponse } from "../../src/models/movies";

// Mock the movies service
vi.mock("../../src/services/movies.service", () => ({
  moviesService: {
    getPopularMovies: vi.fn(),
  },
}));

// Mock CardMovie component for simpler testing
vi.mock("../../src/components/CardMovie", () => ({
  CardMovie: ({ movie }: { movie: { id: number; title: string } }) => (
    <div data-testid={`movie-card-${movie.id}`}>{movie.title}</div>
  ),
}));

describe("MovieList", () => {
  const createMockMoviesResponse = (
    page: number,
    totalPages: number = 3
  ): MoviesResponse => ({
    page,
    total_pages: totalPages,
    total_results: totalPages * 20,
    results: Array.from({ length: 20 }, (_, i) => ({
      id: page * 100 + i,
      title: `Movie ${page}-${i}`,
      overview: "Test overview",
      poster_path: "/test.jpg",
      backdrop_path: "/test-backdrop.jpg",
      release_date: "2024-01-01",
      vote_average: 7.5,
      vote_count: 100,
      popularity: 50,
      adult: false,
      original_language: "en",
      original_title: "Original",
      genre_ids: [1, 2],
      video: false,
    })),
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("loading state", () => {
    it("should show loading indicator initially", async () => {
      vi.mocked(moviesService.getPopularMovies).mockImplementation(
        () => new Promise(() => {}) // Never resolves
      );

      render(<MovieList />);

      expect(screen.getByText("Loading movies...")).toBeInTheDocument();
      // Check for the loader icon (SVG element with specific class)
      const loader = document.querySelector(".lucide-loader-circle");
      expect(loader).toBeInTheDocument();
    });

    it("should hide loading state after data loads", async () => {
      vi.mocked(moviesService.getPopularMovies).mockResolvedValue(
        createMockMoviesResponse(1)
      );

      render(<MovieList />);

      await waitFor(() => {
        expect(screen.queryByText("Loading movies...")).not.toBeInTheDocument();
      });
    });
  });

  describe("error state", () => {
    it("should display error message when fetching fails", async () => {
      const errorMessage = "Network error occurred";
      vi.mocked(moviesService.getPopularMovies).mockRejectedValue(
        new Error(errorMessage)
      );

      render(<MovieList />);

      await waitFor(
        () => {
          expect(screen.getByText(/Error loading movies/i)).toBeInTheDocument();
        },
        { timeout: 3000 }
      );
    });

    it("should show alert icon with error", async () => {
      vi.mocked(moviesService.getPopularMovies).mockRejectedValue(
        new Error("API Error")
      );

      render(<MovieList />);

      await waitFor(() => {
        expect(screen.getByText(/Error loading movies/i)).toBeInTheDocument();
      });

      // Alert component should be present
      const alert = screen.getByRole("alert");
      expect(alert).toBeInTheDocument();
    });

    it("should not render movies when error occurs", async () => {
      vi.mocked(moviesService.getPopularMovies).mockRejectedValue(
        new Error("Error")
      );

      render(<MovieList />);

      await waitFor(() => {
        expect(screen.getByText(/Error loading movies/i)).toBeInTheDocument();
      });

      expect(screen.queryByTestId(/movie-card-/)).not.toBeInTheDocument();
    });
  });

  describe("successful data loading", () => {
    it("should render movies from first page", async () => {
      const mockResponse = createMockMoviesResponse(1);
      vi.mocked(moviesService.getPopularMovies).mockResolvedValue(mockResponse);

      render(<MovieList />);

      await waitFor(() => {
        expect(screen.getByText("Movie 1-0")).toBeInTheDocument();
      });

      // Should render all 20 movies
      mockResponse.results.forEach((movie) => {
        expect(screen.getByText(movie.title)).toBeInTheDocument();
      });
    });

    it("should call getPopularMovies with correct initial page", async () => {
      vi.mocked(moviesService.getPopularMovies).mockResolvedValue(
        createMockMoviesResponse(1)
      );

      render(<MovieList />);

      await waitFor(() => {
        expect(moviesService.getPopularMovies).toHaveBeenCalledWith(1);
      });
    });

    it("should render movies in a grid layout", async () => {
      vi.mocked(moviesService.getPopularMovies).mockResolvedValue(
        createMockMoviesResponse(1)
      );

      const { container } = render(<MovieList />);

      await waitFor(() => {
        expect(screen.getByText("Movie 1-0")).toBeInTheDocument();
      });

      const grid = container.querySelector(".grid");
      expect(grid).toBeInTheDocument();
      expect(grid).toHaveClass("grid-cols-2");
    });
  });

  describe("infinite scroll", () => {
    it("should setup intersection observer", async () => {
      vi.mocked(moviesService.getPopularMovies).mockResolvedValue(
        createMockMoviesResponse(1)
      );

      render(<MovieList />);

      await waitFor(() => {
        expect(screen.getByText("Movie 1-0")).toBeInTheDocument();
      });

      expect(global.IntersectionObserver).toHaveBeenCalled();
    });

    it("should disconnect observer on unmount", async () => {
      vi.mocked(moviesService.getPopularMovies).mockResolvedValue(
        createMockMoviesResponse(1)
      );

      const { unmount } = render(<MovieList />);

      await waitFor(() => {
        expect(screen.getByText("Movie 1-0")).toBeInTheDocument();
      });

      const mockObserver = vi.mocked(global.IntersectionObserver).mock
        .results[0].value;

      unmount();

      expect(mockObserver.disconnect).toHaveBeenCalled();
    });
  });

  describe("observer target", () => {
    it("should render observer reference element", async () => {
      vi.mocked(moviesService.getPopularMovies).mockResolvedValue(
        createMockMoviesResponse(1)
      );

      const { container } = render(<MovieList />);

      await waitFor(() => {
        expect(screen.getByText("Movie 1-0")).toBeInTheDocument();
      });

      // Observer target should exist
      const observerTarget = container.querySelector(".h-10");
      expect(observerTarget).toBeInTheDocument();
    });
  });

  describe("empty results", () => {
    it("should handle empty results gracefully", async () => {
      const emptyResponse: MoviesResponse = {
        page: 1,
        total_pages: 1,
        total_results: 0,
        results: [],
      };
      vi.mocked(moviesService.getPopularMovies).mockResolvedValue(
        emptyResponse
      );

      render(<MovieList />);

      await waitFor(() => {
        expect(screen.queryByText("Loading movies...")).not.toBeInTheDocument();
      });

      expect(screen.queryByTestId(/movie-card-/)).not.toBeInTheDocument();
    });
  });
});
