'use client';
import Link from 'next/link';
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
    <div className='border-t border-gray-200 p-3 text-sm font-normal flex flex-wrap justify-between items-center'>
      <span className='select-none'>&copy; 2023, Obit</span>
      <ul className='flex flex-wrap items-center'>
        <li className='mr-5'>
          <a
            target='_blank'
            href='mailto:t.houel@gmail.com'
            rel='noopener noreferrer'
            className='hover:text-orange-600'
          >
            <EnvelopeIcon
              className='h-6 w-6 inline mr-2'
              title='Contact by mail'
            />
            Contact
          </a>
        </li>
        <li className='mr-5'>
          <a
            target='_blank'
            href='https://github.com/thouel/my-trendingvids-webapp'
            className='hover:text-orange-600'
          >
            <CodeBracketIcon
              className='h-6 w-6 inline mr-2'
              title='Go to repository'
            />
            Repo
          </a>
        </li>
        <li>
          <span
            onClick={() => logSession()}
            className='cursor-pointer hover:text-orange-600'
          >
            <BugAntIcon className='h-6 w-6 inline mr-2' title='Log Session' />
            Log Session
          </span>
        </li>
      </ul>
    </div>
  );
}
