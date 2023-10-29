import { useEffect, useState, useTransition } from 'react';
import { isPinned, getBaseUrl } from '@u/helper';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

export default function useShow({ id, showType, setIsShowInMyList }) {
  const [show, setShow] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const {
    data: session,
    status,
    update,
  } = useSession({
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
        setShow(one[0]);
        console.log('show in session', { show });
      } else {
        const url = `${getBaseUrl()}/api/show/${showType}/${id}`;
        console.log('fetching ShowCard', { url });

        await fetch(url, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        })
          .then((res) => res.json())
          .then((data) => {
            setShow(data);
          });
      }
      setIsShowInMyList(pinned);
      setIsLoading(show !== null);
    }
    fetchShow(showType);
  }, []);

  return { show: show, isLoading: isLoading };
}
