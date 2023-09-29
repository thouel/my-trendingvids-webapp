'use client';

export default function ShowTypeButton({ showType, callback }) {
  return (
    <button
      onClick={(e) => {
        callback(showType.value);
      }}
    >
      {showType.label}
    </button>
  );
}
