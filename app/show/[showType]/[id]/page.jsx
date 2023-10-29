import ShowCard from '@c/ShowCard';
import { fetchShow } from 'app/_utils/actions';
import { options } from 'app/api/auth/[...nextauth]/options';
import LambdaError from 'app/components/LambdaError';
import { getServerSession } from 'next-auth';

export default async function ShowByTypeAndId({ params }) {
  console.log('from normal');
  const { showType, id } = params;
  const session = await getServerSession(options);
  const { show, isLoading, errorMessage, isShowInMyList } = await fetchShow(
    showType,
    id,
    session,
  );

  if (isLoading) {
    return null;
  }

  if (errorMessage) {
    return <LambdaError />;
  }
  console.log('calling ShowCard', { show, showType, isShowInMyList });
  return (
    <ShowCard
      isModal={false}
      showType={showType}
      show={show}
      isShowInMyList={isShowInMyList}
    />
  );
}
