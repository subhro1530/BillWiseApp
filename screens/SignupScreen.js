import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Easing,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SignupScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [notif, setNotif] = useState("");
  const slideAnim = useState(new Animated.Value(-100))[0];

  const showNotification = (msg) => {
    setNotif(msg);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start(() => {
      setTimeout(() => {
        Animated.timing(slideAnim, {
          toValue: -100,
          duration: 300,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }).start();
      }, 2000);
    });
  };

  const handleSignup = async () => {
    if (email && password) {
      try {
        const user = { email, password };
        await AsyncStorage.setItem("userCredentials", JSON.stringify(user));
        showNotification("Account created. You can now log in.");
        setTimeout(() => navigation.replace("Login"), 1500);
        // Or navigate.replace("MainTabs") to auto-login after signup
      } catch (error) {
        showNotification("Failed to save user data.");
      }
    } else {
      showNotification("Please fill in all fields");
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.glass}>
        <Text style={styles.title}>Create Account</Text>
        <TextInput
          placeholder="Email"
          placeholderTextColor="#aaa"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />
        <TextInput
          placeholder="Password"
          placeholderTextColor="#aaa"
          style={styles.input}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity style={styles.button} onPress={handleSignup}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.linkText}>Already have an account? Log in</Text>
        </TouchableOpacity>
      </View>

      {notif !== "" && (
        <Animated.View
          style={[
            styles.notification,
            { transform: [{ translateY: slideAnim }] },
          ]}
        >
          <Text style={styles.notifText}>{notif}</Text>
        </Animated.View>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0c0c0c",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  glass: {
    width: "100%",
    padding: 25,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderColor: "rgba(255,255,255,0.1)",
    borderWidth: 1,
  },
  title: {
    fontSize: 24,
    color: "#fff",
    marginBottom: 25,
    textAlign: "center",
    fontWeight: "bold",
  },
  input: {
    backgroundColor: "#1a1a1a",
    color: "#fff",
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    borderColor: "#333",
    borderWidth: 1,
  },
  button: {
    backgroundColor: "#ff4d4d",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
  linkText: {
    color: "#aaa",
    textAlign: "center",
  },
  notification: {
    position: "absolute",
    top: 40,
    left: 20,
    right: 20,
    backgroundColor: "rgba(0,255,255,0.1)",
    borderColor: "#00ffff",
    borderWidth: 1,
    padding: 15,
    borderRadius: 10,
    zIndex: 999,
  },
  notifText: {
    color: "#00ffff",
    fontWeight: "600",
    textAlign: "center",
  },
});
