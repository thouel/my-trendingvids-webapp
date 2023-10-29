import { NotificationContext } from 'app/providers/Contexts';
import { useContext } from 'react';

export const useNotificationContext = () => {
  return useContext(NotificationContext);
};
