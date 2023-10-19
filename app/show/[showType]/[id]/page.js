'use client';
import ShowCard from '@/components/ShowCard';

export default function ShowByTypeAndId({ params }) {
  console.log('from normal');
  const { showType, id } = params;
  return <ShowCard id={id} showType={showType} isModal={false} />;
}
