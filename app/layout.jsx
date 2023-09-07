import './globals.css';

export const metadata = {
  title: 'My Trending Videos Webapp',
  description: 'Made with love by obit',
};

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body className=''>{children}</body>
    </html>
  );
}
