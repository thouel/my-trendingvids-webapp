import Shows from '@c/Shows';

export const dynamic = 'force-dynamic';

export default function Page({ params, searchParams }) {
  return (
    <>
      <Shows showType={params.showType} q={searchParams?.q} />
    </>
  );
}
