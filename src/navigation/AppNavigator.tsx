import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import FocusPage from '../pages/FocusPage';
import EmptyStatePage from '../pages/EmptyStatePage';
import OverviewPage from '../pages/OverviewPage';

export type RootStackParamList = {
  Focus: undefined;
  Empty: undefined;
  Overview: undefined;
  Goals: undefined;
  Create: undefined;
  Achievements: undefined;
  Memories: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="Focus"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Focus" component={FocusPage} />
      <Stack.Screen name="Empty" component={EmptyStatePage} />
      <Stack.Screen name="Overview" component={OverviewPage} />
      <Stack.Screen name="Goals" component={() => <></>} />
      <Stack.Screen name="Create" component={() => <></>} />
      <Stack.Screen name="Achievements" component={() => <></>} />
      <Stack.Screen name="Memories" component={() => <></>} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
