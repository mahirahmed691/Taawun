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
import { firestore } from "../config/firebaseConfig.js";
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

  // Update the handleJoinBoycott function
  const handleJoinBoycott = async (place) => {
    const placeRef = firestore.collection("boycottedPlaces").doc(place.name);
  
    try {
      // Get the current join count from Firestore
      const doc = await placeRef.get();
      const currentJoinCount = doc.exists ? doc.data().joinCount || 0 : 0;
  
      // Update the join count
      await placeRef.set({
        joinCount: currentJoinCount + 1,
      });
  
      console.log(`Boycott joined for ${place.name}. Join count: ${currentJoinCount + 1}`);
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
              >
                <Text style={styles.joinBoycottButtonText}>Join Boycott</Text>
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
        selectStyle={{ borderWidth: 1, backgroundColor: "black" }}
        selectTextStyle={{ color: "black" }}
        selectedItemTextStyle={{ color: "black" }}
        optionStyle={{ backgroundColor: "#F5F5F5" }}
        optionTextStyle={{ color: "black" }}
        cancelStyle={{ backgroundColor: "crimson" }}
        cancelTextStyle={{ color: "white" }}
        overlayStyle={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
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
          backgroundColor: "#000",
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
