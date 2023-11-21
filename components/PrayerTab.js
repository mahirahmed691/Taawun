import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import * as Location from "expo-location";
import { Ionicons } from "@expo/vector-icons";

const PrayerTab = () => {
  const [prayerTimes, setPrayerTimes] = useState({
    Fajr: "Fetching...",
    Dhuhr: "Fetching...",
    Asr: "Fetching...",
    Maghrib: "Fetching...",
    Isha: "Fetching...",
  });
  const [locationData, setLocationData] = useState(null);
  const [duas, setDuas] = useState([
    {
      title: "Dua for Fajr",
      content: "In the name of Allah, the Most Gracious, the Most Merciful.",
    },
    {
      title: "Dua for Dhuhr",
      content: "O Allah, I seek refuge in You from laziness and incapacity.",
    },
    {
      title: "Dua for Asr",
      content:
        "Our Lord, do not impose blame upon us if we forget or make a mistake.",
    },
    {
      title: "Dua for Maghrib",
      content: "O Allah, make my heart obedient to Your commands.",
    },
    {
      title: "Dua for Isha",
      content:
        "Our Lord, grant us from Yourself mercy and prepare for us from our affair right guidance.",
    },
  ]);
  const [isArabic, setIsArabic] = useState(false);

  const toggleLanguage = () => {
    setIsArabic(!isArabic);
  };

  const getTranslatedDuaTitle = (dua) => {
    // Add Arabic translations for dua titles here
    const arabicTitleTranslations = {
      "Dua for Fajr": "دعاء الفجر",
      "Dua for Dhuhr": "دعاء الظهر",
      "Dua for Asr": "دعاء العصر",
      "Dua for Maghrib": "دعاء المغرب",
      "Dua for Isha": "دعاء العشاء",
    };

    return isArabic ? arabicTitleTranslations[dua.title] : dua.title;
  };

  const getTranslatedDua = (dua) => {
    // Add Arabic translations for dua content here
    const arabicTranslations = {
      "Dua for Fajr": "بسم الله الرحمن الرحيم",
      "Dua for Dhuhr": "اللهم إني أعوذ بك من الكسل والهرم",
      "Dua for Asr": "ربنا لا تؤاخذنا إن نسينا أو أخطأنا",
      "Dua for Maghrib": "اللهم اجعل قلبي مطيعا لأوامرك",
      "Dua for Isha": "ربنا آتنا من لدنك رحمة وهيئ لنا من أمرنا رشدا",
    };

    return isArabic ? arabicTranslations[dua.title] : dua.content;
  };

  useEffect(() => {
    const fetchPrayerTimes = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();

        if (status === "granted") {
          const location = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.High,
          });

          const { latitude, longitude } = location.coords;

          const address = await Location.reverseGeocodeAsync({
            latitude,
            longitude,
          });

          if (address && address.length > 0) {
            setLocationData(address[0]);
          }

          // TODO: Fetch prayer times using latitude and longitude
          // For this example, I'm using dummy data
          const dummyPrayerTimes = {
            Fajr: "5:30 AM",
            Dhuhr: "12:30 PM",
            Asr: "3:45 PM",
            Maghrib: "6:15 PM",
            Isha: "8:00 PM",
          };

          setPrayerTimes(dummyPrayerTimes);
        } else {
          console.log("Location permission denied");
        }
      } catch (error) {
        console.error("Error fetching location:", error);
      }
    };

    fetchPrayerTimes();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.locationContainer}>
        <Ionicons name="location" size={18} color="#ff4d4d" />
        <Text style={styles.locationValue}>
          {locationData?.city}, {locationData?.country}{" "}
        </Text>
      </View>

      {Object.entries(prayerTimes).map(([prayerName, time]) => (
        <View key={prayerName} style={styles.prayerTimeContainer}>
          <Text style={styles.prayerName}>{prayerName}</Text>
          <Text style={styles.prayerTime}>{time}</Text>
        </View>
      ))}

      <View style={styles.duasContainer}>
        <View style={styles.languageToggleContainer}>
          <TouchableOpacity onPress={toggleLanguage}>
            <Text style={styles.languageToggleText}>
              {isArabic ? "Switch to English" : "تبديل إلى العربية"}
            </Text>
          </TouchableOpacity>
        </View>
        <Ionicons name="book" size={24} color="#ff4d4d" />
        <Text style={styles.duasHeader}>Recommended Duas</Text>
        {duas.map((dua, index) => (
          <View key={index} style={styles.duaContainer}>
            <Text style={styles.duaTitle}>
              {isArabic ? getTranslatedDuaTitle(dua) : dua.title}
            </Text>
            <Text style={styles.duaContent}>
              {isArabic ? getTranslatedDua(dua) : dua.content}
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f0f0f0",
  },
  prayerTimeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
    padding: 10,
    backgroundColor: "#000",
    borderRadius: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  prayerName: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#ff4d4d",
  },
  prayerTime: {
    fontSize: 12,
    color: "#fff",
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
  },
  locationValue: {
    fontSize: 10,
    color: "#000",
    fontWeight: "700",
    marginLeft: 8,
  },
  duasContainer: {
    marginTop: 10,
    padding: 12,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  duasHeader: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ff4d4d",
    marginBottom: 8,
  },
  duaContainer: {
    marginBottom: 12,
  },
  duaTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#ff4d4d",
  },
  duaContent: {
    fontSize: 10,
    color: "#000",
  },
  languageToggleContainer: {
    alignItems: "flex-end",
    marginBottom: 8,
  },
  languageToggleText: {
    fontSize: 12,
    color: "#ff4d4d",
    textDecorationLine: "underline",
  },
});

export default PrayerTab;