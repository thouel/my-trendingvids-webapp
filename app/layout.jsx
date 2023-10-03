import Footer from '@/components/footer';
import './globals.css';
import AuthProvider from '@/context/AuthProvider';

export const metadata = {
  title: 'My Trending Videos Webapp',
  description: 'Made with love by obit',
};

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body className='max-w-7xl'>
        <AuthProvider>
          {/* <Providers> */}
          {children}
          {/* </Providers> */}
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
