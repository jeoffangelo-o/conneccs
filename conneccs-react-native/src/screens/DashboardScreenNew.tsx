import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { StatusBar } from 'expo-status-bar';
import { SvgIcon } from '../components/SvgIcon';
import { IpcrCard } from '../../components/IpcrCard';
import usersData from '../../assets/data/users.json';
import { User } from '../../types';
import { WebScrollView } from '../components/WebScrollView';

type FilterType = 'All' | 'Completed' | 'In Progress' | 'Revision Required';

export default function DashboardScreen({ navigation }) {
  const { colors, isDark } = useTheme();
  const { user } = useAuth();
  const { ipcrs } = useData();
  const styles = createStyles(colors);
  const [activeFilter, setActiveFilter] = useState<FilterType>('All');

  const users = usersData as User[];

  // Filter IPCRs based on user role
  const visibleIPCRs = useMemo(() => {
    let filtered = ipcrs;
    
    // Role-based filtering
    if (user?.role === 'FACULTY') {
      filtered = filtered.filter(ipcr => ipcr.facultyId === user.id);
    }
    
    // Status filtering
    if (activeFilter !== 'All') {
      if (activeFilter === 'Completed') {
        filtered = filtered.filter(ipcr => ipcr.status === 'COMPLETED');
      } else if (activeFilter === 'In Progress') {
        filtered = filtered.filter(ipcr => ipcr.status === 'IN_PROGRESS');
      } else if (activeFilter === 'Revision Required') {
        filtered = filtered.filter(ipcr => ipcr.status === 'REVISION_REQUIRED');
      }
    }
    
    return filtered;
  }, [ipcrs, user, activeFilter]);

  // Calculate stats
  const stats = useMemo(() => {
    const total = visibleIPCRs.length;
    const completed = visibleIPCRs.filter(i => i.status === 'COMPLETED').length;
    const inProgress = visibleIPCRs.filter(i => i.status === 'IN_PROGRESS').length;
    const avgRating = visibleIPCRs
      .filter(i => i.finalRating !== null)
      .reduce((sum, i) => sum + (i.finalRating || 0), 0) / 
      (visibleIPCRs.filter(i => i.finalRating !== null).length || 1);

    return {
      total,
      completed,
      inProgress,
      avgRating: avgRating.toFixed(1),
    };
  }, [visibleIPCRs]);

  const filters: FilterType[] = ['All', 'Completed', 'In Progress', 'Revision Required'];

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
            <Text style={styles.topbarTitleText}>Dashboard</Text>
            <Text style={styles.topbarBreadcrumb}>IPCR Management System</Text>
          </View>
        </View>
        <View style={styles.topbarRight}>
          {user?.role === 'FACULTY' && (
            <TouchableOpacity 
              style={styles.btnPrimary}
              onPress={() => navigation.navigate('CreateIPCR')}
            >
              <SvgIcon name="plus" size={18} color="#fff" style={{}} />
              <Text style={styles.btnPrimaryText}>New IPCR</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity 
            style={styles.topbarIconBtn}
            onPress={() => navigation.navigate('Notifications')}
          >
            <SvgIcon name="bell" size={22} color={colors.text2} style={{}} />
            <View style={styles.badge}>
              <Text style={styles.badgeText}>3</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <WebScrollView 
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.total}</Text>
            <Text style={styles.statLabel}>Total IPCRs</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.completed}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.inProgress}</Text>
            <Text style={styles.statLabel}>In Progress</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.avgRating}</Text>
            <Text style={styles.statLabel}>Avg Rating</Text>
          </View>
        </View>

        {/* Filter Chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterRow}
          contentContainerStyle={styles.filterContent}
        >
          {filters.map(filter => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterChip,
                activeFilter === filter && styles.filterChipActive,
              ]}
              onPress={() => setActiveFilter(filter)}
            >
              <Text
                style={[
                  styles.filterChipText,
                  activeFilter === filter && styles.filterChipTextActive,
                ]}
              >
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* IPCR List */}
        <View style={styles.list}>
          {visibleIPCRs.map(ipcr => {
            const faculty = users.find(u => u.id === ipcr.facultyId);
            if (!faculty) return null;
            
            return (
              <IpcrCard
                key={ipcr.id}
                ipcr={ipcr}
                faculty={faculty}
                onPress={() => navigation.navigate('IPCRDetail', { id: ipcr.id })}
              />
            );
          })}
          
          {visibleIPCRs.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No IPCRs found</Text>
            </View>
          )}
        </View>
      </WebScrollView>
    </View>
  );
}

const createStyles = (colors) => StyleSheet.create({
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
  topbarRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  btnPrimary: {
    backgroundColor: colors.accent,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    gap: 6,
  },
  btnPrimaryText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  topbarIconBtn: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: colors.red,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  badgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    minWidth: '47%',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 32,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#9ca3af',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  filterRow: {
    marginBottom: 20,
  },
  filterContent: {
    gap: 8,
  },
  filterChip: {
    backgroundColor: '#2a2a2a',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  filterChipActive: {
    backgroundColor: '#fff',
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#9ca3af',
  },
  filterChipTextActive: {
    color: '#000',
  },
  list: {
    marginBottom: 20,
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#6b7280',
  },
});
