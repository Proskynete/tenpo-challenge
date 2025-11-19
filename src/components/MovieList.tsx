import { useRef, useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useTranslation } from "react-i18next";
import { moviesService } from "../services/movies.service";
import type { Movie } from "../models/movies";
import { formatDate } from "../utils/date";
import { formatNumber } from "../utils/number";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";

export const MovieList = () => {
  const { t } = useTranslation();
  const parentRef = useRef<HTMLDivElement>(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteQuery({
    queryKey: ["movies", "popular"],
    queryFn: ({ pageParam = 1 }) => moviesService.getPopularMovies(pageParam),
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.total_pages) {
        return lastPage.page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
  });

  const allMovies: Movie[] = data?.pages.flatMap((page) => page.results) || [];

  const rowVirtualizer = useVirtualizer({
    count: allMovies.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 200,
    overscan: 5,
  });

  const virtualItems = rowVirtualizer.getVirtualItems();

  useEffect(() => {
    const [lastItem] = [...virtualItems].reverse();

    if (!lastItem) return;

    if (
      lastItem.index >= allMovies.length - 1 &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      fetchNextPage();
    }
  }, [
    virtualItems,
    allMovies.length,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  ]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-16 w-16 animate-spin text-primary" />
          <p className="text-muted-foreground">{t("movies.loading")}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {t("movies.errorLoading")}: {(error as Error).message}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div>
      <div className="mb-4 text-sm text-gray-600 flex gap-1">
        {t("common.showing")}{" "}
        <span className="font-bold">{formatNumber(allMovies.length)}</span>
        {t("common.of")}
        <span className="font-bold">
          {formatNumber(data?.pages[0]?.total_results || 0)}
        </span>
        {t("movies.movies")}
      </div>

      <div
        ref={parentRef}
        className="h-[calc(100vh-250px)] overflow-auto border border-gray-200 rounded-lg"
        style={{ contain: "strict" }}
      >
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: "100%",
            position: "relative",
          }}
        >
          {virtualItems.map((virtualRow) => {
            const movie = allMovies[virtualRow.index];
            return (
              <div
                key={movie.id}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: `${virtualRow.size}px`,
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              >
                <div className="p-4 border-b border-gray-100 hover:bg-gray-50 transition">
                  <div className="flex gap-4">
                    <div className="shrink-0 w-24 h-36 bg-linear-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center text-gray-500 text-xs">
                      <img
                        src={`https://media.themoviedb.org/t/p/w220_and_h330_face/${movie.poster_path}`}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2 truncate">
                        {movie.title}
                      </h3>
                      <div className="flex items-center gap-4 mb-2 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <svg
                            className="w-4 h-4 text-yellow-500"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          {movie.vote_average.toFixed(1)}
                        </span>
                        <span>
                          {formatNumber(movie.vote_count)} {t("movies.votes")}
                        </span>
                        <time dateTime={movie.release_date}>
                          {formatDate(movie.release_date)}
                        </time>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-3">
                        {movie.overview || t("common.noDescription")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {isFetchingNextPage && (
        <div className="mt-4 text-center">
          <div className="inline-flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            {t("movies.loadingMore")}
          </div>
        </div>
      )}
    </div>
  );
};
