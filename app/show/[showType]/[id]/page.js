'use client';
import ShowCard from '@/components/ShowCard';
import { useSearchParams } from 'next/navigation';

export default function ShowByTypeAndId({ params }) {
  const { showType, id } = params;
  return <ShowCard id={id} showType={showType} isModal={false} />;
}
