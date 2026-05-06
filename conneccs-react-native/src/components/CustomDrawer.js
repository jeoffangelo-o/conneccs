import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { useTheme } from '../context/ThemeContext';
import { SvgIcon } from './SvgIcon';

// Simple icon component that works on web
const SimpleIcon = ({ name, size = 18, color }) => {
  const iconMap = {
    'grid-outline': 'grid',
    'document-text-outline': 'document',
    'pulse-outline': 'pulse',
    'time-outline': 'clock',
    'folder-outline': 'folder',
    'people-outline': 'users',
    'notifications-outline': 'bell',
    'chatbubble-outline': 'messageCircle',
    'sunny-outline': 'sun',
    'moon-outline': 'moon',
  };
  
  return <SvgIcon name={iconMap[name] || 'grid'} size={size} color={color} />;
};

export default function CustomDrawer(props) {
  const { colors, isDark, toggleTheme } = useTheme();
  const styles = createStyles(colors);

  const menuItems = [
    { name: 'Dashboard', icon: 'grid-outline', route: 'Dashboard', section: 'Main' },
    { name: 'Reports', icon: 'document-text-outline', route: 'Reports', section: 'Main' },
    { name: 'IPCR Monitoring', icon: 'pulse-outline', route: 'IPCR', section: 'Main' },
    { name: 'Workload', icon: 'time-outline', route: 'Workload', section: 'Main' },
    { name: 'Documents', icon: 'folder-outline', route: 'Documents', section: 'Main' },
    { name: 'Faculty', icon: 'people-outline', route: 'Faculty', section: 'People' },
    { name: 'Announcements', icon: 'notifications-outline', route: 'Announcements', section: 'People', badge: 4 },
    { name: 'Messages', icon: 'chatbubble-outline', route: 'Messages', section: 'People' },
  ];

  const renderSection = (section) => {
    const items = menuItems.filter(item => item.section === section);
    return (
      <View key={section}>
        <Text style={styles.sectionLabel}>{section}</Text>
        {items.map((item) => {
          const isFocused = props.state.routes[props.state.index].name === item.route;
          return (
            <TouchableOpacity
              key={item.route}
              style={[styles.navItem, isFocused && styles.navItemActive]}
              onPress={() => props.navigation.navigate(item.route)}
            >
              <SimpleIcon
                name={item.icon}
                size={18}
                color={isFocused ? colors.yellow : colors.text3}
              />
              <Text style={[styles.navText, isFocused && styles.navTextActive]}>
                {item.name}
              </Text>
              {item.badge && (
                <View style={styles.navBadge}>
                  <Text style={styles.navBadgeText}>{item.badge}</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/logo.png')}
            style={styles.logoImage}
          />
          <View>
            <Text style={styles.brandName}>ConneCCS</Text>
            <Text style={styles.brandTagline}>CCS Faculty Portal</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.navContainer} showsVerticalScrollIndicator={false}>
        {renderSection('Main')}
        {renderSection('People')}
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.userInfo}>
          <View style={styles.userAvatar}>
            <Text style={styles.userAvatarText}>D</Text>
          </View>
          <View style={styles.userDetails}>
            <Text style={styles.userName}>Dean's Office</Text>
            <Text style={styles.userRole}>dean</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.themeToggle} onPress={toggleTheme}>
          <SimpleIcon
            name={isDark ? 'sunny-outline' : 'moon-outline'}
            size={18}
            color={colors.text2}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const createStyles = (colors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg2,
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoImage: {
    width: 40,
    height: 40,
    borderRadius: 6,
  },
  brandName: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: -0.5,
    fontFamily: 'Syne',
  },
  brandTagline: {
    fontSize: 10,
    color: colors.text3,
    marginTop: 2,
  },
  navContainer: {
    flex: 1,
    padding: 12,
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.text3,
    textTransform: 'uppercase',
    letterSpacing: 1,
    paddingHorizontal: 8,
    paddingVertical: 8,
    marginTop: 8,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 2,
    position: 'relative',
    paddingLeft: 12,
  },
  navItemActive: {
    backgroundColor: 'rgba(244,208,63,0.15)',
    borderLeftWidth: 4,
    borderLeftColor: colors.yellow,
    paddingLeft: 8,
  },
  navIcon: {
    marginRight: 10,
  },
  navText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text3,
    flex: 1,
    marginLeft: 8,
  },
  navTextActive: {
    color: colors.yellow,
    fontWeight: '600',
  },
  navBadge: {
    backgroundColor: colors.red,
    borderRadius: 99,
    paddingHorizontal: 6,
    paddingVertical: 1,
    minWidth: 18,
    alignItems: 'center',
  },
  navBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 10,
  },
  userAvatar: {
    width: 34,
    height: 34,
    backgroundColor: colors.accent,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userAvatarText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
  },
  userRole: {
    fontSize: 11,
    color: colors.text3,
    textTransform: 'capitalize',
  },
  themeToggle: {
    width: 32,
    height: 32,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
