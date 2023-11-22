import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import { Button } from "react-native-paper";
import * as Location from "expo-location";
import { Ionicons } from "@expo/vector-icons";
import * as Speech from "expo-speech";
import Modal from "react-native-modal"; // Import the Modal component
import styles from "../styles";

const getRandomIslamicImage = async () => {
  try {
    const response = await fetch('https://your-heroku-app-name.herokuapp.com/getRandomIslamicImage');
    const data = await response.json();

    if (data.imageUrl) {
      return data.imageUrl;
    } else {
      console.error('Invalid response format from server:', data);
      return null;
    }
  } catch (error) {
    console.error('Error fetching random Islamic image:', error);
    return null;
  }
};



const PrayerTab = () => {
  const [currentZikrText, setCurrentZikrText] = useState("");
  const [currentIslamicImageUrl, setCurrentIslamicImageUrl] = useState(null);
  const [prayerTimes, setPrayerTimes] = useState({
    Fajr: "Fetching...",
    Dhuhr: "Fetching...",
    Asr: "Fetching...",
    Maghrib: "Fetching...",
    Isha: "Fetching...",
  });
  const [locationData, setLocationData] = useState(null);
  const [intervalId, setIntervalId] = useState(null);
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
  const [modalVisible, setModalVisible] = useState(false); // State to control the modal
  const [counter, setCounter] = useState(0);

  const toggleLanguage = () => {
    setIsArabic(!isArabic);
  };

  const getTranslatedDuaTitle = (dua) => {
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
    const arabicTranslations = {
      "Dua for Fajr": "بسم الله الرحمن الرحيم",
      "Dua for Dhuhr": "اللهم إني أعوذ بك من الكسل والهرم",
      "Dua for Asr": "ربنا لا تؤاخذنا إن نسينا أو أخطأنا",
      "Dua for Maghrib": "اللهم اجعل قلبي مطيعا لأوامرك",
      "Dua for Isha": "ربنا آتنا من لدنك رحمة وهيئ لنا من أمرنا رشدا",
    };

    return isArabic ? arabicTranslations[dua.title] : dua.content;
  };

  const [zikrItems, setZikrItems] = useState([
    {
      title: "SubhanAllah",
      description: "Glory is to Allah.",
    },
    {
      title: "Alhamdulillah",
      description: "All praise is due to Allah.",
    },
    {
      title: "Allahu Akbar",
      description: "Allah is the Greatest.",
    },
    // Add more zikr items as needed
  ]);

  const [zikrCount, setZikrCount] = useState(0);

  const handleZikrPress = async (zikr) => {
    try {
      // Set the current zikr text
      setCurrentZikrText(zikr.title);

      // Speak the zikr
      await Speech.speak(zikr.title);

      // Increment the zikr count
      setZikrCount((prevCount) => prevCount + 1);

      // Open the modal and start the counter
      setCounter(100);
      setModalVisible(true);
      startCounter();
    } catch (error) {
      console.error("Error handling zikr press:", error);
    }
  };

  const startCounter = () => {
    const id = setInterval(() => {
      setCounter((prevCounter) => {
        if (prevCounter === 0) {
          // Counter reached 0, close the modal
          setModalVisible(false);
          clearInterval(id);
          return 0;
        } else {
          return prevCounter - 1;
        }
      });
    }, 1000);

    setIntervalId(id); // Save the intervalId to state
  };

  const stopCounter = () => {
    // Stop the counter and close the modal
    setModalVisible(false);
    clearInterval(intervalId);
  };

  const startZikrSpeech = async () => {
    console.log("Start Zikr Speech button pressed");

    try {
      // Your existing code to fetch prayer times and location can remain unchanged

      // Simulate starting the zikr speech without actual speech recognition
      console.log("Simulating start of Zikr speech...");

      // Set up the event listener for simulated speech recognition results
      const simulatedSpeechResults = "SubhanAllah"; // Replace with your desired zikr text
      console.log("Simulated speech result:", simulatedSpeechResults);

      // Handle the simulated spoken text as needed

      // Simulate stopping speech recognition after receiving the result
      console.log("Simulating stop of Zikr speech...");
    } catch (error) {
      console.error("Error starting zikr speech:", error);
    }
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

  useEffect(() => {
    const fetchIslamicImage = async () => {
      const imageUrl = await getRandomIslamicImage();
      setCurrentIslamicImageUrl(imageUrl);
    };

    fetchIslamicImage();

    const imageInterval = setInterval(fetchIslamicImage, 20000);

    return () => clearInterval(imageInterval);
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
          <TouchableOpacity
            key={index}
            style={styles.duaContainer}
            onPress={() => handleZikrPress(dua)}
          >
            <Text style={styles.duaTitle}>{getTranslatedDuaTitle(dua)}</Text>
            <Text style={styles.duaContent}>{getTranslatedDua(dua)}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.zikrContainer}>
        <Ionicons name="heart" size={24} color="#ff4d4d" />
        <Text style={styles.zikrHeader}>Recommended Zikr</Text>
        {zikrItems.map((zikr, index) => (
          <TouchableOpacity
            key={index}
            style={styles.zikrItemContainer}
            onPress={() => handleZikrPress(zikr)}
          >
            <Text style={styles.zikrTitle}>{zikr.title}</Text>
            <Text style={styles.zikrDescription}>{zikr.description}</Text>
            <Text style={styles.zikrCount}>Count: {zikrCount}</Text>
          </TouchableOpacity>
        ))}

        {/* Modernized Modal for the counter with Zikr text */}
        <Modal isVisible={modalVisible} style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {currentIslamicImageUrl && (
              <Image
                source={{ uri: currentIslamicImageUrl }}
                style={styles.islamicImage}
              />
            )}

            <Text style={styles.counterText}>{counter}</Text>
            <Text style={styles.currentZikrText}>{currentZikrText}</Text>

            <Button
              mode="contained"
              onPress={stopCounter}
              contentStyle={styles.stopCounterButton}
            >
              Stop Counter
            </Button>
          </View>
        </Modal>
      </View>
    </ScrollView>
  );
};

export default PrayerTab;
