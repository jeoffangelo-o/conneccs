import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { StatusBar } from 'expo-status-bar';
import { SvgIcon } from '../components/SvgIcon';
import { IpcrCard } from '../../components/IpcrCard';
import usersData from '../../assets/data/users.json';
import { User } from '../../types';

type TabType = 'Pending' | 'Revision Required';

export default function ReviewQueueScreen({ navigation }) {
  const { colors, isDark } = useTheme();
  const { user } = useAuth();
  const { ipcrs, updateIPCR } = useData();
  const styles = createStyles(colors);
  const [activeTab, setActiveTab] = useState<TabType>('Pending');

  const users = usersData as User[];

  // Filter IPCRs for review based on role
  const reviewIPCRs = useMemo(() => {
    let filtered = ipcrs;

    // Role-based filtering
    if (user?.role === 'CHAIR') {
      // Chair reviews IPCRs from their program
      filtered = filtered.filter(ipcr => {
        const faculty = users.find(u => u.id === ipcr.facultyId);
        return faculty?.program === user.program;
      });
    } else if (user?.role === 'DEAN') {
      // Dean reviews all IPCRs from the department
      filtered = filtered.filter(ipcr => {
        const faculty = users.find(u => u.id === ipcr.facultyId);
        return faculty?.department === user.department;
      });
    } else {
      // Non-reviewers see nothing
      return [];
    }

    // Status filtering
    if (activeTab === 'Pending') {
      filtered = filtered.filter(ipcr => ipcr.status === 'PENDING_REVIEW');
    } else {
      filtered = filtered.filter(ipcr => ipcr.status === 'REVISION_REQUIRED');
    }

    return filtered;
  }, [ipcrs, user, activeTab, users]);

  const handleApprove = (ipcrId: string) => {
    Alert.alert(
      'Approve IPCR',
      'Are you sure you want to approve this IPCR?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Approve',
          onPress: () => {
            updateIPCR(ipcrId, {
              status: 'COMPLETED',
              reviewedBy: user?.id,
              reviewedAt: new Date().toISOString(),
            });
            Alert.alert('Success', 'IPCR has been approved');
          },
        },
      ]
    );
  };

  const handleRequestRevision = (ipcrId: string) => {
    Alert.alert(
      'Request Revision',
      'Are you sure you want to request revisions for this IPCR?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Request Revision',
          style: 'destructive',
          onPress: () => {
            updateIPCR(ipcrId, {
              status: 'REVISION_REQUIRED',
              reviewedBy: user?.id,
              reviewedAt: new Date().toISOString(),
            });
            Alert.alert('Success', 'Revision request has been sent');
          },
        },
      ]
    );
  };

  const tabs: TabType[] = ['Pending', 'Revision Required'];

  return (
    <View style={styles.container}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      
      {/* Topbar */}
      <View style={styles.topbar}>
        <View style={styles.topbarLeft}>
          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <SvgIcon name="menu" size={24} color={colors.text} style={{}} />
          </TouchableOpacity>
          <View style={styles.topbarTitle}>
            <Text style={styles.topbarTitleText}>Review Queue</Text>
            <Text style={styles.topbarBreadcrumb}>
              {reviewIPCRs.length} IPCR{reviewIPCRs.length !== 1 ? 's' : ''} pending review
            </Text>
          </View>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        {tabs.map(tab => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView 
        style={{ flex: 1 }} 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {reviewIPCRs.length === 0 ? (
          <View style={styles.emptyState}>
            <SvgIcon name="checkCircle" size={48} color={colors.text3} style={{}} />
            <Text style={styles.emptyText}>No IPCRs to review</Text>
          </View>
        ) : (
          <View style={styles.list}>
            {reviewIPCRs.map(ipcr => {
              const faculty = users.find(u => u.id === ipcr.facultyId);
              if (!faculty) return null;

              return (
                <View key={ipcr.id} style={styles.reviewItem}>
                  <IpcrCard
                    ipcr={ipcr}
                    faculty={faculty}
                    onPress={() => navigation.navigate('IPCRDetail', { id: ipcr.id })}
                  />
                  <View style={styles.reviewActions}>
                    <TouchableOpacity
                      style={styles.btnApprove}
                      onPress={() => handleApprove(ipcr.id)}
                    >
                      <SvgIcon name="checkCircle" size={18} color="#fff" style={{}} />
                      <Text style={styles.btnApproveText}>Approve</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.btnRevision}
                      onPress={() => handleRequestRevision(ipcr.id)}
                    >
                      <SvgIcon name="alertCircle" size={18} color={colors.red} style={{}} />
                      <Text style={styles.btnRevisionText}>Request Revision</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  topbar: {
    backgroundColor: colors.bg2,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingHorizontal: 24,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 48,
  },
  topbarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flex: 1,
  },
  topbarTitle: {
    flex: 1,
  },
  topbarTitleText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  topbarBreadcrumb: {
    fontSize: 11,
    color: colors.text3,
    marginTop: 2,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: colors.bg2,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tab: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: colors.accent,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text3,
  },
  tabTextActive: {
    color: colors.accent,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  list: {
    gap: 16,
  },
  reviewItem: {
    marginBottom: 16,
  },
  reviewActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  btnApprove: {
    flex: 1,
    backgroundColor: '#10b981',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  btnApproveText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  btnRevision: {
    flex: 1,
    backgroundColor: colors.bg2,
    borderWidth: 1,
    borderColor: colors.red,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  btnRevisionText: {
    color: colors.red,
    fontSize: 14,
    fontWeight: '600',
  },
  emptyState: {
    padding: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: colors.text3,
    marginTop: 16,
  },
});
