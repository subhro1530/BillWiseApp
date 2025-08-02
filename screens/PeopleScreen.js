import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  Animated,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons, Feather } from "@expo/vector-icons";

export default function PeopleScreen() {
  const [people, setPeople] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadPeople = async () => {
    const data = await AsyncStorage.getItem("people");
    setPeople(data ? JSON.parse(data) : []);
  };

  useEffect(() => {
    loadPeople();
  }, []);

  const deletePerson = (idx) => {
    Alert.alert("Delete Reminder", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        onPress: async () => {
          const updated = people.slice();
          updated.splice(idx, 1);
          setPeople(updated);
          await AsyncStorage.setItem("people", JSON.stringify(updated));
        },
        style: "destructive",
      },
    ]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#161822" }}>
      <View style={styles.header}>
        <Text style={styles.heading}>
          <Ionicons name="people-outline" size={20} color="#00ffff" /> Reminders
        </Text>
        <Text style={styles.subtitle}>
          Each person below is set up for a recurring payment reminder.
        </Text>
      </View>
      <FlatList
        data={people}
        onRefresh={() => {
          setRefreshing(true);
          loadPeople().then(() => setRefreshing(false));
        }}
        refreshing={refreshing}
        keyExtractor={(_, i) => i.toString()}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <Text style={styles.empty}>No reminders yet. Add from Home.</Text>
        }
        renderItem={({ item, index }) => (
          <View style={styles.card}>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.meta}>
                ₹{item.amount} every {item.duration} days
              </Text>
              {item.note ? (
                <Text style={styles.note}>"{item.note}"</Text>
              ) : null}
              <Text style={styles.added}>
                Added: {new Date(item.createdAt).toDateString()}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={() => deletePerson(index)}
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
  header: { paddingTop: 36, paddingBottom: 10, paddingHorizontal: 22 },
  heading: { color: "#00ffff", fontWeight: "bold", fontSize: 20 },
  subtitle: {
    color: "#87dffd",
    fontSize: 13,
    marginBottom: 4,
    fontStyle: "italic",
  },
  listContainer: { padding: 16 },
  card: {
    padding: 18,
    backgroundColor: "#212c3a",
    borderRadius: 13,
    marginBottom: 13,
    flexDirection: "row",
    alignItems: "center",
    elevation: 2,
  },
  name: { color: "#fff", fontWeight: "bold", fontSize: 17, marginBottom: 4 },
  meta: { color: "#39ecf7", fontSize: 14 },
  note: { color: "#bbb", fontStyle: "italic", marginVertical: 2 },
  added: { color: "#4adfff", fontSize: 11 },
  deleteBtn: {
    marginLeft: 16,
    backgroundColor: "#191b30",
    borderRadius: 8,
    padding: 6,
    borderWidth: 1,
    borderColor: "#25193f",
  },
  empty: { color: "#aaa", textAlign: "center", marginTop: 32, fontSize: 16 },
});
