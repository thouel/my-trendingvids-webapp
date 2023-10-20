'use client';
import ShowCard from '@c/ShowCard';
import { Dialog, Transition } from '@headlessui/react';
import { useRouter } from 'next/navigation';
import { Fragment, useState } from 'react';

export const dynamic = 'force-dynamic';

export default function ShowByTypeAndIdModal({ params }) {
  console.log('from modal');
  const router = useRouter();
  const [open, setOpen] = useState(true);
  const { showType, id } = params;
  const closeModal = () => {
    setOpen(false);
    router.back();
  };

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as='div' className='relative z-10' onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter='ease-out duration-300'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <div className='fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75' />
        </Transition.Child>
        <div className='fixed inset-0 z-20 bg-black/70' aria-hidden='true' />
        <div className='fixed inset-0 z-30 w-screen overflow-y-auto'>
          <div className='flex items-center justify-center min-h-full p-4 text-center sm:p-0'>
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
              enterTo='opacity-100 translate-y-0 sm:scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 translate-y-0 sm:scale-100'
              leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
            >
              <Dialog.Panel className='relative overflow-hidden text-left transition-all transform bg-white rounded-lg shadow-xl dark:bg-gray-950 sm:my-8 sm:w-full sm:max-w-2xl'>
                <ShowCard id={id} showType={showType} isModal={true} />

                <div className='px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6'>
                  <button
                    type='button'
                    className='text-lg text-gray-600 hover:text-orange-600 dark:text-gray-100'
                    onClick={() => closeModal()}
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
