import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function StudentListScreen() {
  const [students, setStudents] = useState([]);
  const [newStudent, setNewStudent] = useState("");

  useEffect(() => {
    const loadStudents = async () => {
      const stored = await AsyncStorage.getItem("students");
      if (stored) setStudents(JSON.parse(stored));
    };
    loadStudents();
  }, []);

  const addStudent = async () => {
    if (!newStudent) return;
    const updated = [...students, newStudent];
    setStudents(updated);
    await AsyncStorage.setItem("students", JSON.stringify(updated));
    setNewStudent("");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Students</Text>
      <TextInput
        placeholder="Add Student Name"
        placeholderTextColor="#aaa"
        style={styles.input}
        value={newStudent}
        onChangeText={setNewStudent}
      />
      <TouchableOpacity style={styles.button} onPress={addStudent}>
        <Text style={styles.buttonText}>Add</Text>
      </TouchableOpacity>
      <FlatList
        data={students}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0d0d0d",
    padding: 20,
  },
  title: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
  },
  input: {
    backgroundColor: "#1e1e1e",
    color: "#fff",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#4c8df5",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  card: {
    backgroundColor: "#1a1a1a",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  name: {
    color: "#fff",
    fontSize: 16,
  },
});
