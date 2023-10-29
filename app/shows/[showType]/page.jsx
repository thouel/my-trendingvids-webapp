import Shows from 'app/components/shows/Shows';

//TODO: Extract the fetch here
export default function Page({ params, searchParams }) {
  return (
    <>
      <Shows showType={params.showType} q={searchParams?.q} />
    </>
  );
}
