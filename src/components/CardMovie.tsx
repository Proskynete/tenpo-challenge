import type { Movie } from "@/models/movies";
import { formatDate } from "@/utils/date";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";

export const CardMovie = ({ movie }: { movie: Movie }) => {
  const { t } = useTranslation();
  const rating = Math.round(movie.vote_average * 10);

  const getRatingColor = (score: number) => {
    if (score >= 70) return "bg-green-600";
    if (score >= 50) return "bg-yellow-600";
    return "bg-red-600";
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full">
      <CardContent className="p-0 h-full flex flex-col">
        <div className="relative">
          {movie.backdrop_path ? (
            <img
              src={`https://media.themoviedb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              className="w-full aspect-2/3 object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-full aspect-2/3 bg-gray-300">
              <div className="w-full h-full bg-gray-400 flex justify-center items-center">
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

        <div className="p-4 space-y-1 flex-1 flex flex-col">
          <h3 className="font-semibold text-base line-clamp-2 flex-1">
            {movie.title}
          </h3>
          <p className="text-sm text-muted-foreground">
            {formatDate(movie.release_date)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
