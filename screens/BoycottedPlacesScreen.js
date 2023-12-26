import React, { useState, useRef, useEffect } from "react";
import {
  SafeAreaView,
  Text,
  FlatList,
  Image,
  ImageBackground,
  StatusBar,
  View,
  TouchableOpacity,
  TouchableHighlight,
} from "react-native";
import { Chip, IconButton, TextInput } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { DrawerActions } from "@react-navigation/native";
import styles from "../styles.js";
import boycottData from "../data/boycott.json";
import ModalSelector from "react-native-modal-selector";
import * as Sharing from "expo-sharing";
import { captureRef } from "react-native-view-shot";
import { Ionicons } from "@expo/vector-icons";
import {
  firestore,
  getFirestore,
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
} from "../config/firebaseConfig.js";
import PushNotificationService from "../components/PushNotifcation.js";

const BoycottedPlacesScreen = ({ navigation }) => {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [boycottedPlaces, setBoycottedPlaces] = useState(
    boycottData.boycottTargets
  );
  const [joinCounts, setJoinCounts] = useState({});
  const [currentSection, setCurrentSection] = useState("");
  const [currentIndustry, setCurrentIndustry] = useState("");
  const [industryFilter, setIndustryFilter] = useState(null);
  const [areAlternativesVisible, setAreAlternativesVisible] = useState(false);
  const [viewAsTiles, setViewAsTiles] = useState(false);
  const [showClearFilters, setShowClearFilters] = useState(false);

  const drawerNavigation = useNavigation();
  const viewRef = useRef();

  useEffect(() => {
    // Initialize the notification service
    PushNotificationService.configure();

    // Fetch and update join counts when the component mounts
    const fetchJoinCounts = async () => {
      const counts = {};

      try {
        const snapshot = await firestore.collection("boycottCounts").get();
        snapshot.forEach((doc) => {
          counts[doc.id] = doc.data().joinCount || 0;
        });

        setJoinCounts(counts);
      } catch (error) {
        console.error("Error fetching join counts:", error.message);
      }
    };

    fetchJoinCounts();
  }, []);

  const openDrawer = () => {
    drawerNavigation.dispatch(DrawerActions.openDrawer());
  };

  const renderSectionHeader = ({ section }) => (
    <Text style={styles.sectionHeader}>{section.title}</Text>
  );

  const industries = Array.from(
    new Set(boycottedPlaces.map((place) => place.industry))
  ).filter(Boolean);

  const handleIndustryFilterChange = (industry) => {
    setIndustryFilter(industry);
    setShowClearFilters(true);
  };

  const handleJoinBoycott = async (place, userEmail) => {
    const placeName = place.name;

    const placeRef = doc(firestore, "boycottCounts", placeName);

    try {
      // Get the current join count and joined users from Firestore
      const docSnapshot = await getDoc(placeRef);
      const currentJoinCount = docSnapshot.exists()
        ? docSnapshot.data().joinCount || 0
        : 0;
      const joinedUsers = docSnapshot.exists()
        ? docSnapshot.data().joinedUsers || []
        : [];

      // Check if the user has already joined
      if (joinedUsers.includes(userEmail)) {
        console.log(`User with email ${userEmail} has already joined.`);
        return;
      }

      // Update the join count and joined users
      await setDoc(placeRef, {
        joinCount: currentJoinCount + 1,
        joinedUsers: [...joinedUsers, userEmail], // Add the user's email
      });

      // Update the local joinCounts state
      setJoinCounts((prevJoinCounts) => ({
        ...prevJoinCounts,
        [placeName]: currentJoinCount + 1,
      }));

      console.log(
        `Boycott joined for ${placeName}. Join count: ${
          currentJoinCount + 1
        }. User: ${userEmail}`
      );
    } catch (error) {
      console.error("Error updating join count:", error.message);
    }
  };

  const clearFilters = () => {
    setSelectedCategory("");
    setIndustryFilter(null);
    setShowClearFilters(false);
  };

  const filteredPlaces = boycottedPlaces.filter((place) => {
    const matchesSearch = place.name
      ? place.name.toLowerCase().includes(search.toLowerCase())
      : false;

    const matchesCategory = selectedCategory
      ? place.industry &&
        place.industry.toLowerCase() === selectedCategory.toLowerCase()
      : true;

    const matchesIndustry = industryFilter
      ? place.industry &&
        place.industry.toLowerCase() === industryFilter.toLowerCase()
      : true;

    return matchesSearch && matchesCategory && matchesIndustry;
  });

  const groupedPlaces = filteredPlaces.reduce((acc, place) => {
    const firstLetter = place.name[0].toUpperCase();
    if (!acc[firstLetter]) {
      acc[firstLetter] = [];
    }
    acc[firstLetter].push(place);
    return acc;
  }, {});

  const sectionedData = Object.keys(groupedPlaces)
    .sort() // Sort keys alphabetically
    .map((key) => {
      const sortedData = groupedPlaces[key].sort((a, b) =>
        a.name.localeCompare(b.name)
      );

      const height = sortedData.length * 200;

      return {
        title: key,
        data: sortedData,
        height,
      };
    });

  const renderItem = ({ item }) => {
    const itemJoinCount = joinCounts[item.name] || 0;
    const alternatives = item.alternatives || [];

    return (
      <>
        {viewAsTiles ? (
          <TouchableOpacity
            style={styles.tileItemContainer}
            onPress={() =>
              navigation.navigate("FromTheRiver", {
                screen: "PlaceDetailScreen",
                params: { place: item },
              })
            }
          >
            <Image source={{ uri: item.image }} style={styles.tileItemImage} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.listItem}
            onPress={() =>
              navigation.navigate("FromTheRiver", {
                screen: "PlaceDetailScreen",
                params: { place: item },
              })
            }
          >
            <ImageBackground
              source={{ uri: item.image }}
              style={styles.imageBackground}
            >
              <Chip
                style={{
                  width: "50%",
                  backgroundColor: "crimson",
                  borderRadius: 0,
                  padding: 3,
                  top: 0,
                  position: "absolute",
                  left: 0,
                }}
              >
                <Text
                  style={{
                    color: "white",
                    fontSize: 15,
                    fontWeight: "800",
                    alignSelf: "center",
                  }}
                >
                  Boycotting: {itemJoinCount}
                </Text>
              </Chip>
              <TouchableOpacity
                style={styles.joinBoycottButton}
                onPress={() => handleJoinBoycott(item)}
                disabled={joinCounts[item.name] !== undefined} // Disable the button if user has already joined
              >
                <Text style={styles.joinBoycottButtonText}>
                  {joinCounts[item.name] !== undefined
                    ? `Joined (${itemJoinCount})`
                    : "Join Boycott"}
                </Text>
              </TouchableOpacity>
            </ImageBackground>
            <Text style={{ fontWeight: "bold" }}>{item.name}</Text>
            <Text style={{ fontWeight: "400", marginTop: 5 }}>
              {item.description}
            </Text>
          </TouchableOpacity>
        )}
      </>
    );
  };

  const renderDynamicHeader = () => {
    const industryToDisplay =
      currentSection &&
      sectionedData.find((section) => section.title === currentSection)?.data[0]
        ?.industry;

    const selectedIndustry = industryFilter || industryToDisplay;

    return (
      <View style={styles.dynamicHeaderContainer}>
        <Text style={styles.dynamicHeaderText}>
          {selectedIndustry
            ? `Industry: ${selectedIndustry}`
            : "All Industries"}
        </Text>
      </View>
    );
  };

  const renderTileItem = ({ item }) => (
    <TouchableOpacity
      style={styles.listItem}
      onPress={() =>
        navigation.navigate("FromTheRiver", {
          screen: "PlaceDetailScreen",
          params: { place: item },
        })
      }
    >
      <Image source={{ uri: item.image }} style={styles.tileItemImage} />
    </TouchableOpacity>
  );

  const onShare = async () => {
    try {
      const uri = await captureRef(viewRef, {
        format: "png",
        quality: 0.8,
      });

      if (!(await Sharing.isAvailableAsync())) {
        alert("Sharing is not available on your device");
        return;
      }

      await Sharing.shareAsync(uri, {
        mimeType: "image/png",
        dialogTitle: "Share this view",
        UTI: "public.png",
        title: "Check out this amazing view from the app!",
      });
    } catch (error) {
      console.error("Sharing failed:", error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container} ref={viewRef}>
      <View style={styles.headerContainer}>
        <View style={styles.searchBarContainer}>
          <TextInput
            style={styles.searchBar}
            placeholderTextColor="black"
            backgroundColor="white"
            mode="outlined"
            placeholder="Search boycotted places..."
            onChangeText={(text) => setSearch(text)}
          />
        </View>
        {showClearFilters && (
          <TouchableOpacity
            style={styles.clearFiltersButton}
            onPress={clearFilters}
          >
            <Text style={styles.clearFiltersButtonText}>Clear Filters</Text>
          </TouchableOpacity>
        )}
      </View>

      <ModalSelector
        data={industries.map((industry) => ({
          key: industry,
          label: industry,
        }))}
        initValue="Filter by Industry"
        onChange={(option) => handleIndustryFilterChange(option.key)}
        selectStyle={{
          backgroundColor: "#234A57",
          borderRadius: 8,
          paddingVertical: 12,
          paddingHorizontal: 16,
          borderWidth: 2,
          borderColor: "rgba(255, 255, 255, 0.5)",
        }}
        selectTextStyle={{ color: "white", fontSize: 18, fontWeight: "600" }}
        selectedItemTextStyle={{ color: "#234A57", fontWeight: "700" }}
        optionStyle={{ backgroundColor: "#234A57", borderColor: "transparent", borderRadius: 0, padding:10 }}
        optionTextStyle={{ color: "white", fontWeight: "500", fontSize: 16 }}
        cancelStyle={{ backgroundColor: "black", borderRadius: 8, margin: -4 }}
        alwaysBounceHorizontal={true}
        fadingEdgeLength={true}
        cancelTextStyle={{ color: "white", fontWeight: "700", fontSize: 16 }}
        overlayStyle={{ backgroundColor: "rgba(35, 74, 87, 0.9)" }}
        sectionTextStyle={{ color: "black" }}
      />


      {selectedCategory ? (
        <Text style={styles.selectedCategoryText}>
          Selected Category: {selectedCategory}
        </Text>
      ) : null}

      {viewAsTiles ? (
        <FlatList
          data={sectionedData}
          keyExtractor={(item, index) => item.title + index + "tile"}
          renderItem={({ item }) => (
            <View>
              {renderDynamicHeader()}
              {renderSectionHeader({ section: item })}
              <FlatList
                data={item.data}
                keyExtractor={(item) => item.name + "tile"}
                renderItem={renderTileItem}
                horizontal
              />
            </View>
          )}
        />
      ) : (
        <FlatList
          data={sectionedData}
          keyExtractor={(item, index) => item.title + index}
          renderItem={({ item }) => (
            <View>
              {renderDynamicHeader()}
              {renderSectionHeader({ section: item })}
              <FlatList
                data={item.data}
                keyExtractor={(item) => item.name}
                renderItem={renderItem}
                onScroll={({ nativeEvent }) => {
                  const offsetY = nativeEvent.contentOffset.y;
                  setCurrentSection(
                    sectionedData.find(
                      (section) =>
                        offsetY >= section.offset &&
                        offsetY < section.offset + section.height
                    )?.title || ""
                  );
                  setCurrentIndustry(
                    sectionedData.find(
                      (section) =>
                        offsetY >= section.offset &&
                        offsetY < section.offset + section.height
                    )?.data[0]?.industry || ""
                  );
                }}
                scrollEventThrottle={16}
              />
            </View>
          )}
        />
      )}

      <TouchableHighlight
        style={{
          ...styles.toggleViewButton,
          backgroundColor: "#234A57",
        }}
        onPress={() => setViewAsTiles(!viewAsTiles)}
        underlayColor="yourPressedColor"
      >
        <Text style={styles.toggleViewButtonText}>
          {viewAsTiles ? "List View" : "Tile View"}
        </Text>
      </TouchableHighlight>

      <IconButton
        icon={({ color, size }) => (
          <Ionicons name="share-outline" color={color} size={size} />
        )}
        style={styles.shareButton}
        iconColor="pink"
        size={20}
        onPress={onShare}
      >
        Share View
      </IconButton>

      <StatusBar style="auto" />
    </SafeAreaView>
  );
};

export default BoycottedPlacesScreen;
