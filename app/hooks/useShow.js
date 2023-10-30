import { useEffect } from 'react';
import { isPinned, getBaseUrl } from 'app/_utils/helper';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

export default function useShow({ id, showType }) {
  // const [show, setShow] = useState(null);
  // const [errorMessage, setErrorMessage] = useState('');
  // const [isLoading, setIsLoading] = useState(true);
  // const [isShowInMyList, setIsShowInMyList] = useState(false);
  let resShow = null;
  let resErrorMessage = '';
  let resIsLoading = true;
  let resIsShowInMyList = false;
  const { data: session } = useSession({
    required: false,
  });

  useEffect(() => {
    async function fetchShow(showType) {
      const pinned = isPinned(showType);

      if (pinned && !session) {
        redirect('/');
      }

      if (pinned) {
        const { pinnedShows } = session.user;
        const one = pinnedShows.filter((ps) => ps.externalId === parseInt(id));
        resShow = one[0];
        console.log('show in session', { resShow });
      } else {
        const url = `${getBaseUrl()}/api/show/${showType}/${id}`;
        console.log('fetching ShowCard', { url });

        await fetch(url, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        })
          .then((res) => res.json())
          .then(({ error, show }) => {
            resErrorMessage = error?.message ?? '';
            resShow = show;
          });
      }
      resIsShowInMyList = pinned;
      resIsLoading = resShow !== null;
    }
    fetchShow(showType);
  }, []);

  return {
    show: resShow,
    isLoading: resIsLoading,
    errorMessage: resErrorMessage,
    isShowInMyList: resIsShowInMyList,
  };
}
