import { describe, expect, it, vi } from "vitest";

import { CardMovie } from "../../src/components/CardMovie";
import type { Movie } from "../../src/models/movies";
import * as dateUtils from "../../src/utils/date";
import { render, screen } from "../test-utils";

// Mock date utility
vi.mock("../../src/utils/date", () => ({
  formatDate: vi.fn(),
}));

describe("CardMovie", () => {
  const createMockMovie = (overrides?: Partial<Movie>): Movie => ({
    id: 1,
    title: "Test Movie",
    overview: "Test overview",
    poster_path: "/test-poster.jpg",
    backdrop_path: "/test-backdrop.jpg",
    release_date: "2024-01-15",
    vote_average: 7.5,
    vote_count: 100,
    popularity: 50.5,
    adult: false,
    original_language: "en",
    original_title: "Test Movie Original",
    genre_ids: [1, 2, 3],
    video: false,
    ...overrides,
  });

  beforeEach(() => {
    vi.mocked(dateUtils.formatDate).mockReturnValue("Jan 15, 2024");
  });

  describe("rendering", () => {
    it("should render movie title", () => {
      const movie = createMockMovie({ title: "Amazing Movie" });
      render(<CardMovie movie={movie} />);

      expect(screen.getByText("Amazing Movie")).toBeInTheDocument();
    });

    it("should render formatted release date", () => {
      const movie = createMockMovie({ release_date: "2024-03-20" });
      vi.mocked(dateUtils.formatDate).mockReturnValue("Mar 20, 2024");

      render(<CardMovie movie={movie} />);

      expect(dateUtils.formatDate).toHaveBeenCalledWith("2024-03-20");
      expect(screen.getByText("Mar 20, 2024")).toBeInTheDocument();
    });

    it("should render movie poster with correct src", () => {
      const movie = createMockMovie({ poster_path: "/movie-poster.jpg" });
      render(<CardMovie movie={movie} />);

      const img = screen.getByRole("img", { name: movie.title });
      expect(img).toHaveAttribute(
        "src",
        "https://media.themoviedb.org/t/p/w500/movie-poster.jpg"
      );
    });

    it("should render movie poster with lazy loading", () => {
      const movie = createMockMovie();
      render(<CardMovie movie={movie} />);

      const img = screen.getByRole("img");
      expect(img).toHaveAttribute("loading", "lazy");
    });
  });

  describe("rating badge", () => {
    it("should display rating percentage when movie has votes", () => {
      const movie = createMockMovie({ vote_average: 8.5, vote_count: 200 });
      render(<CardMovie movie={movie} />);

      expect(screen.getByText("85%")).toBeInTheDocument();
    });

    it("should display green badge for high ratings (>=70%)", () => {
      const movie = createMockMovie({ vote_average: 8.5, vote_count: 100 });
      render(<CardMovie movie={movie} />);

      const badge = screen.getByText("85%");
      expect(badge).toHaveClass("bg-green-600");
    });

    it("should display yellow badge for medium ratings (50-69%)", () => {
      const movie = createMockMovie({ vote_average: 6.0, vote_count: 100 });
      render(<CardMovie movie={movie} />);

      const badge = screen.getByText("60%");
      expect(badge).toHaveClass("bg-yellow-600");
    });

    it("should display red badge for low ratings (<50%)", () => {
      const movie = createMockMovie({ vote_average: 4.0, vote_count: 100 });
      render(<CardMovie movie={movie} />);

      const badge = screen.getByText("40%");
      expect(badge).toHaveClass("bg-red-600");
    });

    it("should round rating to nearest integer", () => {
      const movie = createMockMovie({ vote_average: 7.456, vote_count: 100 });
      render(<CardMovie movie={movie} />);

      expect(screen.getByText("75%")).toBeInTheDocument();
    });

    it("should display 'No Votes' when vote count is zero", () => {
      const movie = createMockMovie({ vote_count: 0 });
      render(<CardMovie movie={movie} />);

      expect(screen.getByText("No Votes")).toBeInTheDocument();
      expect(screen.queryByText(/%$/)).not.toBeInTheDocument();
    });

    it("should handle edge case of exactly 70% rating", () => {
      const movie = createMockMovie({ vote_average: 7.0, vote_count: 100 });
      render(<CardMovie movie={movie} />);

      const badge = screen.getByText("70%");
      expect(badge).toHaveClass("bg-green-600");
    });

    it("should handle edge case of exactly 50% rating", () => {
      const movie = createMockMovie({ vote_average: 5.0, vote_count: 100 });
      render(<CardMovie movie={movie} />);

      const badge = screen.getByText("50%");
      expect(badge).toHaveClass("bg-yellow-600");
    });
  });

  describe("poster image handling", () => {
    it("should display placeholder when backdrop_path is null", () => {
      const movie = createMockMovie({ backdrop_path: null });
      render(<CardMovie movie={movie} />);

      expect(screen.getByText("No Image")).toBeInTheDocument();
      expect(screen.queryByRole("img")).not.toBeInTheDocument();
    });

    it("should display image when backdrop_path exists", () => {
      const movie = createMockMovie({ backdrop_path: "/valid-path.jpg" });
      render(<CardMovie movie={movie} />);

      expect(screen.queryByText("No Image")).not.toBeInTheDocument();
      expect(screen.getByRole("img")).toBeInTheDocument();
    });

    it("should display placeholder with proper styling", () => {
      const movie = createMockMovie({ backdrop_path: null });
      render(<CardMovie movie={movie} />);

      const placeholder = screen.getByText("No Image");
      expect(placeholder).toBeInTheDocument();

      // Check that placeholder parent has gray background (either inner or outer div)
      const placeholderParent = placeholder.parentElement;
      expect(placeholderParent).toHaveClass("w-full");
      expect(placeholderParent).toHaveClass("bg-gray-300");
    });
  });

  describe("accessibility", () => {
    it("should have alt text for movie poster", () => {
      const movie = createMockMovie({ title: "Accessible Movie" });
      render(<CardMovie movie={movie} />);

      const img = screen.getByAltText("Accessible Movie");
      expect(img).toBeInTheDocument();
    });

    it("should maintain proper heading hierarchy", () => {
      const movie = createMockMovie({ title: "Movie Title" });
      render(<CardMovie movie={movie} />);

      const heading = screen.getByRole("heading", { level: 3 });
      expect(heading).toHaveTextContent("Movie Title");
    });
  });

  describe("long titles", () => {
    it("should handle very long movie titles", () => {
      const longTitle =
        "This is an extremely long movie title that should be truncated with line clamp";
      const movie = createMockMovie({ title: longTitle });
      render(<CardMovie movie={movie} />);

      const titleElement = screen.getByText(longTitle);
      expect(titleElement).toHaveClass("line-clamp-2");
    });

    it("should handle single character title", () => {
      const movie = createMockMovie({ title: "A" });
      render(<CardMovie movie={movie} />);

      expect(screen.getByText("A")).toBeInTheDocument();
    });
  });

  describe("hover effects", () => {
    it("should have hover shadow class on card", () => {
      const movie = createMockMovie();
      const { container } = render(<CardMovie movie={movie} />);

      const card = container.querySelector(".hover\\:shadow-lg");
      expect(card).toBeInTheDocument();
    });
  });

  describe("rating calculation", () => {
    it("should handle zero vote average", () => {
      const movie = createMockMovie({ vote_average: 0, vote_count: 50 });
      render(<CardMovie movie={movie} />);

      expect(screen.getByText("0%")).toBeInTheDocument();
    });

    it("should handle maximum vote average", () => {
      const movie = createMockMovie({ vote_average: 10, vote_count: 50 });
      render(<CardMovie movie={movie} />);

      expect(screen.getByText("100%")).toBeInTheDocument();
    });

    it("should handle decimal vote averages correctly", () => {
      const movie = createMockMovie({ vote_average: 8.95, vote_count: 50 });
      render(<CardMovie movie={movie} />);

      expect(screen.getByText("90%")).toBeInTheDocument();
    });
  });
});
