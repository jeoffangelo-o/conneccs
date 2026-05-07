import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { IPCR, OPCR, Notification } from '../types';
import ipcrData from '../assets/data/ipcr.json';
import opcrData from '../assets/data/opcr.json';
import notificationsData from '../assets/data/notifications.json';
import usersData from '../assets/data/users.json';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface DataContextType {
  ipcrs: IPCR[];
  opcr: OPCR;
  notifications: Notification[];
  updateIPCR: (id: string, updates: Partial<IPCR>) => void;
  addIPCR: (ipcr: IPCR) => void;
  markNotificationRead: (id: string) => void;
  getUnreadCount: (userId: string) => number;
  generateIPCRForFaculty: (userId: string) => Promise<IPCR | null>;
  getFacultyIPCRs: (userId: string) => IPCR[];
  updateOPCRTargets: (newMajorFunctions: any[]) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [ipcrs, setIpcrs] = useState<IPCR[]>(ipcrData as IPCR[]);
  const [opcr, setOpcr] = useState<OPCR>(opcrData as OPCR);
  const [notifications, setNotifications] = useState<Notification[]>(
    notificationsData as Notification[]
  );

  // Load IPCRs from AsyncStorage on mount
  useEffect(() => {
    loadIPCRs();
    loadOPCR();
  }, []);

  // Save IPCRs to AsyncStorage whenever they change
  useEffect(() => {
    saveIPCRs();
  }, [ipcrs]);

  const loadIPCRs = async () => {
    try {
      const stored = await AsyncStorage.getItem('ipcrs');
      if (stored) {
        setIpcrs(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading IPCRs:', error);
    }
  };

  const loadOPCR = async () => {
    try {
      const stored = await AsyncStorage.getItem('opcr');
      if (stored) {
        setOpcr(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading OPCR:', error);
    }
  };

  const saveIPCRs = async () => {
    try {
      await AsyncStorage.setItem('ipcrs', JSON.stringify(ipcrs));
    } catch (error) {
      console.error('Error saving IPCRs:', error);
    }
  };

  const generateIPCRForFaculty = async (userId: string): Promise<IPCR | null> => {
    // Find the user
    const user = usersData.find((u: any) => u.id === userId);
    if (!user) return null;

    // Check if IPCR already exists for this user and period
    const existingIPCR = ipcrs.find(
      ipcr => ipcr.facultyId === userId && ipcr.period === opcr.period
    );
    if (existingIPCR) return existingIPCR;

    // Extract faculty last name for matching
    const facultyLastName = user.lastName.toLowerCase();

    // Filter OPCR targets where this faculty is accountable
    const assignedTargets: any[] = [];
    
    opcr.majorFunctions.forEach((mf) => {
      mf.successIndicators.forEach((si) => {
        const accountableList = si.accountableUnits.toLowerCase();
        
        // Check if faculty name appears in accountable list
        if (
          accountableList.includes(facultyLastName) ||
          accountableList.includes('all faculty') ||
          accountableList.includes('all personnel')
        ) {
          assignedTargets.push({
            id: `target-${si.id}-${userId}`,
            opcrTargetId: si.id,
            code: si.code,
            kra: mf.title,
            category: mf.category,
            weight: mf.weight,
            description: si.description,
            measures: si.measures,
            timeline: si.timeline,
            targetValue: si.targetValue,
            actualValue: null,
            accomplishment: '',
            status: 'PENDING',
            ratings: {
              quantity: null,
              efficiency: null,
              timeliness: null,
              average: null,
            },
            supportingDocs: [],
            submittedAt: null,
            reviewedAt: null,
            reviewerComments: '',
          });
        }
      });
    });

    // If no targets assigned, return null
    if (assignedTargets.length === 0) return null;

    // Create new IPCR
    const newIPCR: any = {
      id: `ipcr-${userId}-${Date.now()}`,
      facultyId: userId,
      facultyName: user.name,
      period: opcr.period,
      year: opcr.year,
      status: 'IN_PROGRESS',
      currentPhase: 'TARGET_SETTING',
      targets: assignedTargets,
      overallRating: null,
      strategicRating: null,
      coreRating: null,
      supportRating: null,
      finalRating: null,
      adjectivalRating: null,
      majorFunctions: [],
      notedByChairId: null,
      verifiedByVpaa: null,
      approvedByDeanId: null,
      createdAt: new Date().toISOString(),
      submittedAt: null,
      reviewedAt: null,
      approvedAt: null,
      reviewerId: null,
      reviewerName: null,
      reviewerComments: '',
    };

    // Add to state
    setIpcrs(prev => [...prev, newIPCR]);

    return newIPCR;
  };

  const getFacultyIPCRs = (userId: string): IPCR[] => {
    return ipcrs.filter(ipcr => ipcr.facultyId === userId);
  };

  const updateOPCRTargets = async (newMajorFunctions: any[]) => {
    // Merge new major functions with existing ones
    const updatedOPCR = {
      ...opcr,
      majorFunctions: [...opcr.majorFunctions, ...newMajorFunctions],
    };
    
    setOpcr(updatedOPCR);
    
    // Save to AsyncStorage
    try {
      await AsyncStorage.setItem('opcr', JSON.stringify(updatedOPCR));
    } catch (error) {
      console.error('Error saving OPCR:', error);
    }
  };

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
        generateIPCRForFaculty,
        getFacultyIPCRs,
        updateOPCRTargets,
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
