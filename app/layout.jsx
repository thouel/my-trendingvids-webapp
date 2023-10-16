import Footer from '@/components/Footer';
import './globals.css';
import AuthProvider from '@/context/AuthProvider';
import Sidebar from '@/components/Sidebar';
import SearchForm from '@/components/SearchForm';

export const metadata = {
  title: 'My Trending Videos Webapp',
  description: 'Made with love by obit',
};

export default function RootLayout({ children, modal }) {
  return (
    <html lang='en'>
      <body className='max-w-7xl'>
        <AuthProvider>
          {/* <Providers> */}
          <Sidebar />
          <main className=''>
            <SearchForm />
            {children}
          </main>
          {/* </Providers> */}
          {modal}
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
