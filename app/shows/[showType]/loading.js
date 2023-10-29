import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function ShowsLoadingPage() {
  return (
    <>
      {/* Skeleton for mobile devices (lower than sm) */}
      <div className='block px-2 sm:hidden sm:px-0'>
        <Skeleton count={1} className='w-full' height={'30px'} />
        <div className='grid grid-flow-col grid-cols-2 gap-2'>
          <div>
            <Skeleton count={1} inline={true} height={'50px'} />
            <Skeleton count={1} inline={true} height={'20px'} />
          </div>
          <div>
            <Skeleton count={1} inline={true} height={'50px'} />
            <Skeleton count={1} inline={true} height={'20px'} />
          </div>
        </div>
      </div>

      {/* Skeleton for sm:+ devices */}
      <div className='hidden px-2 sm:block sm:px-0'>
        <Skeleton count={1} height={'40px'} className='' />
        <div className='grid grid-flow-col grid-cols-4 gap-2'>
          <div>
            <Skeleton
              count={1}
              height={'100px'}
              inline={true}
              className='mb-2'
            />
            <Skeleton count={1} />
          </div>
          <div>
            <Skeleton
              count={1}
              height={'100px'}
              inline={true}
              className='mb-2'
            />
            <Skeleton count={1} />
          </div>
          <div>
            <Skeleton
              count={1}
              height={'100px'}
              inline={true}
              className='mb-2'
            />
            <Skeleton count={1} />
          </div>
          <div>
            <Skeleton
              count={1}
              height={'100px'}
              inline={true}
              className='mb-2'
            />
            <Skeleton count={1} />
          </div>
        </div>
      </div>
    </>
  );
}
