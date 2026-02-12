import { NotificationProvider } from '@refinedev/core';
import { toast } from 'sonner';

export const notificationProvider: NotificationProvider = {
  open: ({ message, type, key }) => {
    if (type === 'success') {
      toast.success(message, { id: key });
    } else if (type === 'error') {
      toast.error(message, { id: key });
    } else {
      toast(message, { id: key });
    }
  },
  close: (key) => {
    toast.dismiss(key);
  },
};
