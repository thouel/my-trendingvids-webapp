'use client';

import { useState } from 'react';

const Types = {
  Success: 'success',
  Info: 'info',
  Warning: 'warning',
  Error: 'error',
};

function Toast({ type, message }) {
  const [visible, setVisible] = useState(true);

  setTimeout(() => setVisible(false), 5000);

  if (!visible) return null;

  if (type === Types.Success) {
    return (
      <div className='flex items-center px-3 py-2 mb-2 text-xs bg-green-500 border-l-4 border-green-700 shadow-md sm:text-sm'>
        {/* Icons  */}
        <div className='mr-3 text-green-500 bg-white rounded-full'>
          <svg
            width='1.8em'
            height='1.8em'
            viewBox='0 0 16 16'
            className='bi bi-check'
            fill='currentColor'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              fillRule='evenodd'
              d='M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.236.236 0 0 1 .02-.022z'
            />
          </svg>
        </div>
        {/* Message */}
        <div className='max-w-xs text-gray-100'>{message}</div>
      </div>
    );
  }

  if (type === Types.Info) {
    return (
      <div className='flex items-center px-3 py-2 mb-2 text-xs bg-blue-400 border-l-4 border-blue-700 shadow-md sm:text-sm'>
        {/* Icons */}
        <div className='mr-3 text-blue-500 bg-white rounded-full'>
          <svg
            width='1.8em'
            height='1.8em'
            viewBox='0 0 16 16'
            fill='currentColor'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path d='M8.93 6.588l-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588z' />
            <circle cx='8' cy='4.5' r='1' />
          </svg>
        </div>
        {/* Message */}
        <div className='max-w-xs text-gray-100 '>{message}</div>
      </div>
    );
  }

  if (type === Types.Warning) {
    return (
      <div className='flex items-center px-3 py-2 mb-2 text-xs bg-orange-400 border-l-4 border-orange-700 shadow-md sm:text-sm'>
        {/* Icons */}
        <div className='mr-3 text-orange-500 bg-white rounded-full'>
          <svg
            width='1.8em'
            height='1.8em'
            viewBox='0 0 16 16'
            fill='currentColor'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path d='M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z' />
          </svg>
        </div>
        {/* Message */}
        <div className='max-w-xs text-gray-100 '>{message}</div>
      </div>
    );
  }

  if (type === Types.Error) {
    return (
      <div className='flex items-center px-3 py-2 mb-2 text-xs bg-red-500 border-l-4 border-red-700 shadow-md sm:text-sm'>
        {/* Icons */}
        <div className='mr-3 text-red-500 bg-white rounded-full'>
          <svg
            width='1.8em'
            height='1.8em'
            viewBox='0 0 16 16'
            fill='currentColor'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              fillRule='evenodd'
              d='M11.854 4.146a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708-.708l7-7a.5.5 0 0 1 .708 0z'
            />
            <path
              fillRule='evenodd'
              d='M4.146 4.146a.5.5 0 0 0 0 .708l7 7a.5.5 0 0 0 .708-.708l-7-7a.5.5 0 0 0-.708 0z'
            />
          </svg>
        </div>
        {/* Message */}
        <div className='max-w-xs text-white '>{message}</div>
      </div>
    );
  }
}

export { Types, Toast };
