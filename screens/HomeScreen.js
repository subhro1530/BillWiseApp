// screens/HomeScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment";

export default function HomeScreen() {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");

  const handleSubmit = async () => {
    if (!name.trim() || !amount.trim()) {
      alert("Please enter both name and amount");
      return;
    }

    const newPayment = {
      name,
      amount,
      note,
      date: moment().format("YYYY-MM-DD"),
      time: moment().format("HH:mm"),
    };

    try {
      const existing = await AsyncStorage.getItem("payments");
      const payments = existing ? JSON.parse(existing) : [];
      payments.push(newPayment);
      await AsyncStorage.setItem("payments", JSON.stringify(payments));
      alert("Payment saved!");
      setName("");
      setAmount("");
      setNote("");
    } catch (error) {
      console.error("Error saving payment:", error);
      alert("Failed to save payment, please try again.");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Add Payment</Text>
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
          placeholder="Note (Optional)"
          value={note}
          onChangeText={setNote}
          style={styles.input}
          placeholderTextColor="#aaa"
        />
        <View style={styles.buttonWrapper}>
          <Button title="Save Payment" onPress={handleSubmit} color="#00ffff" />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    paddingTop: 48,
    backgroundColor: "#111",
    minHeight: "100%",
  },
  title: {
    color: "#fff",
    fontSize: 24,
    marginBottom: 28,
    fontWeight: "bold",
    alignSelf: "center",
  },
  input: {
    backgroundColor: "#222",
    color: "#fff",
    marginBottom: 18,
    padding: 14,
    borderRadius: 10,
    borderColor: "#3399cc",
    borderWidth: 1,
    fontSize: 16,
  },
  buttonWrapper: {
    marginTop: 16,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "transparent",
    elevation: 2,
    shadowColor: "#00ffff",
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
  },
});
