import { NotificationContext } from '@p/Contexts';
import { useContext } from 'react';

export const useNotificationContext = () => {
  return useContext(NotificationContext);
};
