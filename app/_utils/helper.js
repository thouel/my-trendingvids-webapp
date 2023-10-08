const getLabel = (show) => {
  return show.title ? show.title : show.name;
};

const isAuthenticated = (session) => {
  return session?.user !== undefined;
};

const refreshMyShows = async (session) => {
  // Fetch pinned shows
  await fetch('http://localhost:3000/api/shows/me', {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId: session.user.id }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.error) {
        console.error("An error occured while fetching 'My list'", data.error);
        return;
      }
      session.user = {
        ...session.user,
        myShows: data.shows,
      };
      console.log('After refresh', session);
    });
};

const isShowInMyList = (show, session) => {
  if (!session) return false;

  return session.user.pinnedShows?.find(
    (s) => s.name === (show.name || show.title)
  );
};

export { getLabel, isAuthenticated, refreshMyShows, isShowInMyList };
