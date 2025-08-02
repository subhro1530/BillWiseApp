import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";

export default function PeopleScreen() {
  const [people, setPeople] = useState([]);

  const loadPeople = async () => {
    const data = await AsyncStorage.getItem("people");
    setPeople(data ? JSON.parse(data) : []);
  };

  useFocusEffect(
    useCallback(() => {
      loadPeople();
    }, [])
  );

  const deletePerson = (id) => {
    Alert.alert(
      "Delete Reminder",
      "Are you sure you want to delete this reminder?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const updated = people.filter((p) => p.id !== id);
            setPeople(updated);
            await AsyncStorage.setItem("people", JSON.stringify(updated));
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="people-outline" size={20} color="#00ffff" />
        <Text style={styles.heading}>Payment Reminders</Text>
      </View>
      <Text style={styles.subtext}>
        People you have added reminders for. Delete if no longer needed.
      </Text>
      <FlatList
        data={people}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 24 }}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            No reminders yet. Add from Home tab.
          </Text>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.details}>
                ₹{item.amount} every {item.duration} days
              </Text>
              {item.note ? (
                <Text style={styles.note}>"{item.note}"</Text>
              ) : null}
              <Text style={styles.created}>
                Added on {new Date(item.createdAt).toLocaleDateString()}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={() => deletePerson(item.id)}
            >
              <Feather name="trash-2" size={20} color="#ff4d4d" />
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#161822",
    paddingTop: 36,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  heading: {
    color: "#00ffff",
    fontWeight: "bold",
    fontSize: 20,
    marginLeft: 6,
  },
  subtext: {
    color: "#87dffd",
    fontSize: 13,
    marginBottom: 12,
    fontStyle: "italic",
    maxWidth: "90%",
  },
  emptyText: {
    marginTop: 36,
    color: "#aaa",
    fontSize: 16,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#212c3a",
    padding: 18,
    borderRadius: 13,
    marginBottom: 14,
    flexDirection: "row",
    alignItems: "center",
    elevation: 2,
  },
  name: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 17,
    marginBottom: 4,
  },
  details: {
    color: "#39ecf7",
    fontSize: 14,
  },
  note: {
    color: "#bbb",
    fontStyle: "italic",
    marginVertical: 2,
  },
  created: {
    color: "#4adfff",
    fontSize: 11,
  },
  deleteBtn: {
    marginLeft: 16,
    backgroundColor: "#191b30",
    borderRadius: 8,
    padding: 6,
    borderWidth: 1,
    borderColor: "#25193f",
  },
});
