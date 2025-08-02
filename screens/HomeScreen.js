import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Animated,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useHeaderHeight } from "@react-navigation/elements";

export default function HomeScreen() {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [interval, setInterval] = useState("30");
  const [startDate, setStartDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const notifAnim = useRef(new Animated.Value(-100)).current;
  const [notifMessage, setNotifMessage] = useState("");
  const headerHeight = useHeaderHeight();

  const showNotification = (msg) => {
    setNotifMessage(msg);
    Animated.timing(notifAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setTimeout(() => {
        Animated.timing(notifAnim, {
          toValue: -100,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          setNotifMessage(""); // Clear message after hide to fully hide the notification
        });
      }, 1700);
    });
  };

  const onChangeDate = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === "ios");
    if (selectedDate) setStartDate(selectedDate);
  };

  const handleSave = async () => {
    if (
      !name.trim() ||
      !amount.trim() ||
      isNaN(Number(amount)) ||
      Number(amount) <= 0
    ) {
      showNotification("Please enter valid Name and Amount");
      return;
    }
    if (!interval.trim() || isNaN(Number(interval)) || Number(interval) < 1) {
      showNotification("Interval must be a positive number");
      return;
    }
    try {
      const storedPeople = await AsyncStorage.getItem("people");
      const people = storedPeople ? JSON.parse(storedPeople) : [];
      const newPerson = {
        id: Date.now().toString(),
        name,
        amount: Number(amount),
        note,
        interval: Number(interval),
        startDate: startDate.toISOString(),
        lastPaid: null,
        createdAt: new Date().toISOString(),
      };
      people.push(newPerson);
      await AsyncStorage.setItem("people", JSON.stringify(people));
      showNotification("Reminder added successfully!");
      setName("");
      setAmount("");
      setNote("");
      setInterval("30");
      setStartDate(new Date());
    } catch (error) {
      showNotification("Failed to save data, try again.");
      console.error("Save error:", error);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.flexContainer}
      keyboardVerticalOffset={headerHeight + 20}
    >
      <ScrollView
        contentContainerStyle={[styles.container, { paddingTop: 12 }]}
      >
        <Text style={styles.title}>Add Payment Reminder</Text>
        <Text style={styles.infoLine}>
          Enter details of the person you want to receive payment from, select
          the start date, and set the reminder interval in days.
        </Text>
        <View style={styles.inputGroup}>
          <TextInput
            placeholder="Name"
            placeholderTextColor="#7aa1b7"
            value={name}
            onChangeText={setName}
            style={styles.input}
            autoCapitalize="words"
          />
          <TextInput
            placeholder="Amount (₹)"
            placeholderTextColor="#7aa1b7"
            value={amount}
            onChangeText={setAmount}
            style={styles.input}
            keyboardType="numeric"
          />
          <TextInput
            placeholder="Note (optional)"
            placeholderTextColor="#7aa1b7"
            value={note}
            onChangeText={setNote}
            style={styles.input}
          />
          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            style={styles.datePickerButton}
            activeOpacity={0.7}
          >
            <Ionicons name="calendar" size={18} color="#00ffff" />
            <Text style={styles.datePickerText}>
              Start Date: {startDate.toLocaleDateString()}
            </Text>
          </TouchableOpacity>
          <TextInput
            placeholder="Interval (days)"
            placeholderTextColor="#7aa1b7"
            value={interval}
            onChangeText={setInterval}
            style={styles.input}
            keyboardType="numeric"
            maxLength={4}
          />
        </View>
        {showDatePicker && (
          <DateTimePicker
            value={startDate}
            mode="date"
            display="calendar"
            onChange={onChangeDate}
            maximumDate={new Date(2100, 11, 31)}
            minimumDate={new Date(2000, 0, 1)}
          />
        )}
        <TouchableOpacity
          onPress={handleSave}
          activeOpacity={0.8}
          style={styles.saveButton}
        >
          <Ionicons name="alarm" size={20} color="#101116" />
          <Text style={styles.saveButtonText}>Set Reminder</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Only render notification when there is a message */}
      {notifMessage !== "" && (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.notification,
            {
              transform: [{ translateY: notifAnim }],
              top: headerHeight + 8,
            },
          ]}
        >
          <Text style={styles.notificationText}>{notifMessage}</Text>
        </Animated.View>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flexContainer: {
    flex: 1,
    backgroundColor: "#0d1117",
  },
  container: {
    paddingVertical: 40,
    paddingHorizontal: 28,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#00ffff",
    marginBottom: 8,
    letterSpacing: 1,
  },
  infoLine: {
    color: "#9ee7f0",
    fontSize: 14,
    fontStyle: "italic",
    marginBottom: 30,
  },
  inputGroup: {
    marginBottom: 24,
  },
  input: {
    backgroundColor: "#15202b",
    color: "#d0e8f2",
    fontSize: 17,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderColor: "#0e639c",
    borderWidth: 1,
    shadowColor: "#00ffff",
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 4,
    shadowOpacity: 0.25,
  },
  datePickerButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#15202b",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderColor: "#0e639c",
    borderWidth: 1,
  },
  datePickerText: {
    color: "#00ffff",
    fontWeight: "600",
    fontSize: 16,
    marginLeft: 10,
  },
  saveButton: {
    backgroundColor: "#00ffff",
    paddingVertical: 14,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#00ffff",
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    shadowOpacity: 0.35,
  },
  saveButtonText: {
    fontWeight: "800",
    fontSize: 16,
    color: "#101116",
    marginLeft: 10,
    letterSpacing: 2,
  },
  notification: {
    position: "absolute",
    left: 20,
    right: 20,
    height: 50,
    backgroundColor: "#002f33cc",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#00ffffcc",
    shadowColor: "#00ffff",
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 8,
    shadowOpacity: 0.6,
    zIndex: 9999,
  },
  notificationText: {
    color: "#00ffff",
    fontWeight: "600",
    fontSize: 16,
  },
});
