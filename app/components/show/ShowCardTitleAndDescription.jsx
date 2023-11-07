'use client';

import { Dialog } from '@headlessui/react';
import ShowCardLabelAndButtons from './ShowCardLabelAndButtons';
import Image from 'next/image';

export default function ShowCardTitleAndDescription({
  show,
  showType,
  isModal,
  initialIsShowInMyList,
}) {
  const title = isModal ? (
    <Dialog.Title
      as='h1'
      className='flex flex-wrap justify-between text-2xl font-semibold'
    >
      <ShowCardLabelAndButtons
        show={show}
        showType={showType}
        initialIsShowInMyList={initialIsShowInMyList}
      />
    </Dialog.Title>
  ) : (
    <h1 className='flex flex-wrap justify-between text-2xl font-semibold'>
      <ShowCardLabelAndButtons
        show={show}
        showType={showType}
        initialIsShowInMyList={initialIsShowInMyList}
      />
    </h1>
  );
  const seasons =
    showType === 'tvshows' ||
    (showType === 'p-shows' && show.mediaType === 'tv') ? (
      <span>
        {show.number_of_seasons ?? show.numberOfSeasons} season
        {show.number_of_seasons ?? show.numberOfSeasons == '1' ? '' : 's'}{' '}
        available on
      </span>
    ) : (
      ''
    );
  const networks =
    showType === 'tvshows' ||
    (showType === 'p-shows' && show.mediaType === 'tv') ? (
      <div className='flex flex-col gap-2 mt-2 sm:flex-row'>
        {seasons}
        <div className='flex flex-row justify-start gap-2 place-items-center'>
          {show.networks?.map((n) => (
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
    <>
      <div className='mt-3 text-justify'>{title}</div>
      {description}
    </>
  );
}
