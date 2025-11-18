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

// Generate 2000 mock movies
const generateMockMovies = (): Movie[] => {
  const movies: Movie[] = [];
  const genres = [
    "Action",
    "Comedy",
    "Drama",
    "Horror",
    "Sci-Fi",
    "Romance",
    "Thriller",
    "Animation",
  ];
  const years = [
    "2024",
    "2023",
    "2022",
    "2021",
    "2020",
    "2019",
    "2018",
    "2017",
    "2016",
    "2015",
  ];

  for (let i = 1; i <= 2000; i++) {
    const genre = genres[i % genres.length];
    const year = years[i % years.length];
    movies.push({
      id: i,
      title: `${genre} Movie ${i}`,
      overview: `This is an exciting ${genre.toLowerCase()} movie released in ${year}. An epic adventure that will keep you on the edge of your seat with amazing plot twists and unforgettable characters.`,
      poster_path: `/poster_${i}.jpg`,
      backdrop_path: `/backdrop_${i}.jpg`,
      release_date: `${year}-${String((i % 12) + 1).padStart(2, "0")}-${String((i % 28) + 1).padStart(2, "0")}`,
      vote_average: Math.round((5 + Math.random() * 5) * 10) / 10,
      vote_count: Math.floor(Math.random() * 10000) + 100,
    });
  }

  return movies;
};

export const mockMovies = generateMockMovies();
