import SkeletonShowCard from 'app/components/show/SkeletonShowCard';

export default function ShowLoadingPage() {
  return (
    <>
      <div className='px-4 pt-5 pb-4 sm:p-6 sm:pb-4'>
        <SkeletonShowCard />
      </div>
    </>
  );
}
