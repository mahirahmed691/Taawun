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
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";

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
  const auth = getAuth();
  const firestore = getFirestore();
  const [joinedStatus, setJoinedStatus] = useState({});


  useEffect(() => {
    // Fetch and update join counts when the component mounts
    const fetchJoinCounts = async () => {
      try {
        const user = auth.currentUser;
  
        if (user) {
          const userDocQuery = query(
            collection(firestore, "userBoycottHistory"),
            where("email", "==", user.email)
          );
          const userDocSnapshot = await getDocs(userDocQuery);
  
          if (!userDocSnapshot.empty) {
            const userDocId = userDocSnapshot.docs[0].id;
  
            // Fetch join counts only if the user document exists
            const snapshot = await getDoc(
              doc(firestore, "boycottCounts", userDocId)
            );
  
            // Check if the snapshot exists
            if (snapshot.exists()) {
              const joinCount = snapshot.data()?.joinCount || 0;
  
              // Retrieve the user's boycott history
              const userBoycottHistory = snapshot.data()?.boycottHistory || [];
  
              // Update the local state to indicate companies that the user has joined
              const joinedStatusUpdates = {};
              userBoycottHistory.forEach((company) => {
                joinedStatusUpdates[company] = true;
              });
  
              setJoinedStatus((prevStatus) => ({
                ...prevStatus,
                ...joinedStatusUpdates,
              }));
  
              // Update your joinCounts state
              setJoinCounts({ ...joinCounts, [user.email]: joinCount });
            } else {
              console.error("Document does not exist for user");
            }
          } else {
            console.error(`User with email ${user.email} not found.`);
          }
        } else {
          console.error("No authenticated user found.");
        }
      } catch (error) {
        console.error("Error fetching join counts:", error.message);
      }
    };
  
    fetchJoinCounts();
  }, [firestore, auth, joinCounts]);

  useEffect(() => {
    // Fetch and update join counts when the component mounts
    const fetchJoinCounts = async () => {
      // ... (existing code)

      setJoinCounts(counts);
      setJoinedStatus(joinedStatus); // Initialize joinedStatus state here
    };

    fetchJoinCounts();
  }, [firestore]);


  const handleIndustryFilterChange = (industry) => {
    // Add logic to handle industry filter change
    setIndustryFilter(industry);
    setShowClearFilters(true);
  };

  const fetchJoinCounts = async () => {
    const counts = {};
    const joinedStatus = {};

    try {
      const user = auth.currentUser;

      if (user) {
        const userDocQuery = query(
          collection(firestore, "userBoycottHistory"),
          where("email", "==", user.email)
        );
        const userDocSnapshot = await getDocs(userDocQuery);

        if (!userDocSnapshot.empty) {
          const userDocId = userDocSnapshot.docs[0].id;
          const snapshot = await getDoc(
            doc(firestore, "boycottCounts", userDocId)
          );

          // Check if the snapshot exists
          if (snapshot.exists()) {
            joinCounts[doc.id] = snapshot.data()?.joinCount || 0;
            joinedStatus[userDocId] = true;
          } else {
            // If the document doesn't exist, you can handle it accordingly
            console.error("Document does not exist");
          }

          setJoinCounts(counts);
          setJoinedStatus(joinedStatus);
        } else {
          console.error(`User with email ${user.email} not found.`);
        }
      } else {
        console.error("No authenticated user found.");
      }
    } catch (error) {
      console.error("Error fetching join counts:", error.message);
    }
  };

  useEffect(() => {
    fetchJoinCounts();
  }, [firestore]);

  // Listen for changes in authentication state
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in, fetch join counts
      fetchJoinCounts();
    }
  });

  const handleJoinBoycott = async (place) => {
    const placeName = place.name;
    const userEmail = auth.currentUser?.email;

    if (!userEmail) {
      console.error("No authenticated user found.");
      return;
    }

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

        // Display a message or perform any other action for already joined users
        alert(`You have already joined the boycott for ${placeName}!`);

        return;
      }

      // Update the join count and joined users
      await setDoc(placeRef, {
        joinCount: currentJoinCount + 1,
        joinedUsers: [...joinedUsers, userEmail],
      });

      // Update the local joinCounts state
      setJoinCounts((prevJoinCounts) => ({
        ...prevJoinCounts,
        [placeName]: currentJoinCount + 1,
      }));

      // Update the user's boycott history
      const userBoycottRef = doc(firestore, "userBoycottHistory", userEmail);
      const userBoycottSnapshot = await getDoc(userBoycottRef);
      const userBoycottHistory = userBoycottSnapshot.exists()
        ? userBoycottSnapshot.data().boycottHistory || []
        : [];

      await setDoc(userBoycottRef, {
        boycottHistory: [...userBoycottHistory, placeName],
      });

      console.log(
        `Boycott joined for ${placeName}. Join count: ${
          currentJoinCount + 1
        }. User: ${userEmail}`
      );

      // Display a success alert
      alert(`You have successfully joined the boycott for ${placeName}!`);

      // Update the local state to indicate that the user has joined
      setJoinedStatus((prevStatus) => ({
        ...prevStatus,
        [placeName]: true,
      }));

      // Optionally, you can update the local state to indicate the join count
      setBoycottedPlaces((prevPlaces) =>
        prevPlaces.map((prevPlace) =>
          prevPlace.name === placeName
            ? { ...prevPlace, joined: true, joinCount: currentJoinCount + 1 }
            : prevPlace
        )
      );
    } catch (error) {
      console.error("Error updating join count:", error.message);
    }
  };

  const openDrawer = () => {
    drawerNavigation.dispatch(DrawerActions.openDrawer());
  };

  const renderSectionHeader = ({ section }) => (
    <Text style={styles.sectionHeader}>{section.title}</Text>
  );

  const industries = Array.from(
    new Set(boycottedPlaces.map((place) => place.industry))
  ).filter(Boolean);

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
      const userEmail = auth.currentUser?.email;
    
      // Check if the user has already joined
      const userJoined = userEmail && joinedStatus[userEmail];
    
      return (
        <>
          {viewAsTiles ? (
            // ... (existing tile rendering logic)
            null
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
                  style={[
                    styles.joinBoycottButton,
                    userJoined && { backgroundColor: "green" }, // Change the style if joined
                  ]}
                  onPress={() =>
                    handleJoinBoycott(item /* Add user email parameter here */)
                  }
                  disabled={userJoined}
                >
                  <Text style={styles.joinBoycottButtonText}>
                    {userJoined ? `Joined (${itemJoinCount})` : "Join"}
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
        optionStyle={{
          backgroundColor: "#234A57",
          borderColor: "transparent",
          borderRadius: 0,
          padding: 10,
        }}
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
