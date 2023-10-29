import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function ShowLoadingPage() {
  return (
    <>
      <div className='fixed inset-0 z-20 bg-black/70' aria-hidden='true' />
      <div className='fixed inset-0 z-30 w-screen overflow-y-auto'>
        <div className='flex items-center justify-center min-h-full p-4 text-center sm:p-0'>
          <div className='relative overflow-hidden text-left transition-all transform bg-white rounded-lg shadow-xl dark:bg-gray-950 sm:my-8 sm:w-full sm:max-w-2xl'>
            <Skeleton
              count={1}
              height={'300px'}
              inline={true}
              className='mb-1'
            />
            <Skeleton count={3} />
          </div>
        </div>
      </div>
    </>
  );
}
