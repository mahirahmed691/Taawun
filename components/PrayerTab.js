import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Vibration,
  Animated,
  ImageBackground,
} from "react-native";
import debounce from "lodash/debounce";
import { Button } from "react-native-paper";
import * as Location from "expo-location";
import { Ionicons } from "@expo/vector-icons";
import * as Speech from "expo-speech";
import Modal from "react-native-modal";
import styles from "../styles";
import * as Animatable from "react-native-animatable";
import FastImage from "react-native-fast-image";

const getRandomImageURL = () => {
  const { width, height } = Dimensions.get("window");

  const randomImageNumber = Math.floor(Math.random() * 1000);

  return `https://picsum.photos/${width}/${height}?image=${randomImageNumber}`;
};

const calculateTimeUntilPrayer = (currentTime, prayerTimes) => {
  const prayerNames = Object.keys(prayerTimes);
  let timeUntil = "";
  let nextPrayer = "";

  for (let i = 0; i < prayerNames.length; i++) {
    const prayerTime = new Date(
      `${currentTime.toDateString()} ${prayerTimes[prayerNames[i]]}`
    );
    if (prayerTime > currentTime) {
      const timeDiff = Math.floor((prayerTime - currentTime) / (60 * 1000)); // in minutes
      const hours = Math.floor(timeDiff / 60);
      const minutes = timeDiff % 60;
      timeUntil = `${hours}h ${minutes}m`;
      nextPrayer = prayerNames[i];
      break;
    }
  }

  return { timeUntil, nextPrayer };
};

