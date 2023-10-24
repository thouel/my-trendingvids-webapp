import AuthProvider from './AuthProvider';
import { NotificationProvider } from './NotificationProvider';

export default function Providers({ children }) {
  return (
    <AuthProvider>
      <NotificationProvider>{children}</NotificationProvider>
    </AuthProvider>
  );
}
