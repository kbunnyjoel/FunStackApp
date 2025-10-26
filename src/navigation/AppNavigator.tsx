import React from 'react';
import {NavigationContainer, Theme, DarkTheme} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Feather';

import {useAuthBootstrap} from '../hooks/useAuthBootstrap';
import SplashScreen from '../screens/SplashScreen';
import AuthScreen from '../screens/AuthScreen';
import NotificationScreen from '../screens/NotificationScreen';
import PhotoScreen from '../screens/PhotoScreen';
import TextScreen from '../screens/TextScreen';
import CalculatorScreen from '../screens/CalculatorScreen';
import {colors} from '../theme/colors';
import {MainTabParamList, RootStackParamList} from '../types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

type TabBarIconProps = {
  routeName: keyof MainTabParamList;
  color: string;
  size: number;
  focused: boolean;
};

const navigationTheme: Theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: colors.background,
    border: colors.cardBorder,
    card: colors.surface,
    notification: colors.primary,
    primary: colors.primary,
    text: colors.text,
  },
};

const tabScreenOptions = ({
  route,
}: {
  route: {name: keyof MainTabParamList};
}) => ({
  headerShown: false,
  tabBarStyle: {
    backgroundColor: colors.surface,
    borderTopColor: colors.cardBorder,
  },
  tabBarActiveTintColor: colors.primary,
  tabBarInactiveTintColor: colors.mutedText,
  tabBarIcon: ({
    color,
    size,
    focused,
  }: {
    color: string;
    size: number;
    focused: boolean;
  }) => (
    <TabBarIcon
      routeName={route.name}
      color={color}
      size={size}
      focused={focused}
    />
  ),
});

function TabBarIcon({routeName, color, size, focused}: TabBarIconProps) {
  const iconName = getTabIcon(routeName, focused);
  return <Icon name={iconName} size={size} color={color} />;
}

function Tabs() {
  return (
    <Tab.Navigator screenOptions={tabScreenOptions}>
      <Tab.Screen
        name="Notifications"
        component={NotificationScreen}
        options={{title: 'Notify'}}
      />
      <Tab.Screen
        name="Photos"
        component={PhotoScreen}
        options={{title: 'Photo'}}
      />
      <Tab.Screen
        name="Texts"
        component={TextScreen}
        options={{title: 'Text'}}
      />
      <Tab.Screen
        name="Calculator"
        component={CalculatorScreen}
        options={{title: 'Calculator'}}
      />
    </Tab.Navigator>
  );
}

function getTabIcon(routeName: keyof MainTabParamList, focused: boolean) {
  switch (routeName) {
    case 'Notifications':
      return focused ? 'bell' : 'bell';
    case 'Photos':
      return focused ? 'image' : 'image';
    case 'Texts':
      return focused ? 'edit-2' : 'edit-3';
    case 'Calculator':
      return focused ? 'cpu' : 'activity';
    default:
      return 'circle';
  }
}

export default function AppNavigator() {
  const {initializing, user} = useAuthBootstrap();

  return (
    <NavigationContainer theme={navigationTheme}>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        {initializing ? (
          <Stack.Screen name="Splash" component={SplashScreen} />
        ) : user ? (
          <Stack.Screen name="MainTabs" component={Tabs} />
        ) : (
          <Stack.Screen name="Auth" component={AuthScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
