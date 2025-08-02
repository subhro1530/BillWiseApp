import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import { Ionicons } from "@expo/vector-icons";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [storedCredentials, setStoredCredentials] = useState(null);

  useEffect(() => {
    const fetchCredentials = async () => {
      const stored = await AsyncStorage.getItem("userCredentials");
      if (stored) setStoredCredentials(JSON.parse(stored));
    };
    fetchCredentials();
  }, []);

  const showToast = (message, type = "error") => {
    Toast.show({
      type,
      text1: message,
      position: "top",
      visibilityTime: 2500,
    });
  };

  const handleLogin = () => {
    if (!email || !password) {
      showToast("Please enter both email and password");
      return;
    }

    if (
      storedCredentials &&
      email === storedCredentials.email &&
      password === storedCredentials.password
    ) {
      showToast("Login successful", "success");
      setTimeout(() => navigation.replace("MainTabs"), 1000); // Replace with MainTabs instead of Home
    } else {
      showToast("Invalid email or password");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      <View style={styles.glass}>
        <Image source={require("../assets/icon.png")} style={styles.logo} />
        <Text style={styles.subtitle}>Track Payments Smartly</Text>

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

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Ionicons name="log-in-outline" size={22} color="white" />
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
          <Text style={styles.linkText}>Don’t have an account? Sign Up</Text>
        </TouchableOpacity>
      </View>

      <Toast
        config={{
          success: (props) => (
            <View style={[styles.toast, styles.success]}>
              <Text style={styles.toastText}>{props.text1}</Text>
            </View>
          ),
          error: (props) => (
            <View style={[styles.toast, styles.error]}>
              <Text style={styles.toastText}>{props.text1}</Text>
            </View>
          ),
        }}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0d0d0d",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  glass: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 20,
    padding: 25,
    width: "100%",
    shadowColor: "#fff",
    shadowOpacity: 0.1,
    shadowRadius: 20,
    borderColor: "rgba(255,255,255,0.1)",
    borderWidth: 1,
    alignItems: "center",
  },
  logo: {
    width: 180,
    height: 80,
    resizeMode: "contain",
    marginBottom: 15,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#aaa",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#1e1e1e",
    color: "#fff",
    padding: 12,
    marginBottom: 15,
    borderRadius: 10,
    borderColor: "#333",
    borderWidth: 1,
    width: "100%",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4c8df5",
    padding: 12,
    borderRadius: 10,
    justifyContent: "center",
    marginBottom: 15,
    width: "100%",
  },
  buttonText: {
    color: "#fff",
    marginLeft: 10,
    fontWeight: "bold",
  },
  linkText: {
    color: "#aaa",
    textAlign: "center",
    marginTop: 10,
  },
  toast: {
    padding: 10,
    borderRadius: 10,
    marginTop: 50,
    marginHorizontal: 20,
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  toastText: {
    color: "#fff",
    fontWeight: "bold",
  },
  success: {
    borderColor: "#00ff99",
    borderWidth: 1,
    backgroundColor: "rgba(0,255,153,0.1)",
  },
  error: {
    borderColor: "#ff4d4d",
    borderWidth: 1,
    backgroundColor: "rgba(255,77,77,0.1)",
  },
});
