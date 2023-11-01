'use client';

import {
  CheckCircleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  HomeIcon,
  InformationCircleIcon,
  LinkIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';
import { useQueryClient } from '@tanstack/react-query';
import { getLabel, isAuthenticated } from 'app/utils/helper';
import { useSession } from 'next-auth/react';
import { useUrl } from 'nextjs-current-url';
import { useState } from 'react';

export default function ShowCardLabelAndButtons({
  show,
  showType,
  initialIsShowInMyList,
}) {
  const [isCTAOpen, setIsCTAOpen] = useState(false);
  const [isShowInMyList, setIsShowInMyList] = useState(initialIsShowInMyList);
  const { href: currentUrl } = useUrl() ?? {};
  const {
    data: session,
    // eslint-disable-next-line no-unused-vars
    status,
    update,
  } = useSession({
    required: false,
  });
  const queryClient = useQueryClient();

  /**
   * Actions
   */
  const copyToClipboard = () => {
    navigator.clipboard.writeText(currentUrl);
  };
  const toggleIsCTAOpen = () => {
    setIsCTAOpen(!isCTAOpen);
  };

  //TODO: transfer as server actions ?
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
      .then(async (data) => {
        const postResult = data;
        if (postResult.error) {
          // set Error Message(
          console.error('Error while adding to My List', postResult.error);
          // setErrorMessage(postResult.error.message);
          return;
        }
        // setErrorMessage('');

        // Update the list in session
        session.user.pinnedShowsIDs.push(postResult.show.id);
        session.user.pinnedShows.push(postResult.show);
        update({
          pinnedShowsIDs: session.user.pinnedShowsIDs,
          pinnedShows: session.user.pinnedShows,
        });

        setIsShowInMyList(true);
        queryClient.invalidateQueries({ queryKey: ['shows-p-shows'] });
      });
  };
  //TODO: transfer as server actions ?
  const removeFromMyList = async (show) => {
    console.log('removeFromMyList', { show });
    if (!isAuthenticated(session)) {
      console.log('Needs to authenticate');
      return;
    }
    const id = show.externalId;
    await fetch(`/api/show/${showType}/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: session.user.id }),
    })
      .then((res) => res.json())
      .then(async (data) => {
        if (data.error) {
          console.error('Error while removing from My List', data.error);
          // setErrorMessage(data.error.message);
          return;
        }
        // setErrorMessage('');

        // remove the show from the lists in session
        var idx = session.user.pinnedShowsIDs.indexOf(data.show.id);
        session.user.pinnedShowsIDs.splice(idx, 1);
        session.user.pinnedShows.splice(idx, 1);
        update({
          pinnedShowsIDs: session.user.pinnedShowsIDs,
          pinnedShows: session.user.pinnedShows,
        });
        setIsShowInMyList(false);

        // Refreshing the ShowsCarousel
        queryClient.invalidateQueries({ queryKey: ['shows-p-shows'] });
      });
  };

  /**
   * Buttons
   */

  // Copy link to clipboard button
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

  // Go to homepage button
  const homepageTitle = 'Go to homepage';
  const homepageButton = (
    <a
      rel='noreferrer'
      target='_blank'
      href={show.homepage}
      className='text-gray-600 hover:text-orange-600'
    >
      <HomeIcon className='w-6 h-6' alt={homepageTitle} title={homepageTitle} />
    </a>
  );

  // Go to IMDB button
  const imdbTitle = 'Go to IMDb';
  const imdbButton = (
    <a
      rel='noreferrer'
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

  // Add to My List & Remove from My List
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

  // Open 'Call-To-Actions' Button Bar
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

  // Close 'Call-To-Actions' Button Bar
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

  // Call-To-Actions Button Bar
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
  const buttonsStructure = (
    <>
      <div
        className={
          'text-orange-600 text-clip w-2/3 text-start ' +
          (label.length > 20 ? 'text-sm sm:text-lg' : 'text-lg sm:text-xl')
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

  return <>{buttonsStructure}</>;
}
