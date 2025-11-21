import { useTranslation } from "react-i18next";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { Movie } from "@/models/movies";
import { formatDate } from "@/utils/date";

export const CardMovie = ({ movie }: { movie: Movie }) => {
  const { t } = useTranslation();
  const rating = Math.round(movie.vote_average * 10);

  const getRatingColor = (score: number) => {
    if (score >= 70) return "bg-emerald-600";
    if (score >= 50) return "bg-amber-600";
    return "bg-red-800";
  };

  return (
    <Card className="h-full overflow-hidden transition-shadow hover:shadow-lg">
      <CardContent className="flex flex-col h-full p-0">
        <div className="relative">
          {movie.backdrop_path ? (
            <img
              src={`https://media.themoviedb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              className="object-cover w-full aspect-2/3"
              loading="lazy"
            />
          ) : (
            <div className="w-full bg-gray-300 aspect-2/3">
              <div className="flex items-center justify-center w-full h-full bg-gray-400">
                {t("common.noImage")}
              </div>
            </div>
          )}

          <div className="absolute bottom-3 left-3">
            {movie.vote_count !== 0 ? (
              <Badge
                className={`${getRatingColor(rating)} text-white rounded-full h-10 w-10 flex items-center justify-center text-xs font-bold p-0 shadow-lg border-0 border-background`}
              >
                {rating}%
              </Badge>
            ) : (
              <Badge>{t("common.noVotes")}</Badge>
            )}
          </div>
        </div>

        <div className="flex flex-col flex-1 p-4 space-y-1">
          <h3 className="flex-1 text-base font-semibold line-clamp-2">
            {movie.title}
          </h3>
          <p className="text-sm text-zinc-500">
            {formatDate(movie.release_date)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
