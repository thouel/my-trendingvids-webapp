'use client';
import { Fragment, useEffect, useState } from 'react';
import { Dialog } from '@headlessui/react';
import {
  PlusIcon,
  CheckCircleIcon,
  ShareIcon,
} from '@heroicons/react/24/outline';
import {
  getLabel,
  isAuthenticated,
  isShowInMyList as fn_isShowInMyList,
} from '@/utils/helper';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import { isPinned } from '@/utils/helper';

export default function ShowCard({ id, showType, isModal }) {
  const {
    data: session,
    status,
    update,
  } = useSession({
    required: false,
  });
  const router = useRouter();

  const [show, setShow] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchShow(showType) {
      const pinned = isPinned(showType);

      if (pinned) {
        const { pinnedShows } = session.user;
        const one = pinnedShows.filter((ps) => ps.externalId === parseInt(id));
        setShow(one[0]);
      } else {
        await fetch(
          `${process.env.NEXT_PUBLIC_LOCAL_URL}/api/show/${showType}/${id}`,
          {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          }
        )
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

  const uri = usePathname();
  const copyToClipboard = () => {
    navigator.clipboard.writeText(process.env.NEXT_PUBLIC_LOCAL_URL + uri);
    //TODO: add a toaster notification
  };

  const [isShowInMyList, setIsShowInMyList] = useState(false);

  const addToMyList = async (show) => {
    console.log('addToMyList', show);
    if (!isAuthenticated(session)) {
      console.log('Needs to authenticate');
      return;
    }
    await fetch('/api/show', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ show: show, user: session.user }),
    })
      .then((res) => res.json())
      .then((data) => {
        const postResult = data;
        if (postResult.error) {
          // set Error Message(
          setErrorMessage(postResult.error.message);
          return;
        }
        setErrorMessage('');

        // Update the list in session
        session.user.pinnedShowsIDs.push(postResult.show.externalId);
        session.user.pinnedShows.push(postResult.show);
        update({
          pinnedShowsIDs: session.user.pinnedShowsIDs,
          pinnedShows: session.user.pinnedShows,
        });

        setIsShowInMyList(true);
      });
  };

  const removeFromMyList = async (show) => {
    console.log('removeFromMyList', { show });
    if (!isAuthenticated(session)) {
      console.log('Needs to authenticate');
      return;
    }
    const id = show.externalId ?? show.id;
    await fetch(`/api/show/${showType}/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: session.user.id }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          console.error('ERROR', data.error);
          setErrorMessage(data.error.message);
          return;
        }
        setErrorMessage('');

        console.log('data', { data });

        // remove the show from the lists in session
        var idx = session.user.pinnedShowsIDs.indexOf(data.show.id);
        session.user.pinnedShowsIDs.splice(idx, 1);
        session.user.pinnedShows.splice(idx, 1);
        update({
          pinnedShowsIDs: session.user.pinnedShowsIDs,
          pinnedShows: session.user.pinnedShows,
        });
        setIsShowInMyList(false);

        //FIXME: find another way of refreshing the ShowsCarousel
        // router.refresh();
      });
  };

  if (isLoading) {
    return null;
  }

  /*  */

  const directLinkTitle = 'Copy direct link to clipboard';
  const directLinkButton = (
    <button
      type='button'
      className='cta-button-text-with-icon'
      onClick={() => copyToClipboard()}
    >
      <ShareIcon
        className='h-6 w-6'
        alt={directLinkTitle}
        title={directLinkTitle}
      />
    </button>
  );

  const addTitle = 'Add to my list';
  const removeTitle = 'Remove from my list';
  const myListButton = isShowInMyList ? (
    <button
      type='button'
      className='cta-button-text-with-icon'
      onClick={() => removeFromMyList(show)}
    >
      <CheckCircleIcon
        className='h-6 w-6'
        alt={removeTitle}
        title={removeTitle}
      />
    </button>
  ) : (
    <button
      type='button'
      className='cta-button-icon'
      onClick={() => addToMyList(show)}
    >
      <PlusIcon className='h-6 w-6' alt={addTitle} title={addTitle} />
    </button>
  );

  const buttons = (
    <>
      {myListButton}
      {directLinkButton}
    </>
  );

  const title = isModal ? (
    <Dialog.Title as='h1' className='text-2xl font-semibold modal-title'>
      {getLabel(show)}
      {buttons}
    </Dialog.Title>
  ) : (
    <h1 className='text-2xl font-semibold'>
      {getLabel(show)}
      {buttons}
    </h1>
  );

  const description = isModal ? (
    <Dialog.Description as='p' className='mt-2 text-sm'>
      {show.overview}
    </Dialog.Description>
  ) : (
    <p className='mt-2 text-sm'>{show.overview}</p>
  );

  return (
    <Fragment>
      <div className='px-4 pb-4 pt-5 sm:p-6 sm:pb-4'>
        <div className='sm:flex-col'>
          {errorMessage !== '' && <div>{errorMessage}</div>}
          <div className=''>
            <Image
              src={
                'https://image.tmdb.org/t/p/w500' +
                (show.backdrop_path ?? show.backdropPath)
              }
              title={getLabel(show)}
              alt={getLabel(show)}
              width={2000}
              height={2000}
            />
          </div>
          <div className='mt-3 text-left'>{title}</div>
          {description}
        </div>
      </div>
    </Fragment>
  );
}
