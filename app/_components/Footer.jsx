'use client';
import { useSession } from 'next-auth/react';
import {
  EnvelopeIcon,
  CodeBracketIcon,
  BugAntIcon,
} from '@heroicons/react/24/outline';

export default function Footer() {
  const { data: session } = useSession({
    required: false,
  });

  const logSession = () => {
    console.log(session);
  };

  return (
    <div className='border-t border-gray-200 p-3 text-sm font-normal flex flex-wrap justify-between items-center gap-3'>
      <span className='select-none'>&copy; 2023, Obit</span>
      <a
        target='_blank'
        href='mailto:t.houel@gmail.com'
        rel='noopener noreferrer'
        className='hover:text-orange-600'
      >
        <EnvelopeIcon
          className='h-6 w-6 mr-2 hidden sm:inline'
          title='Contact by mail'
        />
        Contact
      </a>
      <a
        target='_blank'
        href='https://github.com/thouel/my-trendingvids-webapp'
        className='hover:text-orange-600'
      >
        <CodeBracketIcon
          className='h-6 w-6 mr-2 hidden sm:inline'
          title='Go to repository'
        />
        Repo
      </a>
      <span
        onClick={() => logSession()}
        className='cursor-pointer hover:text-orange-600'
      >
        <BugAntIcon
          className='h-6 w-6 mr-2 hidden sm:inline'
          title='Log Session'
        />
        Log Session
      </span>
    </div>
  );
}
