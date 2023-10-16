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
  // if window is not undefined, we are running in the browser env (client side)
  if (typeof window !== 'undefined') return '';

  var res = '';

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
