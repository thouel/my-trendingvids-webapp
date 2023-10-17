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

    // <footer class="fixed bottom-0 left-0 z-20 w-full p-4 bg-white border-t border-gray-200 shadow md:flex md:items-center md:justify-between md:p-6 dark:bg-gray-800 dark:border-gray-600">
    //     <span class="text-sm text-gray-500 sm:text-center dark:text-gray-400">© 2023 <a href="https://flowbite.com/" class="hover:underline">Flowbite™</a>. All Rights Reserved.
    //     </span>
    //     <ul class="flex flex-wrap items-center mt-3 text-sm font-medium text-gray-500 dark:text-gray-400 sm:mt-0">
    //         <li>
    //             <a href="#" class="mr-4 hover:underline md:mr-6">About</a>
    //         </li>
    //         <li>
    //             <a href="#" class="mr-4 hover:underline md:mr-6">Privacy Policy</a>
    //         </li>
    //         <li>
    //             <a href="#" class="mr-4 hover:underline md:mr-6">Licensing</a>
    //         </li>
    //         <li>
    //             <a href="#" class="hover:underline">Contact</a>
    //         </li>
    //     </ul>
    // </footer>
  );
}
