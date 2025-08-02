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
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";

export default function HomeScreen() {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [duration, setDuration] = useState(30); // default: 30 days
  const [showPicker, setShowPicker] = useState(false);
  const [notifierAnim] = useState(new Animated.Value(-90));
  const [notif, setNotif] = useState("");

  const showNotification = (msg) => {
    setNotif(msg);
    Animated.timing(notifierAnim, {
      toValue: 0,
      duration: 290,
      useNativeDriver: true,
    }).start(() => {
      setTimeout(() => {
        Animated.timing(notifierAnim, {
          toValue: -90,
          duration: 290,
          useNativeDriver: true,
        }).start();
      }, 1750);
    });
  };

  const handleSubmit = async () => {
    if (!name.trim() || !amount.trim() || duration < 1) {
      showNotification("Fill name, amount, and duration (at least 1 day)");
      return;
    }
    const newPerson = {
      name,
      amount,
      note,
      duration, // days
      lastPaid: null, // will update when marked paid
      createdAt: new Date().toISOString(),
    };
    try {
      const data = await AsyncStorage.getItem("people");
      const people = data ? JSON.parse(data) : [];
      people.push(newPerson);
      await AsyncStorage.setItem("people", JSON.stringify(people));
      showNotification("Reminder added!");
      setName("");
      setAmount("");
      setNote("");
      setDuration(30);
    } catch (e) {
      showNotification("Error saving reminder");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1 }}
    >
      <View style={styles.header}>
        <Text style={styles.heading}>
          <Ionicons name="add-circle" size={20} color="#00ffff" />
          {"  "}Set Payment Reminder
        </Text>
        <Text style={styles.subtitle}>
          Add a person you expect payments from, set a custom cycle (monthly,
          weekly, etc).
        </Text>
      </View>
      <View style={styles.form}>
        <TextInput
          placeholder="Name"
          value={name}
          onChangeText={setName}
          style={styles.input}
          placeholderTextColor="#aaa"
        />
        <TextInput
          placeholder="Amount"
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
          style={styles.input}
          placeholderTextColor="#aaa"
        />
        <TextInput
          placeholder="Note (optional)"
          value={note}
          onChangeText={setNote}
          style={styles.input}
          placeholderTextColor="#aaa"
        />
        <View style={styles.durationRow}>
          <Text style={styles.durLabel}>Remind every</Text>
          <TextInput
            style={styles.durInput}
            keyboardType="numeric"
            value={duration.toString()}
            onChangeText={(v) => setDuration(Number(v.replace(/[^0-9]/g, "")))}
            maxLength={3}
          />
          <Text style={styles.durLabel}>days</Text>
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={handleSubmit}
          activeOpacity={0.89}
        >
          <Ionicons name="alarm" size={16} color="#101116" />
          <Text style={styles.buttonText}>ADD REMINDER</Text>
        </TouchableOpacity>
      </View>

      <Animated.View
        style={[
          styles.notification,
          { transform: [{ translateY: notifierAnim }] },
        ]}
      >
        <Text style={styles.notifText}>{notif}</Text>
      </Animated.View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 44,
    paddingBottom: 18,
    paddingHorizontal: 24,
    backgroundColor: "#121219",
  },
  heading: {
    color: "#00ffff",
    fontWeight: "bold",
    fontSize: 22,
    marginBottom: 2,
  },
  subtitle: {
    color: "#7acece",
    fontSize: 13,
    marginBottom: 2,
    fontStyle: "italic",
  },
  form: {
    backgroundColor: "#181822",
    padding: 24,
    borderRadius: 17,
    margin: 18,
    elevation: 2,
  },
  input: {
    backgroundColor: "#222d34",
    color: "#fff",
    marginBottom: 15,
    padding: 12,
    borderRadius: 8,
    fontSize: 15,
    borderColor: "#363d40",
    borderWidth: 1,
  },
  durationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  durLabel: {
    color: "#bbb",
    fontSize: 15,
    marginHorizontal: 5,
  },
  durInput: {
    width: 48,
    height: 36,
    backgroundColor: "#222d34",
    color: "#00ffff",
    fontWeight: "bold",
    borderRadius: 7,
    textAlign: "center",
    marginHorizontal: 3,
    fontSize: 17,
    borderColor: "#00ffff55",
    borderWidth: 1,
  },
  button: {
    marginTop: 6,
    backgroundColor: "#00ffff",
    borderRadius: 8,
    paddingVertical: 13,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    shadowColor: "#00ffff",
    shadowOpacity: 0.22,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
  },
  buttonText: {
    color: "#101116",
    fontWeight: "800",
    fontSize: 15,
    marginLeft: 8,
    letterSpacing: 1,
  },
  notification: {
    position: "absolute",
    top: 20,
    left: 32,
    right: 32,
    backgroundColor: "#101116ef",
    borderColor: "#00ffff",
    padding: 12,
    alignItems: "center",
    borderRadius: 10,
    zIndex: 99,
    borderWidth: 1,
  },
  notifText: {
    color: "#00ffff",
    fontWeight: "600",
    fontSize: 15,
  },
});
