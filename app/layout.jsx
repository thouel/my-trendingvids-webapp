import Footer from '@c/Footer';
import './globals.css';
import AuthProvider from '@ctx/AuthProvider';
import Navbar from '@c/Navbar';

export const metadata = {
  title: 'My Trending Videos Webapp',
  description: 'Made with love by obit',
};

export default function RootLayout({ children, modal }) {
  return (
    <html lang='en'>
      <body className='min-h-screen relative max-w-[100vw] overflow-x-hidden bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100'>
        <AuthProvider>
          <Navbar />
          <div className='pb-[2rem] mt-[5rem]'>
            <main className='max-w-4xl min-h-[20rem] mr-auto ml-auto'>
              {children}
              {modal}
            </main>
          </div>
          <footer className=''>
            <Footer />
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
