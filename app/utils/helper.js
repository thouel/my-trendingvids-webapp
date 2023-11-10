const getLabel = (show, truncate) => {
  const maxLength = 35;
  const label = show.title ? show.title : show.name;

  if (!truncate || label.length <= maxLength) return label;

  return label.substring(0, maxLength).concat('...');
};

const isAuthenticated = (session) => {
  return session?.user !== undefined;
};

const removePrefixFromShowType = (showType) => {
  return showType.indexOf('p-') > -1 ? showType.substring(2) : showType;
};

const areMyShowsRequested = (showType) => {
  return showType.indexOf('p-') > -1;
};

const isShowInMyList = (id, session) => {
  if (!session) return false;

  return session.user.pinnedShows.some((s) => s.externalId == id);
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
  return res;
};

const getHref = (href) => {
  return href === null || href === '' ? '#' : href;
};

const isDarkTheme = () =>
  localStorage.theme === 'dark' ||
  (!('theme' in localStorage) &&
    window.matchMedia('(prefers-color-scheme: dark)').matches);

export {
  getLabel,
  isAuthenticated,
  removePrefixFromShowType,
  areMyShowsRequested,
  isShowInMyList,
  getBaseUrl,
  isDarkTheme,
  getHref,
};
