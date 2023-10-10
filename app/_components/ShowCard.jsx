import { Fragment, useRef, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { PlusIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import {
  getLabel,
  isAuthenticated,
  isShowInMyList as fn_isShowInMyList,
} from '@/utils/helper';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function ShowCard({ show, onCloseCallback }) {
  const {
    data: session,
    status,
    update,
  } = useSession({
    required: false,
  });
  const router = useRouter();

  const [isShowInMyList, setIsShowInMyList] = useState(
    fn_isShowInMyList(show, session)
  );
  const [open, setOpen] = useState(true);
  const cancelButtonRef = useRef(null);
  const [errorMessage, setErrorMessage] = useState('');

  const closeModal = () => {
    setOpen(false);
    onCloseCallback();
  };

  const addToMyList = async (show) => {
    console.log('addToMyList', { show });
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
        session.user.pinnedShowsIDs.push(postResult.show.id);
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
    await fetch(`/api/show/${id}`, {
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
        router.refresh();
      });
  };

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as='div'
        className='relative z-10'
        initialFocus={cancelButtonRef}
        onClose={closeModal}
      >
        <Transition.Child
          as={Fragment}
          enter='ease-out duration-300'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <div className='fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity' />
        </Transition.Child>
        <div className='fixed inset-0 bg-black/70' aria-hidden='true' />
        <div className='fixed inset-0 z-10 w-screen overflow-y-auto'>
          <div className='flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0'>
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
              enterTo='opacity-100 translate-y-0 sm:scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 translate-y-0 sm:scale-100'
              leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
            >
              <Dialog.Panel className='modal relative transform overflow-hidden rounded-lg text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl'>
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
                    <div className='mt-3 text-left'>
                      <Dialog.Title
                        as='h1'
                        className='text-2xl font-semibold modal-title'
                      >
                        {getLabel(show)}
                        {isShowInMyList ? (
                          <button
                            type='button'
                            className='cta-button-text-with-icon'
                            onClick={() => removeFromMyList(show)}
                          >
                            <CheckCircleIcon className='h-6 w-6' />
                          </button>
                        ) : (
                          <button
                            type='button'
                            className='cta-button-icon'
                            onClick={() => addToMyList(show)}
                          >
                            <PlusIcon className='h-6 w-6' />
                          </button>
                        )}
                      </Dialog.Title>
                      <Dialog.Description as='p' className='mt-2 text-sm'>
                        {show.overview}
                      </Dialog.Description>
                    </div>
                  </div>
                </div>
                <div className='px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6'>
                  <button
                    type='button'
                    className='cta-button-text-with-icon'
                    onClick={() => closeModal()}
                    ref={cancelButtonRef}
                  >
                    Close
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
