import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { IPCR, OPCR, Notification } from '../types';
import ipcrData from '../assets/data/ipcr.json';
import opcrData from '../assets/data/opcr.json';
import notificationsData from '../assets/data/notifications.json';
import usersData from '../assets/data/users.json';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from './AuthContext';

interface DataContextType {
  ipcrs: IPCR[];
  opcr: OPCR;
  notifications: Notification[];
  updateIPCR: (id: string, updates: Partial<IPCR>) => void;
  deleteIPCR: (id: string) => void;
  addIPCR: (ipcr: IPCR) => void;
  markNotificationRead: (id: string) => void;
  getUnreadCount: (userId: string) => number;
  generateIPCRForFaculty: (userId: string) => Promise<IPCR | null>;
  getFacultyIPCRs: (userId: string) => IPCR[];
  updateOPCRTargets: (newMajorFunctions: any[]) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const { setAutoGenerateIPCR } = useAuth();
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

  // Remove duplicate IPCRs (keep only the first one for each facultyId + period)
  useEffect(() => {
    const removeDuplicates = () => {
      const seen = new Set();
      const uniqueIPCRs = ipcrs.filter(ipcr => {
        const key = `${ipcr.facultyId}-${ipcr.period}`;
        if (seen.has(key)) {
          console.log('Removing duplicate IPCR:', ipcr.id, 'for faculty:', ipcr.facultyName);
          return false;
        }
        seen.add(key);
        return true;
      });
      
      if (uniqueIPCRs.length < ipcrs.length) {
        console.log(`Removed ${ipcrs.length - uniqueIPCRs.length} duplicate IPCRs`);
        setIpcrs(uniqueIPCRs);
      }
    };
    
    if (ipcrs.length > 0) {
      removeDuplicates();
    }
  }, [ipcrs.length]);

  // Register auto-generate IPCR callback with AuthContext
  useEffect(() => {
    setAutoGenerateIPCR(async (userId: string) => {
      await generateIPCRForFaculty(userId);
    });
  }, [opcr, ipcrs]); // Re-register when OPCR or IPCRs change

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

  // Helper function to determine required ratings based on target description and measures
  const determineRequiredRatings = (description: string, measures: string): ('Q' | 'E' | 'T')[] => {
    const combined = (description + ' ' + measures).toLowerCase();
    const ratings: ('Q' | 'E' | 'T')[] = [];
    
    // Quality (Q) - for written work, documents, reports, submissions
    if (
      combined.includes('submit') ||
      combined.includes('document') ||
      combined.includes('report') ||
      combined.includes('complete') ||
      combined.includes('revision') ||
      combined.includes('requirements')
    ) {
      ratings.push('Q');
    }
    
    // Effectiveness (E) - for results, outcomes, achievements, percentages
    if (
      combined.includes('100%') ||
      combined.includes('percent') ||
      combined.includes('attendance') ||
      combined.includes('accreditation') ||
      combined.includes('ensured') ||
      combined.includes('achieved')
    ) {
      ratings.push('E');
    }
    
    // Timeliness (T) - for deadlines, schedules, on-time delivery
    if (
      combined.includes('on or before') ||
      combined.includes('deadline') ||
      combined.includes('schedule') ||
      combined.includes('timely') ||
      combined.includes('working days') ||
      combined.includes('ensuing month')
    ) {
      ratings.push('T');
    }
    
    // If no specific indicators found, require all three
    if (ratings.length === 0) {
      return ['Q', 'E', 'T'];
    }
    
    return ratings;
  };

  // Migrate existing IPCRs to add requiredRatings field AND facultyName field
  useEffect(() => {
    const migrateIPCRs = async () => {
      console.log('=== Starting IPCR Migration ===');
      console.log('Total IPCRs to check:', ipcrs.length);
      
      let needsMigration = false;
      
      const migratedIPCRs = ipcrs.map(ipcr => {
        console.log(`Checking IPCR: ${ipcr.id}`);
        
        let updatedIPCR = { ...ipcr };
        
        // Migration 1: Add facultyName if missing
        if (!ipcr.facultyName && ipcr.facultyId) {
          const user = usersData.find((u: any) => u.id === ipcr.facultyId);
          if (user) {
            updatedIPCR.facultyName = user.name;
            needsMigration = true;
            console.log(`  ✓ Added facultyName: ${user.name} for facultyId: ${ipcr.facultyId}`);
          }
        }
        
        // Migration 2: Add requiredRatings to targets
        if (!ipcr.majorFunctions) {
          console.log('  No major functions, skipping');
          return updatedIPCR;
        }
        
        const updatedMajorFunctions = ipcr.majorFunctions.map(mf => {
          if (!mf.targets) return mf;
          
          const updatedTargets = mf.targets.map(target => {
            // Check if target already has requiredRatings
            if (target.requiredRatings && target.requiredRatings.length > 0) {
              console.log(`  Target ${target.id} already has requiredRatings:`, target.requiredRatings);
              return target;
            }
            
            needsMigration = true;
            
            // Determine required ratings based on description and measures
            const requiredRatings = determineRequiredRatings(
              target.description || '',
              target.measures || ''
            );
            
            console.log(`  ✓ Migrating target ${target.id}:`, requiredRatings.join(', '));
            console.log(`    Description: ${target.description?.substring(0, 60)}...`);
            
            return {
              ...target,
              requiredRatings,
            };
          });
          
          return {
            ...mf,
            targets: updatedTargets,
          };
        });
        
        return {
          ...updatedIPCR,
          majorFunctions: updatedMajorFunctions,
        };
      });
      
      if (needsMigration) {
        console.log('=== Migration Complete - Updating IPCRs ===');
        setIpcrs(migratedIPCRs);
      } else {
        console.log('=== No migration needed - all IPCRs up to date ===');
      }
    };
    
    if (ipcrs.length > 0) {
      migrateIPCRs();
    }
  }, [ipcrs.length]); // Run when IPCRs are loaded

