const getLabel = (show) => {
  return show.title ? show.title : show.name;
};

const isAuthenticated = (session) => {
  return session?.user !== undefined;
};

const isShowInMyList = (show, session) => {
  if (!session) return false;

  return session.user.pinnedShows?.find(
    (s) => s.name === (show.name || show.title)
  );
};

export { getLabel, isAuthenticated, isShowInMyList };
