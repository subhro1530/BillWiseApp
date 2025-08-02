import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";

export default function SettingsScreen() {
  return (
    <View style={styles.container}>
      <Feather
        name="settings"
        size={36}
        color="#00ffff"
        style={{ marginBottom: 16 }}
      />
      <Text style={styles.title}>Settings</Text>
      <Text style={styles.info}>
        Customize notifications, app appearance, and data export (Coming soon!)
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#161a2e",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    color: "#00ffff",
    fontSize: 21,
    fontWeight: "bold",
    marginBottom: 7,
  },
  info: {
    color: "#aaa",
    fontSize: 14,
    textAlign: "center",
    fontStyle: "italic",
    maxWidth: 260,
  },
});
