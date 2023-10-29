import Shows from '@c/Shows';

//TODO: Extract the fetch here
export default function Page({ params, searchParams }) {
  return (
    <>
      <Shows showType={params.showType} q={searchParams?.q} />
    </>
  );
}
