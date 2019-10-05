import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  ScrollView,
  AsyncStorage,
  Image,
  TouchableOpacity,
  StyleSheet,
  Text,
  Alert
} from "react-native";

import socketio from "socket.io-client";
import Icon from "react-native-vector-icons/FontAwesome";

import logo from "../assets/logo.png";

import SpotList from "../components/SpotLis";

export default function List({ navigation }) {
  const [techs, setTechs] = useState([]);

  async function handleBack() {
    console.log("voltar");
    AsyncStorage.removeItem("user");
    navigation.navigate("Login");
  }

  useEffect(() => {
    AsyncStorage.getItem("user").then(user_id => {
      const socket = socketio("http://192.168.100.8:3000", {
        query: { user_id }
      });
      socket.on("booking_response", booking => {
        Alert.alert(
          `Sua reserva em ${booking.spot.company} em ${booking.date} foi ${
            booking.approved ? "APROVADA" : "REJEITADA"
          }.`
        );
      });
    });
  }, []);

  useEffect(() => {
    AsyncStorage.getItem("techs").then(data => {
      const techsArray = data.split(",").map(item => item.trim());
      setTechs(techsArray);
    });
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Image style={styles.logo} source={logo} />
      <TouchableOpacity onPress={handleBack} style={styles.buttonHome}>
        <Text>
          <Icon name="home" size={18} color="#999" /> Home
        </Text>
      </TouchableOpacity>
      <ScrollView>
        {techs.map(tech => (
          <SpotList key={tech} tech={tech} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  logo: {
    height: 32,
    resizeMode: "contain",
    alignSelf: "center",
    marginTop: 10
  },
  iconUser: {
    height: 30,
    resizeMode: "contain",
    alignSelf: "center"
  },
  buttonHome: {
    margin: 10
  }
});
