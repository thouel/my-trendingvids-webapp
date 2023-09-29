'use client';

import { useState } from 'react';
import ShowTypeButton from './showtype_button';

function getShowTypes() {
  return [
    { id: 1, label: 'Movies', value: 'movies' },
    { id: 2, label: 'TV Shows', value: 'tvshows' },
  ];
}
export default function ShowTypes({ setShowType }) {
  const [showTypes, setShowTypes] = useState(getShowTypes());
  return (
    <ul>
      {showTypes.map((s) => (
        <li key={s.id}>
          <ShowTypeButton
            showType={s}
            callback={setShowType}
          />
        </li>
      ))}
    </ul>
  );
}
