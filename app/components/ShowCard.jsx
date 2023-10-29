import { Fragment } from 'react';
import { getLabel } from '@u/helper';
import Image from 'next/image';
import ShowCardTitleAndDescription from './ShowCardTitleAndDescription';

export default function ShowCard({ showType, show, isModal, isShowInMyList }) {
  return (
    <Fragment>
      <div className='px-4 pt-5 pb-4 sm:p-6 sm:pb-4'>
        <div className='sm:flex-col'>
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
          <ShowCardTitleAndDescription
            show={show}
            showType={showType}
            isModal={isModal}
            initialIsShowInMyList={isShowInMyList}
          />
        </div>
      </div>
    </Fragment>
  );
}
