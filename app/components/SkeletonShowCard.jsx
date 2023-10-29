import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function SkeletonShowCard() {
  return (
    <>
      <Skeleton count={1} height={'300px'} inline={true} className='mb-1' />
      <Skeleton count={3} />
    </>
  );
}
