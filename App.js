import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons, MaterialCommunityIcons, Feather } from "@expo/vector-icons";

import LoginScreen from "./screens/LoginScreen";
import SignupScreen from "./screens/SignupScreen";
import HomeScreen from "./screens/HomeScreen";
import PaymentsScreen from "./screens/PaymentsScreen";
import PeopleScreen from "./screens/PeopleScreen";
import InsightsScreen from "./screens/InsightsScreen";
import SettingsScreen from "./screens/SettingsScreen.js";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarStyle: {
          backgroundColor: "#101116",
          borderTopWidth: 0,
          height: 56,
          elevation: 14,
        },
        tabBarLabelStyle: {
          fontWeight: "600",
          fontSize: 12,
        },
        tabBarActiveTintColor: "#00ffff",
        tabBarInactiveTintColor: "#bbb",
        tabBarIcon: ({ color, focused, size }) => {
          let iconName;
          size = 22;
          switch (route.name) {
            case "Home":
              iconName = focused ? "add-circle" : "add-circle-outline";
              return <Ionicons name={iconName} color={color} size={size} />;
            case "Payments":
              iconName = focused ? "wallet" : "wallet-outline";
              return <Ionicons name={iconName} color={color} size={size} />;
            case "People":
              iconName = focused ? "people" : "people-outline";
              return <Ionicons name={iconName} color={color} size={size} />;
            case "Insights":
              return (
                <MaterialCommunityIcons
                  name={focused ? "chart-bar" : "chart-bar"}
                  color={color}
                  size={size}
                />
              );
            case "Settings":
              return <Feather name="settings" color={color} size={size} />;
            default:
              return null;
          }
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="People" component={PeopleScreen} />
      <Tab.Screen name="Payments" component={PaymentsScreen} />
      <Tab.Screen name="Insights" component={InsightsScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="MainTabs" component={MainTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
