import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { ThemeProvider } from './src/context/ThemeContext';
import CustomDrawer from './src/components/CustomDrawer';

// Screens
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import FacultyScreen from './src/screens/FacultyScreen';
import FacultyDetailScreen from './src/screens/FacultyDetailScreen';
import AnnouncementsScreen from './src/screens/AnnouncementsScreen';
import AnnouncementFormScreen from './src/screens/AnnouncementFormScreen';
import ReportsScreen from './src/screens/ReportsScreen';
import ReportFormScreen from './src/screens/ReportFormScreen';
import IPCRScreen from './src/screens/IPCRScreen';
import IPCRFormScreen from './src/screens/IPCRFormScreen';
import WorkloadScreen from './src/screens/WorkloadScreen';
import DocumentsScreen from './src/screens/DocumentsScreen';
import FolderFormScreen from './src/screens/FolderFormScreen';
import MessagesScreen from './src/screens/MessagesScreen';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

function DrawerNavigator() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawer {...props} />}
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          width: 260,
        },
      }}
    >
      <Drawer.Screen name="Dashboard" component={DashboardScreen} />
      <Drawer.Screen name="Reports" component={ReportsScreen} />
      <Drawer.Screen name="IPCR" component={IPCRScreen} />
      <Drawer.Screen name="Workload" component={WorkloadScreen} />
      <Drawer.Screen name="Documents" component={DocumentsScreen} />
      <Drawer.Screen name="Faculty" component={FacultyScreen} />
      <Drawer.Screen name="Announcements" component={AnnouncementsScreen} />
      <Drawer.Screen name="Messages" component={MessagesScreen} />
    </Drawer.Navigator>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="Main" component={DrawerNavigator} />
          <Stack.Screen name="FacultyDetail" component={FacultyDetailScreen} />
          <Stack.Screen name="AnnouncementForm" component={AnnouncementFormScreen} />
          <Stack.Screen name="ReportForm" component={ReportFormScreen} />
          <Stack.Screen name="IPCRForm" component={IPCRFormScreen} />
          <Stack.Screen name="FolderForm" component={FolderFormScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
}
