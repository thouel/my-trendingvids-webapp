export default function LoadingSignOut() {
  const className =
    'border-8 border-orange-600 border-solid border-r-transparent border-b-transparent border-l-transparent dark:border-gray-100 dark:border-r-transparent dark:border-b-transparent dark:border-l-transparent';
  return (
    <>
      <div id='loading' className='flex justify-evenly'>
        <div className='lds-ring'>
          <div className={className}></div>
          <div className={className}></div>
          <div className={className}></div>
          <div className={className}></div>
        </div>
      </div>
    </>
  );
}