  const generateIPCRForFaculty = async (userId: string): Promise<IPCR | null> => {
    console.log('=== Auto-generating IPCR for faculty:', userId);
    
    // Find the user
    const user = usersData.find((u: any) => u.id === userId);
    if (!user) {
      console.log('User not found:', userId);
      return null;
    }

    console.log('Found user:', user.name, 'Last name:', user.lastName, 'Role:', user.role);

    // Check if IPCR already exists for this user and period
    const existingIPCR = ipcrs.find(
      ipcr => ipcr.facultyId === userId && ipcr.period === opcr.period
    );
    if (existingIPCR) {
      console.log('IPCR already exists for this period:', existingIPCR.id);
      return existingIPCR;
    }

    // Extract faculty last name for matching
    const facultyLastName = user.lastName.toLowerCase();
    console.log('Searching for targets with accountable:', facultyLastName);

    // Build major functions with assigned targets
    const ipcrMajorFunctions: any[] = [];
    
    opcr.majorFunctions.forEach((mf) => {
      console.log('Checking major function:', mf.title, 'Category:', mf.category);
      
      const assignedTargets: any[] = [];
      
      mf.successIndicators.forEach((si) => {
        const accountableList = si.accountableUnits.toLowerCase();
        
        // Check if faculty name appears in accountable list
        // Use word boundary matching to avoid partial matches
        const namePattern = new RegExp(`\\b${facultyLastName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
        const isAssigned = 
          namePattern.test(accountableList) ||
          accountableList.includes('all faculty') ||
          accountableList.includes('all personnel');
        
        if (isAssigned) {
          console.log('✓ Match found in target:', si.code, '-', si.description.substring(0, 50));
          
          const requiredRatings = determineRequiredRatings(si.description, si.measures);
          console.log('  Required ratings:', requiredRatings.join(', '));
          
          assignedTargets.push({
            id: `target-${si.id}-${userId}`,
            parentOpIndicatorId: si.id,
            code: si.code,
            description: si.description,
            measures: si.measures,
            targetValue: si.targetValue,
            q1Rating: null,
            e2Rating: null,
            t3Rating: null,
            a4Rating: null,
            actualAccomplishments: '',
            remarks: '',
            movFileUrls: [],
            requiredRatings: requiredRatings,
          });
        }
      });

      // Only add major function if it has assigned targets
      if (assignedTargets.length > 0) {
        ipcrMajorFunctions.push({
          id: `mf-${mf.id}-${userId}`,
          title: mf.title,
          category: mf.category,
          weight: mf.weight,
          targets: assignedTargets,
        });
      }
    });

    const totalTargets = ipcrMajorFunctions.reduce((sum, mf) => sum + mf.targets.length, 0);
    console.log('Total targets assigned:', totalTargets);

    // If no targets assigned, return null
    if (totalTargets === 0) {
      console.log('No targets found for this faculty');
      return null;
    }

    // Create new IPCR with proper structure
    const newIPCR: any = {
      id: `ipcr-${userId}-${Date.now()}`,
      facultyId: userId,
      facultyName: user.name,
      period: opcr.period,
      year: opcr.year,
      status: 'IN_PROGRESS',
      currentPhase: 'TARGET_SETTING',
      majorFunctions: ipcrMajorFunctions,
      finalRating: null,
      adjectivalRating: null,
      notedByChairId: null,
      verifiedByVpaa: null,
      approvedByDeanId: null,
      createdAt: new Date().toISOString(),
    };

    console.log('Created new IPCR:', newIPCR.id, 'with', totalTargets, 'targets across', ipcrMajorFunctions.length, 'major functions');

    // Add to state
    setIpcrs(prev => [...prev, newIPCR]);

    return newIPCR;
  };

  const getFacultyIPCRs = (userId: string): IPCR[] => {
    return ipcrs.filter(ipcr => ipcr.facultyId === userId);
  };

  const updateOPCRTargets = async (newMajorFunctions: any[]) => {
    console.log('Updating OPCR with new major functions:', newMajorFunctions.length);
    
    // Merge new major functions with existing ones
    const updatedOPCR = {
      ...opcr,
      majorFunctions: [...opcr.majorFunctions, ...newMajorFunctions],
    };
    
    setOpcr(updatedOPCR);
    
    // Save to AsyncStorage
    try {
      await AsyncStorage.setItem('opcr', JSON.stringify(updatedOPCR));
      console.log('OPCR saved to AsyncStorage');
    } catch (error) {
      console.error('Error saving OPCR:', error);
    }
  };

  const updateIPCR = (id: string, updates: Partial<IPCR>) => {
    setIpcrs(prev =>
      prev.map(ipcr => (ipcr.id === id ? { ...ipcr, ...updates } : ipcr))
    );
  };

  const deleteIPCR = (id: string) => {
    setIpcrs(prev => prev.filter(ipcr => ipcr.id !== id));
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
        deleteIPCR,
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
