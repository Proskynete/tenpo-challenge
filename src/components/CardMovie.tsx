import type { Movie } from "@/models/movies";
import { formatDate } from "@/utils/date";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const CardMovie = ({ movie }: { movie: Movie }) => {
  // Convert vote_average (0-10) to percentage
  const rating = Math.round(movie.vote_average * 10);

  // Determine rating color based on score
  const getRatingColor = (score: number) => {
    if (score >= 70) return "bg-green-600";
    if (score >= 50) return "bg-yellow-600";
    return "bg-red-600";
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full">
      <CardContent className="p-0 h-full flex flex-col">
        <div className="relative">
          <img
            src={`https://media.themoviedb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            className="w-full aspect-[2/3] object-cover"
            loading="lazy"
          />
          {/* Rating Badge - positioned at bottom left */}
          <div className="absolute bottom-3 left-3">
            <Badge
              className={`${getRatingColor(rating)} text-white rounded-full h-12 w-12 flex items-center justify-center text-sm font-bold p-0 shadow-lg border-4 border-background`}
            >
              {rating}%
            </Badge>
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
