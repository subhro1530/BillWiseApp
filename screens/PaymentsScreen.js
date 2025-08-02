import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Animated,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons, Feather } from "@expo/vector-icons";

function daysBetween(a, b) {
  return Math.floor((b - a) / (1000 * 60 * 60 * 24));
}

export default function PaymentsScreen() {
  const [people, setPeople] = useState([]);
  const [paidOpen, setPaidOpen] = useState(false);
  const [unpaidOpen, setUnpaidOpen] = useState(true);

  useEffect(() => {
    const getPeople = async () => {
      const data = await AsyncStorage.getItem("people");
      setPeople(data ? JSON.parse(data) : []);
    };
    getPeople();
  }, []);

  const today = new Date();

  // Determine who is due
  const getStatus = (person) => {
    let lastPaid = person.lastPaid
      ? new Date(person.lastPaid)
      : new Date(person.createdAt);
    const daysElapsed = daysBetween(lastPaid, today);
    if (daysElapsed >= person.duration) return "unpaid";
    return "paid";
  };

  const markPaid = async (idx) => {
    const updated = people.slice();
    updated[idx].lastPaid = today.toISOString();
    setPeople(updated);
    await AsyncStorage.setItem("people", JSON.stringify(updated));
  };

  const sections = [
    {
      title: "Not Paid",
      icon: "close-circle",
      color: "#ff4d4d",
      open: unpaidOpen,
      setOpen: setUnpaidOpen,
      data: people
        .map((p, i) => ({ ...p, idx: i }))
        .filter((p) => getStatus(p) === "unpaid"),
    },
    {
      title: "Paid",
      icon: "checkmark-circle",
      color: "#1de9b6",
      open: paidOpen,
      setOpen: setPaidOpen,
      data: people
        .map((p, i) => ({ ...p, idx: i }))
        .filter((p) => getStatus(p) === "paid"),
    },
  ];

  const sectionHeader = (sec) => (
    <TouchableOpacity
      style={[styles.sectionHeader, { borderBottomColor: sec.color }]}
      onPress={() => sec.setOpen((o) => !o)}
      activeOpacity={0.7}
    >
      <Ionicons name={sec.icon} size={22} color={sec.color} />
      <Text style={[styles.secTitle, { color: sec.color }]}>{sec.title}</Text>
      <Feather
        name={sec.open ? "chevron-up" : "chevron-down"}
        size={18}
        color={sec.color}
      />
      <Text style={{ color: "#fff", marginLeft: 7, fontSize: 14 }}>
        ({sec.data.length})
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#181822" }}>
      <View style={styles.header}>
        <Ionicons name="wallet" size={20} color="#00ffff" />
        <Text style={styles.heading}>Payment Status</Text>
        <Text style={styles.subtitle}>
          Track paid/unpaid reminders per the chosen cycle. Tap to mark as paid.
        </Text>
      </View>
      {sections.map((sec) => (
        <View key={sec.title}>
          {sectionHeader(sec)}
          {sec.open && (
            <FlatList
              data={sec.data}
              keyExtractor={(_, i) => i.toString()}
              renderItem={({ item }) => (
                <View
                  style={[
                    styles.card,
                    sec.title === "Not Paid" && {
                      borderColor: "#ff4d4d",
                      borderWidth: 2,
                    },
                  ]}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={styles.name}>
                      {item.name}{" "}
                      <Text style={{ color: "#aaa", fontSize: 13 }}>
                        ₹{item.amount}
                      </Text>
                    </Text>
                    <Text style={styles.meta}>Every {item.duration} days</Text>
                    {item.note && (
                      <Text style={styles.note}>"{item.note}"</Text>
                    )}
                    {item.lastPaid ? (
                      <Text style={styles.lastPaid}>
                        Last paid:{" "}
                        {new Date(item.lastPaid).toLocaleDateString()}
                      </Text>
                    ) : (
                      <Text style={styles.lastPaid}>Never paid</Text>
                    )}
                  </View>
                  {sec.title === "Not Paid" && (
                    <TouchableOpacity
                      style={styles.payBtn}
                      onPress={() => markPaid(item.idx)}
                      activeOpacity={0.89}
                    >
                      <Ionicons
                        name="checkmark-done"
                        size={20}
                        color="#1de9b6"
                      />
                      <Text
                        style={{
                          color: "#1de9b6",
                          marginLeft: 4,
                          fontWeight: "700",
                        }}
                      >
                        Mark Paid
                      </Text>
                    </TouchableOpacity>
                  )}
                  {sec.title === "Not Paid" && (
                    <Ionicons
                      name="close-circle"
                      size={22}
                      color="#ff4d4d"
                      style={{ marginLeft: 7 }}
                    />
                  )}
                  {sec.title === "Paid" && (
                    <Ionicons
                      name="checkmark-circle"
                      size={22}
                      color="#1de9b6"
                      style={{ marginLeft: 7 }}
                    />
                  )}
                </View>
              )}
            />
          )}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  header: { paddingTop: 36, paddingBottom: 10, paddingHorizontal: 22 },
  heading: { color: "#00ffff", fontWeight: "bold", fontSize: 19, marginTop: 2 },
  subtitle: { color: "#66efe0", fontSize: 13, marginBottom: 8 },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 2,
    marginTop: 14,
    paddingBottom: 2,
    marginHorizontal: 15,
  },
  secTitle: { marginLeft: 11, fontWeight: "700", fontSize: 17, flex: 1 },
  card: {
    padding: 18,
    backgroundColor: "#232347",
    borderRadius: 14,
    marginHorizontal: 20,
    marginTop: 9,
    marginBottom: 2,
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#28288a",
    borderWidth: 1.2,
  },
  name: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  meta: { color: "#2ee8d6", fontSize: 14 },
  note: { color: "#ddd", fontStyle: "italic", marginVertical: 2 },
  lastPaid: { color: "#bee0ff", fontSize: 12, marginTop: 2 },
  payBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0c2539",
    borderRadius: 7,
    padding: 8,
    marginLeft: 7,
    borderColor: "#1de9b6",
    borderWidth: 1,
  },
});
