import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { Picker } from "@react-native-picker/picker";

const API_KEY = "13b6faa2b4mshdda0b913e7dba34p1f7d5ajsn63fe5c12b31d"; 

const App = () => {
  const [month, setMonth] = useState<number | null>(null);
  const [day, setDay] = useState<string>("");
  const [fact, setFact] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const validateDay = (selectedMonth: number | null, dayInput: string): boolean => {
    if (!selectedMonth) return false;

    const dayNumber = parseInt(dayInput);
    if (isNaN(dayNumber) || dayNumber < 1 || dayNumber > 31) {
      setError("Please enter a valid day (1-31).");
      return false;
    }

    
    const daysInMonth: { [key: number]: number } = {
      1: 31, 2: 29, 3: 31, 4: 30, 5: 31, 6: 30,
      7: 31, 8: 31, 9: 30, 10: 31, 11: 30, 12: 31
    };

    if (dayNumber > daysInMonth[selectedMonth]) {
      setError(`This month only has ${daysInMonth[selectedMonth]} days.`);
      return false;
    }

    setError(null);
    return true;
  };

  const fetchFact = async (selectedMonth: number, selectedDay: number) => {
    setLoading(true);
    setFact(null);

    const url = `https://numbersapi.p.rapidapi.com/${selectedMonth}/${selectedDay}/date?json=true`;

    const options = {
      method: "GET",
      headers: {
        "x-rapidapi-key": API_KEY,
        "x-rapidapi-host": "numbersapi.p.rapidapi.com",
      },
    };

    try {
      const response = await fetch(url, options);
      if (!response.ok) throw new Error("Failed to fetch fact");

      const data = await response.json();
      setFact(data.text);
    } catch (error) {
      Alert.alert("Error", "Could not fetch the fact. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (selectedMonth: number | null, dayInput: string) => {
    setDay(dayInput);
    if (selectedMonth && validateDay(selectedMonth, dayInput)) {
      fetchFact(selectedMonth, parseInt(dayInput));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Fun Fact Finder</Text>

      <Picker
        selectedValue={month}
        onValueChange={(value) => {
          setMonth(value);
          if (value !== null && validateDay(value, day)) {
            fetchFact(value, parseInt(day));
          }
        }}
        style={styles.picker}
      >
        <Picker.Item label="Select a month..." value={null} />
        <Picker.Item label="January" value={1} />
        <Picker.Item label="February" value={2} />
        <Picker.Item label="March" value={3} />
        <Picker.Item label="April" value={4} />
        <Picker.Item label="May" value={5} />
        <Picker.Item label="June" value={6} />
        <Picker.Item label="July" value={7} />
        <Picker.Item label="August" value={8} />
        <Picker.Item label="September" value={9} />
        <Picker.Item label="October" value={10} />
        <Picker.Item label="November" value={11} />
        <Picker.Item label="December" value={12} />
      </Picker>

      <TextInput
        style={styles.input}
        placeholder="Enter day (1-31)"
        keyboardType="numeric"
        value={day}
        onChangeText={(text) => handleChange(month, text)}
      />

      {error && <Text style={styles.error}>{error}</Text>}

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        fact && <Text style={styles.fact}>{fact}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  picker: {
    width: "80%",
    height: 50,
    backgroundColor: "#fff",
    borderRadius: 10,
  },
  input: {
    width: "80%",
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    fontSize: 18,
    backgroundColor: "#fff",
    marginTop: 10,
  },
  error: {
    color: "red",
    marginTop: 10,
    fontSize: 16,
  },
  fact: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: "500",
    textAlign: "center",
    padding: 10,
    backgroundColor: "#dbeafe",
    borderRadius: 10,
  },
});

export default App;
