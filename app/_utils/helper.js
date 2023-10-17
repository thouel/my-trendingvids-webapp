const getLabel = (show, truncate) => {
  const maxLength = 35;
  const label = show.title ? show.title : show.name;

  if (!truncate || label.length <= maxLength) return label;

  return label.substring(0, maxLength).concat('...');
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

const isDarkTheme = () =>
  localStorage.theme === 'dark' ||
  (!('theme' in localStorage) &&
    window.matchMedia('(prefers-color-scheme: dark)').matches);

export {
  getLabel,
  isAuthenticated,
  isPinned,
  isShowInMyList,
  getBaseUrl,
  isDarkTheme,
};
