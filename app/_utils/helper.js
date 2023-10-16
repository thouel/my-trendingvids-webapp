const getLabel = (show) => {
  return show.title ? show.title : show.name;
};

const isAuthenticated = (session) => {
  return session?.user !== undefined;
};

const isPinned = (showType) => {
  return showType.indexOf('p-') > -1;
};

const isShowInMyList = (show, session) => {
  if (!session) return false;

  return session.user.pinnedShows?.find(
    (s) => s.name === (show.name || show.title)
  );
};

const getBaseUrl = () => {
  // if running on server, do not need anything
  if (typeof window !== 'undefined') return '';

  var res = '';
  // if running on client, needs to check if we''re
  // on vercel or local
  const vc = process.env.VERCEL_URL;
  if (vc) {
    res = `https://${vc}`;
  } else {
    res = `${process.env.LOCAL_URL}`;
  }
  console.log('res', { res });
  return res;
};

export { getLabel, isAuthenticated, isPinned, isShowInMyList, getBaseUrl };
