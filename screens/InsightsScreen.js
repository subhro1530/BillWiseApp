import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function InsightsScreen() {
  return (
    <View style={styles.container}>
      <MaterialCommunityIcons
        name="chart-bar"
        size={40}
        color="#00ffff"
        style={{ marginBottom: 18 }}
      />
      <Text style={styles.title}>Insights & Stats</Text>
      <Text style={styles.info}>
        See visual insights of your payments, trends, and next due reminders
        (Coming soon!)
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#13141b",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    color: "#00ffff",
    fontSize: 21,
    fontWeight: "bold",
    marginBottom: 10,
  },
  info: {
    color: "#aaa",
    fontSize: 14,
    textAlign: "center",
    fontStyle: "italic",
    maxWidth: 280,
  },
});
