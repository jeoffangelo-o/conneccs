import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { ThemeProvider } from './src/context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import CustomDrawer from './src/components/CustomDrawer';

// Screens
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import DashboardScreen from './src/screens/DashboardScreenNew';
import IPCRDetailScreen from './src/screens/IPCRDetailScreen';
import OPCRScreen from './src/screens/OPCRScreen';
import CreateIPCRScreen from './src/screens/CreateIPCRScreen';
import NotificationsScreen from './src/screens/NotificationsScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import ReviewQueueScreen from './src/screens/ReviewQueueScreen';

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
      <Drawer.Screen name="OPCR" component={OPCRScreen} />
      <Drawer.Screen name="ReviewQueue" component={ReviewQueueScreen} />
      <Drawer.Screen name="Notifications" component={NotificationsScreen} />
      <Drawer.Screen name="Profile" component={ProfileScreen} />
    </Drawer.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
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
              <Stack.Screen name="IPCRDetail" component={IPCRDetailScreen} />
              <Stack.Screen name="CreateIPCR" component={CreateIPCRScreen} />
            </Stack.Navigator>
          </NavigationContainer>
        </ThemeProvider>
      </DataProvider>
    </AuthProvider>
  );
}
