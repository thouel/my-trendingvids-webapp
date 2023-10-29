import ShowCardModal from 'app/components/show/ShowCardModal';
import { fetchShow } from 'app/_utils/actions';
import LambdaError from 'app/components/LambdaError';
import { getServerSession } from 'next-auth';
import { options } from 'app/api/auth/[...nextauth]/options';

export default async function ShowByTypeAndIdModal({ params }) {
  console.log('from modal');
  const { showType, id } = params;
  const session = await getServerSession(options);
  const { show, errorMessage, isShowInMyList } = await fetchShow(
    showType,
    id,
    session,
  );

  if (errorMessage && errorMessage !== '') {
    return <LambdaError />;
  }

  return (
    <ShowCardModal
      showType={showType}
      show={show}
      isShowInMyList={isShowInMyList}
    />
  );
}
