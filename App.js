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
import SettingsScreen from "./screens/SettingsScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: true, // Show header on all tabs
        headerStyle: { backgroundColor: "#00ffff" }, // Cyan header
        headerTintColor: "#101116", // Dark title/icons for contrast
        headerTitleStyle: { fontWeight: "bold" },
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
        tabBarIcon: ({ color, size = 22, focused }) => {
          switch (route.name) {
            case "Home":
              return (
                <Ionicons
                  name={focused ? "add-circle" : "add-circle-outline"}
                  color={color}
                  size={size}
                />
              );
            case "Payments":
              return (
                <Ionicons
                  name={focused ? "wallet" : "wallet-outline"}
                  color={color}
                  size={size}
                />
              );
            case "People":
              return (
                <Ionicons
                  name={focused ? "people" : "people-outline"}
                  color={color}
                  size={size}
                />
              );
            case "Insights":
              return (
                <MaterialCommunityIcons
                  name="chart-bar"
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
        // Default cyan header for stack screens
        screenOptions={{
          headerShown: false,
          headerStyle: { backgroundColor: "#00ffff" },
          // headerTintColor: "#101116",
          headerTitleStyle: { fontWeight: "bold" },
        }}
      >
        {/* Hide header on Login and Signup if desired */}
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Signup"
          component={SignupScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="MainTabs" component={MainTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
