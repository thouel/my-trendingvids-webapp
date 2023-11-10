export function ExternalToDB() {
  return {
    show: (show) => {
      return {
        externalId: show.id,
        adult: show.adult,
        backdropPath: show.backdrop_path,
        name: show.name ?? show.title,
        originalLanguage: show.original_language,
        originalName: show.original_name ?? show.original_title,
        overview: show.overview,
        posterPath: show.poster_path,
        mediaType: show.number_of_seasons ? 'tv' : 'movie',
        popularity: show.popularity,
        voteAverage: show.vote_average,
        voteCount: show.vote_count,
        numberOfSeasons: show.number_of_seasons ?? 0,
        homepage: show.homepage ?? '',
        imdbId: show.external_ids?.imdb_id,
      };
    },

    networks: (networks) => {
      const res = [];
      networks?.map((n) => {
        res.push({
          name: n.name,
          externalId: n.id,
          logoPath: n.logo_path,
        });
      });
      return res;
    },
  };
}
