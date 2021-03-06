import React, { useState, useEffect } from "React";
import { withNavigation } from "react-navigation";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity
} from "react-native";

import api from "../services/api";

function SpotList({ tech, navigation }) {
  const [spots, setSpot] = useState([]);

  useEffect(() => {
    async function loadSpots() {
      const response = await api.get("/spots", { params: { tech } });
      setSpot(response.data);
    }
    loadSpots();
  }, []);

  function handleNavigate(spot) {
    navigation.navigate("Book", { spot });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Empresas que usam <Text style={styles.bold}>{tech}</Text>
      </Text>

      <FlatList
        style={styles.list}
        data={spots}
        keyExtractor={spot => spot._id}
        horizontal
        showHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <Image
              style={styles.thumbnail}
              source={{ uri: item.thumbnail_url.mobile }}
            />
            <Text style={styles.company}>{item.company}</Text>
            <Text style={styles.price}>
              {item.price ? `R$${item.price}` : "Gratuito"}
            </Text>
            <TouchableOpacity
              onPress={() => handleNavigate(item)}
              style={styles.button}
            >
              <Text style={styles.buttonText}>Solicitar reserva</Text>
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
    marginTop: 30
  },
  title: {
    fontSize: 20,
    color: "#444",
    paddingHorizontal: 20,
    marginBottom: 15
  },
  bold: {
    fontWeight: "bold"
  },
  list: {
    paddingHorizontal: 20
  },
  listItem: {
    marginRight: 15
  },
  thumbnail: {
    width: 200,
    height: 120,
    resizeMode: "cover",
    borderRadius: 2
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
  button: {
    height: 32,
    backgroundColor: "#f0545b",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 2,
    marginTop: 15
  },
  buttonText: {
    fontWeight: "bold",
    color: "#fff",
    fontSize: 15
  }
});

export default withNavigation(SpotList);
