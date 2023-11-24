import React, { useState } from "react";
import {
  SafeAreaView,
  Text,
  TextInput,
  FlatList,
  Image,
  ImageBackground,
  StatusBar,
  View,
  TouchableOpacity,
} from "react-native";
import { Chip } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { DrawerActions } from "@react-navigation/native";
import styles from "../styles.js";
import boycottData from "../data/boycott.json";
import ModalSelector from "react-native-modal-selector";

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

  const drawerNavigation = useNavigation();

  const openDrawer = () => {
    drawerNavigation.dispatch(DrawerActions.openDrawer());
  };

  const renderSectionHeader = ({ section }) => (
    <Text style={styles.sectionHeader}>{section.title}</Text>
  );

  const handleJoinBoycott = (place) => {
    const updatedJoinCounts = { ...joinCounts };
    updatedJoinCounts[place.name] = (joinCounts[place.name] || 0) + 1;
    setJoinCounts(updatedJoinCounts);
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
    .sort()
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
            onPress={() => navigation.navigate("PlaceDetail", { place: item })}
          >
            <Image source={{ uri: item.image }} style={styles.tileItemImage} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.listItem}
            onPress={() => navigation.navigate("PlaceDetail", { place: item })}
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

  // Render item for the tile view
  const renderTileItem = ({ item }) => (
    <TouchableOpacity
      style={styles.tileItemContainer}
      onPress={() => navigation.navigate("PlaceDetail", { place: item })}
    >
      <Image source={{ uri: item.image }} style={styles.tileItemImage} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.searchBarContainer}>
          <TextInput
            style={styles.searchBar}
            placeholderTextColor="black"
            placeholder="Search boycotted places by name..."
            onChangeText={(text) => setSearch(text)}
          />
        </View>
      </View>

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
            <FlatList
              data={item.data}
              keyExtractor={(item) => item.name + "tile"}
              renderItem={renderTileItem}
              horizontal
            />
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

      <TouchableOpacity
        style={styles.toggleViewButton}
        onPress={() => setViewAsTiles(!viewAsTiles)}
      >
        <Text style={styles.toggleViewButtonText}>
          {viewAsTiles ? "List View" : "Tile View"}
        </Text>
      </TouchableOpacity>

      <StatusBar style="auto" />
    </SafeAreaView>
  );
};

export default BoycottedPlacesScreen;
