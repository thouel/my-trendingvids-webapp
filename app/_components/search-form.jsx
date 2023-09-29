'use client';
import { experimental_useFormState as useFormState } from 'react-dom';
import { experimental_useFormStatus as useFormStatus } from 'react-dom';
import { useEffect } from 'react';
import { searchShows } from '@/utils/actions';

const initialState = {
  message: null,
  data: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button type='submit' aria-disabled={pending}>
      Search
    </button>
  );
}

export default function SearchForm({ setShows, showType }) {
  const [state, formAction] = useFormState(searchShows, initialState);

  useEffect(() => {
    console.log('state', state);
    if (state.data) {
      setShows(state.data);
    }
  }, [state]);

  return (
    <div>
      <form action={formAction}>
        <p>
          <label htmlFor='show' className='font-bold text-lg'>
            Search a show
          </label>
        </p>
        <input type='hidden' name='showType' value={showType} />
        <input type='text' id='show' name='show' className='pl-2' />
        <SubmitButton />

        <p aria-live='polite' className='sr-only' role='status'>
          {state?.message}
        </p>
      </form>
    </div>
  );
}
