import React, { useState } from "react";
import {
  View,
  Alert,
  SafeAreaView,
  AsyncStorage,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Image,
  ScrollView
} from "react-native";

import api from "../services/api";
import logo from "../assets/logo.png";

export default function Book({ navigation }) {
  const spot = navigation.getParam("spot");

  const [date, setDate] = useState("");

  async function handleSubmit() {
    const user_id = await AsyncStorage.getItem("user");
    await api.post(
      `/spots/${spot.id}/bookings`,
      { date },
      {
        headers: { user_id }
      }
    );
    Alert.alert("Solicitação de reserva enviada.");
    navigation.navigate("List");
  }

  function handleCancel() {
    navigation.navigate("List");
  }
  return (
    <SafeAreaView style={styles.container}>
      <Image style={styles.logo} source={logo} />
      <ScrollView>
        <View style={styles.item}>
          <Image
            style={styles.thumbnail}
            source={{ uri: spot.thumbnail_url.mobile }}
          />
          <Text style={styles.company}>{spot.company}</Text>
          <Text style={styles.price}>
            {spot.price ? `R$${spot.price}` : "Gratuito"}
          </Text>
        </View>
        <Text style={styles.label}>Data de interesse *</Text>
        <TextInput
          style={styles.input}
          placeholder="Qual data deseja reservar?"
          placeholderTextColor="#999"
          autoCapitalize="words"
          autoCorrect={false}
          value={date}
          onChangeText={setDate}
        />

        <TouchableOpacity onPress={handleSubmit} style={styles.button}>
          <Text style={styles.buttonText}>Solicitar Reserva</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleCancel}
          style={[styles.button, styles.buttonCancel]}
        >
          <Text style={styles.buttonText}>Cancelar</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 30
  },
  logo: {
    height: 32,
    resizeMode: "contain",
    alignSelf: "center",
    marginTop: 10
  },
  item: {
    justifyContent: "center",
    alignItems: "center"
  },
  thumbnail: {
    width: 200,
    height: 120,
    alignSelf: "center",
    resizeMode: "cover",
    borderRadius: 2,
    marginTop: 20
  },
  company: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginTop: 10
  },
  price: {
    fontSize: 15,
    color: "#999",
    marginTop: 5
  },
  label: {
    fontWeight: "bold",
    color: "#444",
    marginBottom: 8,
    marginTop: 30
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    paddingHorizontal: 20,
    fontSize: 16,
    color: "#444",
    height: 44,
    marginBottom: 20,
    marginTop: 8,
    borderRadius: 2
  },
  button: {
    height: 42,
    backgroundColor: "#f0545b",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 2
  },
  buttonCancel: {
    backgroundColor: "#ccc",
    marginTop: 10
  },
  buttonText: {
    fontWeight: "bold",
    color: "#fff",
    fontSize: 16
  }
});
