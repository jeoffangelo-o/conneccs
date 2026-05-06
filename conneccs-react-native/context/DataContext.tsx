import React, { createContext, useState, useContext, ReactNode } from 'react';
import { IPCR, OPCR, Notification } from '../types';
import ipcrData from '../assets/data/ipcr.json';
import opcrData from '../assets/data/opcr.json';
import notificationsData from '../assets/data/notifications.json';

interface DataContextType {
  ipcrs: IPCR[];
  opcr: OPCR;
  notifications: Notification[];
  updateIPCR: (id: string, updates: Partial<IPCR>) => void;
  addIPCR: (ipcr: IPCR) => void;
  markNotificationRead: (id: string) => void;
  getUnreadCount: (userId: string) => number;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [ipcrs, setIpcrs] = useState<IPCR[]>(ipcrData as IPCR[]);
  const [opcr] = useState<OPCR>(opcrData as OPCR);
  const [notifications, setNotifications] = useState<Notification[]>(
    notificationsData as Notification[]
  );

  const updateIPCR = (id: string, updates: Partial<IPCR>) => {
    setIpcrs(prev =>
      prev.map(ipcr => (ipcr.id === id ? { ...ipcr, ...updates } : ipcr))
    );
  };

  const addIPCR = (ipcr: IPCR) => {
    setIpcrs(prev => [...prev, ipcr]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notif => (notif.id === id ? { ...notif, isRead: true } : notif))
    );
  };

  const getUnreadCount = (userId: string): number => {
    return notifications.filter(n => n.userId === userId && !n.isRead).length;
  };

  return (
    <DataContext.Provider
      value={{
        ipcrs,
        opcr,
        notifications,
        updateIPCR,
        addIPCR,
        markNotificationRead,
        getUnreadCount,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
};
