import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import LoginScreen from "./screens/LoginScreen";
import SignupScreen from "./screens/SignupScreen";
import HomeScreen from "./screens/HomeScreen";
import PaymentListScreen from "./screens/PaymentListScreen";
import StudentListScreen from "./screens/StudentListScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#101116",
          borderTopWidth: 0,
          height: 62,
          elevation: 10,
        },
        tabBarActiveTintColor: "#00ffff",
        tabBarInactiveTintColor: "#bbb",
        tabBarLabelStyle: {
          fontWeight: "bold",
          fontSize: 13,
          marginBottom: 4,
        },
        tabBarIcon: ({ color, focused }) => {
          let iconName = "";
          if (route.name === "Home")
            iconName = focused ? "home" : "home-outline";
          else if (route.name === "Payments")
            iconName = focused ? "wallet" : "wallet-outline";
          else if (route.name === "Students")
            iconName = focused ? "people" : "people-outline";
          return <Ionicons name={iconName} size={26} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Payments" component={PaymentListScreen} />
      <Tab.Screen name="Students" component={StudentListScreen} />
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
