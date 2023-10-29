import Shows from '@c/Shows';

export default function Page({ params, searchParams }) {
  return (
    <>
      <Shows showType={params.showType} q={searchParams?.q} />
    </>
  );
}
