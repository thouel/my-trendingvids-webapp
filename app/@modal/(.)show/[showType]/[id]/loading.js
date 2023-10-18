import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function ShowLoadingPage() {
  return (
    <>
      <div>
        <Skeleton count={1} height={'100px'} inline={true} className='mb-1' />
        <Skeleton count={3} />
      </div>
    </>
  );
}
