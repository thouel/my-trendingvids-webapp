'use client';

import { useEffect, useState } from 'react';
import ShowTypes from './showtypes';
import { useQuery } from '@tanstack/react-query';

export const getServerSideProps = async (context) => {};

export default function Form() {
  const [showType, setShowType] = useState('');
  const [genres, setGenres] = useState(null);
  const [results, setResults] = useState(null);
  const [selectedGenres, setSelectedGenres] = useState([]);

  async function handleSubmit(e) {
    e.preventDefault();
    console.log('handleSubmit');
  }

  function onChangeCheckbox(id) {
    console.log('onChangeCheckbox');
    const findIdx = selectedGenres.indexOf(id);

    // Index > -1 means that the item exists and that the checkbox is checked
    // and in that case we want to remove it from the array and uncheck it
    if (findIdx > -1) {
      selectedGenres.splice(findIdx, 1);
    } else {
      selectedGenres.push(id);
    }

    setSelectedGenres(selectedGenres);
  }

  const { isLoading, isError, error, data, isFetching } = useQuery({
    queryKey: ['genres'],
    queryFn: () => axios.get(`/api/genres/${showType}`).then((res) => res.data),
  });

  useEffect(
    function effectFunction() {
      async function getGenres() {
        console.log('getGenres()');
        if (showType == null || showType == '') return;
        setGenres(null);

        await fetch(`/api/genres/${showType}`, {
          method: 'get',
        }).then(async (result) => {
          const j = await result.json();
          if (j.message != null) {
            console.error(j);
          } else {
            setGenres(j.genres);
            setSelectedGenres([]);
          }
        });
      }
      getGenres();
    },
    [showType]
  );

  //FIXME: resolve the "FETCH" button that does not work
  //FIXME: solve the "multiple" GET that occurs when showType or selectedGenres changes (use a flag value ?)

  useEffect(() => {
    console.log('getResults()');
    if (showType == null || showType == '') {
      return;
    }
    fetch(`/api/trends/${showType}`, {
      method: 'post',
      body: JSON.stringify({ genres: selectedGenres }),
      headers: {
        'content-type': 'application/json',
      },
    })
      .then((result) => result.json())
      .then((data) => {
        if (data.message != null) {
          console.error(data);
        } else {
          setResults(j);
        }
      });
  }, [showType, selectedGenres]);

  return (
    <form
      method='post'
      onSubmit={handleSubmit}
    >
      <div className='grid grid-cols-3 grid-flow-row gap-4'>
        <div className='form-left-part'>
          <ShowTypes setShowType={setShowType} />
        </div>
        <div className='form-middle-part'>
          {genres == null && <p>Select a show type</p>}
          {genres != null && (
            <ul className='max-h-40 overflow-scroll overflow-x-hidden'>
              {genres.map((g) => (
                <li key={g.id}>
                  <label className=''>
                    <input
                      type='checkbox'
                      name={g.name}
                      value={g.name}
                      id={g.id}
                      selected={selectedGenres.includes(g.id)}
                      onChange={() => onChangeCheckbox(g.id)}
                      className='mr-2'
                    />
                    {g.name}
                  </label>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className='form-right-part grid grid-rows-3 grid-flow-col gap-4'>
          <div>Popularity</div>
          <div>text search</div>
          <div>
            <button type='submit'>Fetch</button>
          </div>
        </div>
      </div>
      <div>{results && results.map((r) => <p key={r.id}>{r.title}</p>)}</div>
    </form>
  );
}
