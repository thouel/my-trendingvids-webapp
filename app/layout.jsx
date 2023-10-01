import './globals.css';
import Providers from '@/utils/provider';

export const metadata = {
  title: 'My Trending Videos Webapp',
  description: 'Made with love by obit',
};

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body className='max-w-7xl'>
        {/* <Providers> */}
        {children}
        {/* </Providers> */}
      </body>
    </html>
  );
}
