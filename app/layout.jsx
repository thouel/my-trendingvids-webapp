import './globals.css';
import Providers from '@p/Providers';
import Navbar from '@c/Navbar';
import Footer from '@c/Footer';

export const metadata = {
  title: 'My Trending Videos Webapp',
  description: 'Made with love by obit',
};

export default function RootLayout({ children, modal }) {
  return (
    <html lang='en'>
      <body className='max-w-[100vw] overflow-x-hidden bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100'>
        <Providers>
          <Navbar />
          <div className=''>
            <main className='max-w-4xl min-w-0 p-0 mx-auto mt-20 mb-10 overflow-hidden'>
              {children}
              {modal}
            </main>
          </div>
          <footer className='fixed bottom-0 left-0 z-10 w-full bg-white dark:bg-gray-900'>
            <Footer />
          </footer>
        </Providers>
      </body>
    </html>
  );
}
