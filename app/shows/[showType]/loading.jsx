import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function ShowsLoadingPage() {
  return (
    <>
      <Skeleton count={1} height={'20px'} className='' />
      <div className='grid grid-flow-col grid-cols-4 gap-2'>
        <div>
          <Skeleton count={1} height={'100px'} inline={true} className='mb-1' />
          <Skeleton count={1} />
        </div>
        <div>
          <Skeleton count={1} height={'100px'} inline={true} className='mb-1' />
          <Skeleton count={1} />
        </div>
        <div>
          <Skeleton count={1} height={'100px'} inline={true} className='mb-1' />
          <Skeleton count={1} />
        </div>
        <div>
          <Skeleton count={1} height={'100px'} inline={true} className='mb-1' />
          <Skeleton count={1} />
        </div>
      </div>
    </>
  );
}
