import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  Animated,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { BarChart } from "react-native-chart-kit";

export default function InsightsScreen() {
  const [people, setPeople] = useState([]);
  const [paidCount, setPaidCount] = useState(0);
  const [unpaidCount, setUnpaidCount] = useState(0);
  const [upcomingCount, setUpcomingCount] = useState(0);
  const [monthlyData, setMonthlyData] = useState({ labels: [], data: [] });

  const centerTextAnim = new Animated.Value(0);

  useEffect(() => {
    fetchData();
    animateCenterText();
  }, []);

  const animateCenterText = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(centerTextAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(centerTextAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const fetchData = async () => {
    const data = await AsyncStorage.getItem("people");
    const list = data ? JSON.parse(data) : [];

    const today = new Date();

    let paid = 0;
    let unpaid = 0;
    let upcoming = 0;
    let monthlyMap = {};

    list.forEach((person) => {
      if (person.paid) paid++;
      else unpaid++;

      // Consider payments due within next 7 days as upcoming
      const dueDate = calculateNextDueDate(person);
      if (
        dueDate &&
        dueDate > today &&
        (dueDate - today) / (1000 * 3600 * 24) <= 7
      ) {
        upcoming++;
      }

      // Count logs by month-year for bar chart
      const logKey = `log_${person.id}`;

      // We won't get logs here efficiently; so approximate by createdAt month
      const monthYear = new Date(person.createdAt).toLocaleString("default", {
        month: "short",
        year: "2-digit",
      });
      monthlyMap[monthYear] = (monthlyMap[monthYear] || 0) + 1;
    });

    setPeople(list);
    setPaidCount(paid);
    setUnpaidCount(unpaid);
    setUpcomingCount(upcoming);

    // Sort months ascending by date for chart labels
    const sortedLabels = Object.keys(monthlyMap).sort((a, b) => {
      const [aMonth, aYear] = a.split(" ");
      const [bMonth, bYear] = b.split(" ");
      const dateA = new Date(`20${aYear}`, monthNameToNumber(aMonth));
      const dateB = new Date(`20${bYear}`, monthNameToNumber(bMonth));
      return dateA - dateB;
    });

    setMonthlyData({
      labels: sortedLabels,
      data: sortedLabels.map((label) => monthlyMap[label]),
    });
  };

  // Calculate next due date (reuse logic)
  const calculateNextDueDate = (person) => {
    try {
      const start = new Date(person.startDate);
      const interval = Number(person.interval);
      const lastPaid = person.lastPaid ? new Date(person.lastPaid) : null;
      let baseDate = lastPaid && lastPaid > start ? lastPaid : start;
      const nextDue = new Date(baseDate);
      nextDue.setDate(nextDue.getDate() + interval);
      return nextDue;
    } catch {
      return null;
    }
  };

  const monthNameToNumber = (name) => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return months.indexOf(name);
  };

  const screenWidth = Dimensions.get("window").width - 40;

  const pulseOpacity = centerTextAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.3],
  });

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 24 }}
    >
      <Text style={styles.heading}>
        <Ionicons name="analytics-outline" size={24} color="#00ffff" /> Insights
        & Stats
      </Text>
      <Text style={styles.info}>
        Summary and trends to help track your payments.
      </Text>

      <View style={styles.cardsRow}>
        <View style={[styles.card, { backgroundColor: "#004d4d" }]}>
          <Text style={styles.cardTitle}>Total People</Text>
          <Text style={styles.cardValue}>{people.length}</Text>
        </View>
        <View style={[styles.card, { backgroundColor: "#1de9b6" }]}>
          <Text style={styles.cardTitle}>Paid</Text>
          <Text style={styles.cardValue}>{paidCount}</Text>
        </View>
        <View style={[styles.card, { backgroundColor: "#ff4d4d" }]}>
          <Text style={styles.cardTitle}>Not Paid</Text>
          <Text style={styles.cardValue}>{unpaidCount}</Text>
        </View>
        <View style={[styles.card, { backgroundColor: "#3399ff" }]}>
          <Text style={styles.cardTitle}>Due Soon</Text>
          <Text style={styles.cardValue}>{upcomingCount}</Text>
        </View>
      </View>

      <Text style={[styles.chartTitle, { marginTop: 30, marginBottom: 10 }]}>
        Payment Activity Over Months
      </Text>

      {monthlyData.labels.length > 0 ? (
        <BarChart
          data={{
            labels: monthlyData.labels,
            datasets: [{ data: monthlyData.data }],
          }}
          width={screenWidth}
          height={220}
          fromZero
          yAxisLabel=""
          chartConfig={{
            backgroundGradientFrom: "#0d1117",
            backgroundGradientTo: "#0d1117",
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(0, 255, 255, ${opacity})`,
            labelColor: () => "#66eee9",
            style: { borderRadius: 16 },
            propsForDots: { r: "6", strokeWidth: "2", stroke: "#00ffff" },
          }}
          style={{ borderRadius: 16, alignSelf: "center" }}
        />
      ) : (
        <Text style={styles.noChartDataText}>
          Not enough data to display chart.
        </Text>
      )}

      <Animated.View
        style={[
          styles.pulseCircle,
          { opacity: pulseOpacity, alignSelf: "center", marginTop: 30 },
        ]}
      >
        <Ionicons name="bar-chart" size={36} color="#00ffff" />
      </Animated.View>

      <Text style={styles.footer}>
        Keep track of your payments easily with timely reminders and monthly
        insights.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#0d1117",
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 32,
  },
  heading: {
    color: "#00ffff",
    fontWeight: "bold",
    fontSize: 22,
    marginBottom: 4,
    flexDirection: "row",
    alignItems: "center",
  },
  info: {
    color: "#7ae4e1",
    fontSize: 13,
    marginBottom: 20,
    fontStyle: "italic",
  },
  cardsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    flexBasis: "48%",
    borderRadius: 16,
    padding: 20,
    marginBottom: 18,
    elevation: 3,
    shadowColor: "#00ffff",
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    alignItems: "center",
  },
  cardTitle: {
    color: "#b9ffff",
    fontWeight: "600",
    fontSize: 14,
  },
  cardValue: {
    fontSize: 38,
    fontWeight: "bold",
    color: "#00ffff",
    marginTop: 6,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#00ffff",
  },
  noChartDataText: {
    color: "#555",
    fontSize: 14,
    textAlign: "center",
    marginTop: 16,
  },
  pulseCircle: {
    padding: 10,
  },
  footer: {
    marginTop: 40,
    color: "#77c7c7",
    fontSize: 14,
    fontStyle: "italic",
    textAlign: "center",
    paddingHorizontal: 20,
  },
});