const PrayerTab = () => {
  const [currentZikrText, setCurrentZikrText] = useState("");
  const [currentImageUrl, setCurrentImageUrl] = useState(getRandomImageURL());
  const [roundCounter, setRoundCounter] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentZikrTitle, setCurrentZikrTitle] = useState({
    arabic: "",
    english: "",
  });
  const [prayerTimes, setPrayerTimes] = useState({
    Fajr: "Fetching...",
    Dhuhr: "Fetching...",
    Asr: "Fetching...",
    Maghrib: "Fetching...",
    Isha: "Fetching...",
  });
  const [locationData, setLocationData] = useState(null);
  const [intervalId, setIntervalId] = useState(null);
  const [timeUntilNextPrayer, setTimeUntilNextPrayer] = useState("");
  const [nextPrayer, setNextPrayer] = useState("");
  const [clockIntervalId, setClockIntervalId] = useState(null);
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
    {
      title: "Dua for Sunrise",
      content: "O Allah, bless this day with goodness and prosperity.",
    },
    {
      title: "Dua for Sunset",
      content: "O Allah, thank you for the blessings of this day.",
    },
    {
      title: "Dua for Rain",
      content:
        "O Allah, bless us with beneficial rain and make it a source of mercy.",
    },
    {
      title: "Dua for Travel",
      content: "O Allah, protect us on our journey and bring us back safely.",
    },
    // Add more duas as needed
  ]);

  const [isArabic, setIsArabic] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [counter, setCounter] = useState(0);
  const [emojiAnimation] = useState(new Animated.Value(0));

  const Clock = React.memo(
    ({ timeUntilNextPrayer, nextPrayer, nextPrayerTime }) => {
      const [currentTime, setCurrentTime] = useState(new Date());

      useEffect(() => {
        const clockInterval = setInterval(() => {
          setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(clockInterval);
      }, []);

      const formattedTime = currentTime.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      });

      const [hours, minutes, seconds] = formattedTime.split(":");

      return (
        <View style={styles.clockContainer}>
          <ImageBackground
            source={require("../assets/logo.png")}
            style={styles.clockBackground}
            resizeMode="cover"
          >
            <View style={styles.clockOverlay}>
              <View style={styles.timeContainer}>
                <Text style={styles.timeSegment}>{hours}</Text>
                <Text style={styles.timeSeparator}>:</Text>
                <Text style={styles.timeSegment}>{minutes}</Text>
              </View>

              <Text style={styles.seconds}>{seconds}</Text>
            </View>
          </ImageBackground>
        </View>
      );
    }
  );

  const debouncedUpdateImage = useMemo(() => {
    return debounce(() => {
      setCurrentImageUrl(getRandomImageURL());
    }, 20000);
  }, []);

  const preloadClockImage = async () => {
    await Image.prefetch(require("../assets/logo.png"));
  };

  useEffect(() => {
    preloadClockImage();
  }, []);

  useEffect(() => {
    const imageInterval = setInterval(() => {
      debouncedUpdateImage();
    }, 20000);

    return () => clearInterval(imageInterval);
  }, [debouncedUpdateImage]);

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

  useEffect(() => {
    const imageInterval = setInterval(() => {
      setCurrentImageUrl(getRandomImageURL());
    }, 20000);

    return () => clearInterval(imageInterval);
  }, []);

  const [zikrItems, setZikrItems] = useState([
    {
      title: "سُبْحَانَ اللّٰه",
      englishTitle: "SubhanAllah",
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

  const [floatingEmojis, setFloatingEmojis] = useState([]);

  const animateFloatingEmoji = () => {
    const newFloatingEmojis = [...floatingEmojis];
    const key = Date.now().toString();
    newFloatingEmojis.push({
      key,
      emoji: "❤️",
      translateY: new Animated.Value(Dimensions.get("window").height * 2),
      translateX: new Animated.Value(100), // Change this to 0 for the top left
      fontSize: 200,
    });

    setFloatingEmojis(newFloatingEmojis);

    Animated.parallel([
      Animated.timing(
        newFloatingEmojis[newFloatingEmojis.length - 1].translateY,
        {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }
      ),
      Animated.timing(
        newFloatingEmojis[newFloatingEmojis.length - 1].translateX,
        {
          toValue: 0, // Change this to 0 for the top left
          duration: 1000,
          useNativeDriver: true,
        }
      ),
    ]).start(() => {
      // Remove the emoji after the animation is complete
      setFloatingEmojis((prevEmojis) =>
        prevEmojis.filter((item) => item.key !== key)
      );
    });
  };

  const handleModalPress = () => {
    if (isModalOpen) {
      Vibration.vibrate(10);
    }
  };

  const handleHapticTouch = () => {
    if (isModalOpen) {
      Vibration.vibrate(50);
    }

    setZikrCount((prevCount) => prevCount + 1);
  };

  const handleZikrPress = async (zikr) => {
    try {
      setCurrentZikrTitle({
        arabic: zikr.title,
        english: zikr.englishTitle || "",
      });

      await Speech.speak(zikr.title);

      if (zikr.content) {
        await Speech.speak(zikr.content);
      }

      setZikrCount((prevCount) => {
        const newCount = prevCount + 1;

        if (newCount % 10 === 0) {
          setRoundCounter((prevRoundCounter) => prevRoundCounter + 1);
          return 0;
        }

        return newCount;
      });

      setModalVisible(true);
      setIsModalOpen(true);

      if (isModalOpen) {
        Vibration.vibrate(0);
      }

      if (counter % 100 === 0) {
        setRoundCounter((prevRoundCounter) => prevRoundCounter + 1);
        setCounter(0);
      }
    } catch (error) {
      console.error("Error handling zikr press:", error);
    }
  };

  const stopCounter = () => {
    setModalVisible(false);
    setIsModalOpen(false);
    clearInterval(intervalId);

    setCounter(0);
    setRoundCounter(0);
  };

  const handleEmojiPress = () => {
    animateFloatingEmoji();
    setCounter((prevCounter) => prevCounter + 1);
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

  const readDua = async (dua) => {
    try {
      await Speech.speak(getTranslatedDuaTitle(dua));

      if (dua.content) {
        await Speech.speak(getTranslatedDua(dua));
      }
    } catch (error) {
      console.error("Error reading dua:", error);
    }
  };

  useEffect(() => {
    const updateTimeUntilNextPrayer = () => {
      const currentTime = new Date();
      const { timeUntil, nextPrayer } = calculateTimeUntilPrayer(
        currentTime,
        prayerTimes
      );

      setTimeUntilNextPrayer(timeUntil);
      setNextPrayer(nextPrayer);
    };

    updateTimeUntilNextPrayer();

    const clockInterval = setInterval(updateTimeUntilNextPrayer, 1000);
    setClockIntervalId(clockInterval);

    return () => clearInterval(clockInterval);
  }, [prayerTimes]);

  return (
    <ScrollView
      contentContainerStyle={styles.container3}
      onTouchStart={handleHapticTouch}
    >
      <Clock
        timeUntilNextPrayer={timeUntilNextPrayer}
        nextPrayer={nextPrayer}
        nextPrayerTime={prayerTimes[nextPrayer]}
      />

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
            onPress={() => readDua(dua)}
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
            onPress={() => {
              handleZikrPress(zikr);
              handleEmojiPress();
            }}
          >
            <Text style={styles.zikrTitle}>{zikr.title}</Text>
            <Text style={styles.zikrDescription}>{zikr.description}</Text>
            <Text style={styles.zikrCount}>Count: {zikrCount}</Text>
          </TouchableOpacity>
        ))}
        <Modal
          isVisible={modalVisible}
          onBackdropPress={handleModalPress}
          style={{ ...styles.modalContainer}}
        >
          <TouchableOpacity
            style={{ flex: 1 }}
            activeOpacity={1}
            onPress={handleEmojiPress}
          >
            <View style={styles.modalContent}>
              <View
                style={{
                  zIndex: 1,
                  marginTop: "70%",
                  width: "100%",
                  borderRadius: 10,
                  position: "absolute",
                  alignSelf: "center",
                  paddingBottom: 40,
                  overflow: "hidden",
                }}
              >
                <Image
                  source={require("../assets/clock.jpeg")}
                  style={{width:"100%", height:'50%'}}
                />
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    padding: 40,
                  }}
                >
                  <Text style={styles.roundCounter}>
                    Rounds: {roundCounter}
                  </Text>
                </View>

                <Text style={styles.counterText}>{counter}</Text>
                <Text style={styles.currentZikrText}>
                  Say {"\n"}
                  {currentZikrTitle.arabic}
                </Text>
                {currentZikrTitle.english && (
                  <Text style={styles.currentZikrText}>
                    {currentZikrTitle.english}
                  </Text>
                )}
              </View>
              <Animated.View
                style={{ ...styles.floatingEmojisContainer, zIndex: 2 }}
              >
                {floatingEmojis.map((item) => (
                  <Animatable.Text
                    key={item.key}
                    animation="slideInUp"
                    iterationCount={1}
                    style={[
                      styles.floatingEmoji,
                      { transform: [{ translateY: item.translateY }] },
                    ]}
                  >
                    {item.emoji}
                  </Animatable.Text>
                ))}
              </Animated.View>

              <Image
                source={{ uri: currentImageUrl }}
                style={styles.backgroundImage}
              />
              <Button
                onPress={stopCounter}
                contentStyle={styles.stopCounterButton}
                style={{
                  position: "absolute",
                  bottom: 50,
                  width: "100%",
                  alignSelf: "center",
                }}
              >
                <Text style={{ color: "#fff" }}> Stop Zikr</Text>
              </Button>
            </View>
          </TouchableOpacity>
        </Modal>
      </View>
    </ScrollView>
  );
};

export default PrayerTab;
