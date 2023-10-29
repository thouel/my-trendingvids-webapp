'use client';
import { Fragment, useState } from 'react';
import { Dialog } from '@headlessui/react';
import {
  PlusIcon,
  CheckCircleIcon,
  LinkIcon,
  HomeIcon,
  InformationCircleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from '@heroicons/react/24/outline';
import { getLabel, isAuthenticated } from '@u/helper';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { useUrl } from 'nextjs-current-url';
import useShow from 'app/hooks/useShow';

export default function ShowCard({ id, showType, isModal }) {
  const {
    data: session,
    status,
    update,
  } = useSession({
    required: false,
  });
  // const [show, setShow] = useState(null);
  // const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [isCTAOpen, setIsCTAOpen] = useState(false);
  const [isShowInMyList, setIsShowInMyList] = useState(false);

  const { show, isLoading } = useShow({
    id: id,
    showType: showType,
    setIsShowInMyList: setIsShowInMyList,
  });

  console.log('isLoading and show', { isLoading, show });

  const { href: currentUrl } = useUrl() ?? {};
  const copyToClipboard = () => {
    navigator.clipboard.writeText(currentUrl);
    //TODO: add a toaster notification
  };

  const toggleIsCTAOpen = () => {
    setIsCTAOpen(!isCTAOpen);
  };

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
        // revalidate(/shows/${showType});
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
      className='text-gray-600 hover:text-orange-600'
      onClick={() => copyToClipboard()}
    >
      <LinkIcon
        className='w-6 h-6'
        alt={directLinkTitle}
        title={directLinkTitle}
      />
    </button>
  );
  const homepageTitle = 'Go to homepage';
  const homepageButton = (
    <a
      target='_blank'
      href={show.homepage}
      className='text-gray-600 hover:text-orange-600'
    >
      <HomeIcon className='w-6 h-6' alt={homepageTitle} title={homepageTitle} />
    </a>
  );
  const imdbTitle = 'Go to IMDb';
  const imdbButton = (
    <a
      target='_blank'
      href={
        'https://www.imdb.com/title/' +
        (show.external_ids?.imdb_id ?? show.imdbId)
      }
      className='text-gray-600 hover:text-orange-600'
    >
      <InformationCircleIcon
        className='w-6 h-6'
        alt={imdbTitle}
        title={imdbTitle}
      />
    </a>
  );

  const addTitle = 'Add to my list';
  const removeTitle = 'Remove from my list';
  const myListButton = isShowInMyList ? (
    <button
      type='button'
      className='text-gray-600 hover:text-orange-600 '
      onClick={() => removeFromMyList(show)}
    >
      <CheckCircleIcon
        className='w-6 h-6'
        alt={removeTitle}
        title={removeTitle}
      />
    </button>
  ) : (
    <button
      type='button'
      className='text-gray-600 hover:text-orange-600'
      onClick={() => addToMyList(show)}
    >
      <PlusIcon className='w-6 h-6' alt={addTitle} title={addTitle} />
    </button>
  );

  const closeCTATitle = 'Close Menu';
  const closeCTAButton = (
    <button
      type='button'
      className='text-gray-600 hover:text-orange-600'
      onClick={toggleIsCTAOpen}
    >
      <ChevronUpIcon
        className='w-6 h-6'
        alt={closeCTATitle}
        title={closeCTATitle}
      />
    </button>
  );

  const openCTATitle = 'Open Menu';
  const openCTAButton = (
    <button
      type='button'
      className='text-gray-600 hover:text-orange-600'
      onClick={toggleIsCTAOpen}
    >
      <ChevronDownIcon
        className='w-6 h-6'
        alt={openCTATitle}
        title={openCTATitle}
      />
    </button>
  );

  const ctaButtons = (
    <div
      className={
        'px-3 py-1 bg-gray-200 flex justify-evenly gap-3 rounded-none ' +
        (isCTAOpen ? 'rounded-tr-none' : '')
      }
    >
      {myListButton}
      {directLinkButton}
      {homepageButton}
      {imdbButton}
    </div>
  );

  const label = getLabel(show);
  const labelLength = label.length;
  const buttonsStructure = (
    <>
      <div
        className={
          'text-orange-600 text-clip w-2/3 text-start ' +
          (labelLength > 20 ? 'text-sm sm:text-lg' : 'text-lg sm:text-xl')
        }
        title={getLabel(show)}
      >
        {getLabel(show)}
      </div>
      <div
        className={
          'sm:hidden bg-gray-200 px-1 rounded-none ' +
          (isCTAOpen ? 'rounded-b-none' : '')
        }
      >
        {isCTAOpen ? closeCTAButton : openCTAButton}
      </div>
      <div
        className={(isCTAOpen ? '' : 'hidden') + ' w-full sm:w-1/3 sm:block'}
      >
        {ctaButtons}
      </div>
    </>
  );
  const title = isModal ? (
    <Dialog.Title
      as='h1'
      className='flex flex-wrap justify-between text-2xl font-semibold'
    >
      {buttonsStructure}
    </Dialog.Title>
  ) : (
    <h1 className='flex flex-wrap justify-between text-2xl font-semibold'>
      {buttonsStructure}
    </h1>
  );

  const seasons =
    showType === 'tvshows' ? (
      <span>
        {show.number_of_seasons ?? show.numberOfSeasons} season
        {show.number_of_seasons ?? show.numberOfSeasons == '1' ? '' : 's'}{' '}
        available on
      </span>
    ) : (
      ''
    );
  const networks =
    showType === 'tvshows' ? (
      <div className='flex flex-col gap-2 mt-2 sm:flex-row'>
        {seasons}

        <div className='flex flex-row justify-start gap-2 place-items-center'>
          {show.networks.map((n) => (
            <span key={'network_' + (n.id ?? n.externalId)} className=''>
              <Image
                src={
                  'https://image.tmdb.org/t/p/original' +
                  (n.logo_path ?? n.logoPath)
                }
                alt={n.name}
                title={n.name}
                width={40}
                height={40}
                className='p-1 dark:rounded dark:bg-gray-100'
              />
            </span>
          ))}
        </div>
      </div>
    ) : (
      ''
    );

  const description = isModal ? (
    <Dialog.Description as='div' className='flex flex-col mt-2 text-sm'>
      <p className={'pt-4 pb-4 ' + (networks !== '' ? 'border-b' : '')}>
        {show.overview}
      </p>
      {networks}
    </Dialog.Description>
  ) : (
    <div className='mt-2 text-sm'>
      <p className={'pt-4 pb-4 ' + (networks !== '' ? 'border-b' : '')}>
        {show.overview}
      </p>
      {networks}
    </div>
  );

  return (
    <Fragment>
      <div className='px-4 pt-5 pb-4 sm:p-6 sm:pb-4'>
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
          <div className='mt-3 text-justify'>{title}</div>
          {description}
        </div>
      </div>
    </Fragment>
  );
}
