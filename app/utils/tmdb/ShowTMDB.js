export function ShowTMDB() {
  return {
    get: async (showType, externalId) => {
      const st = showType === 'movies' ? 'movie' : 'tv';
      const url = `https://api.themoviedb.org/3/${st}/${externalId}?language=en-EN&append_to_response=external_ids`;
      console.log(`/show/${st}/${externalId} url`, { url });

      var errorMsg;
      var res = {};

      await fetch(url, {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
        },
      })
        .then((res) => res.json())
        .then((json) => {
          if (json.success != undefined && json.success === false) {
            throw Error(json.status_message);
          }
          res.show = json;
        })
        .catch((e) => {
          errorMsg = e.message;
        });

      if (errorMsg) {
        res.error = { message: errorMsg };
      }
      return res;
    },
  };
}
