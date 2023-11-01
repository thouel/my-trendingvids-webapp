import AuthProvider from './AuthProvider';
import StateProvider from './StateProvider';
import { NotificationProvider } from './NotificationProvider';

export default function Providers({ children }) {
  return (
    <StateProvider>
      <AuthProvider>
        <NotificationProvider>{children}</NotificationProvider>
      </AuthProvider>
    </StateProvider>
  );
}
