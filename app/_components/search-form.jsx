'use client';
import { experimental_useFormState as useFormState } from 'react-dom';
import { experimental_useFormStatus as useFormStatus } from 'react-dom';
import { useEffect } from 'react';
import { searchShows } from '@/utils/actions';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const initialState = {
  message: null,
  data: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button type='submit' aria-disabled={pending}>
      <MagnifyingGlassIcon className='w-8 h-8 inline align-text-bottom ml-1 mr-1' />
    </button>
  );
}

export default function SearchForm({ setShows, showType }) {
  const [state, formAction] = useFormState(searchShows, initialState);

  useEffect(() => {
    if (state.data) {
      setShows(state.data);
    }
  }, [state]);

  return (
    <div className='flex justify-end mt-4'>
      <form action={formAction}>
        <input type='hidden' name='showType' value={showType} />

        <input type='text' id='show' name='show' placeholder='Search a show' />
        <SubmitButton />
        <p aria-live='polite' className='sr-only' role='status'>
          {state?.message}
        </p>
      </form>
    </div>
  );
}
