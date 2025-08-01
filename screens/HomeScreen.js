import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import moment from "moment";

export default function HomeScreen() {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const navigation = useNavigation();

  const handleSubmit = async () => {
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
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Add Payment</Text>
      <TextInput
        placeholder="Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <TextInput
        placeholder="Amount"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        style={styles.input}
      />
      <TextInput
        placeholder="Note (Optional)"
        value={note}
        onChangeText={setNote}
        style={styles.input}
      />
      <Button title="Save Payment" onPress={handleSubmit} />
      <View style={{ marginTop: 20 }}>
        <Button
          title="View Payments"
          onPress={() => navigation.navigate("Payments")}
        />
        <Button
          title="Student List"
          onPress={() => navigation.navigate("Students")}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: "#111",
    minHeight: "100%",
  },
  title: {
    color: "#fff",
    fontSize: 22,
    marginBottom: 20,
    fontWeight: "bold",
  },
  input: {
    backgroundColor: "#222",
    color: "#fff",
    marginBottom: 15,
    padding: 12,
    borderRadius: 8,
    borderColor: "#444",
    borderWidth: 1,
  },
});
