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
import { Chip, IconButton } from "react-native-paper";
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

  const drawerNavigation = useNavigation();

  const openDrawer = () => {
    drawerNavigation.dispatch(DrawerActions.openDrawer());
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

    return (
      <TouchableOpacity
        style={styles.listItem}
        onPress={() => navigation.navigate("PlaceDetail", { place: item })}
      >
        <ImageBackground
          source={{ uri: item.image }}
          style={styles.imageBackground}
        >
          <Chip style={{ width: "40%", backgroundColor: "tomato", borderRadius:0, padding:2, top:0, position:'absolute', left:0 }}>
            <Text style={{ color: "white", fontSize: 10 }}>
              People Boycotting: {itemJoinCount}
            </Text>
          </Chip>
          <TouchableOpacity
            style={styles.joinBoycottButton}
            onPress={() => handleJoinBoycott(item)}
          >
            <Text style={styles.joinBoycottButtonText}>Join Boycott</Text>
          </TouchableOpacity>
        </ImageBackground>
        <View style={styles.topLeftContainer}>
          <Text style={styles.joinCountText}>
            {itemJoinCount} People Joined
          </Text>
        </View>
        <Text style={{ fontWeight: "bold" }}>{item.name}</Text>
        <Text style={{ fontWeight: "400", marginTop: 5 }}>
          {item.description}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderSectionHeader = ({ section }) => (
    <Text style={styles.sectionHeader}>{section.title}</Text>
  );

  const handleJoinBoycott = (place) => {
    setJoinCounts((prevCounts) => {
      const updatedCounts = { ...prevCounts };
      updatedCounts[place.name] = (prevCounts[place.name] || 0) + 1;
      return updatedCounts;
    });
  };

  const handleCategoryPress = (category) => {
    setSelectedCategory(category);
  };

  const handleScroll = (event) => {
    const offsetY = event.nativeEvent.contentOffset.y;

    const currentSection = sectionedData.find(
      (section) =>
        offsetY >= section.offset && offsetY < section.offset + section.height
    );

    setCurrentSection(currentSection ? currentSection.title : "");
    setCurrentIndustry(currentSection ? currentSection.data[0]?.industry : "");
  };

  const renderFilterDropdown = () => {
    const industryOptions = [
      { key: 0, section: true, label: "Select Industry" },
      { key: 1, label: "All Industries" },
      ...boycottedPlaces.reduce((options, place) => {
        if (!options.find((opt) => opt.label === place.industry)) {
          options.push({ key: options.length + 2, label: place.industry });
        }
        return options;
      }, []),
    ];

    return (
      <ModalSelector
        data={industryOptions}
        initValue="Select Industry"
        onChange={(option) => setIndustryFilter(option.label)}
        animationType="none"
        style={{ backgroundColor: "white" }}
      />
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

      {renderFilterDropdown()}

      <FlatList
        data={sectionedData}
        keyExtractor={(item, index) => item.title + index}
        renderItem={({ item }) => (
          <View>
            {renderSectionHeader({ section: item })}
            <FlatList
              data={item.data}
              keyExtractor={(item) => item.name}
              renderItem={renderItem}
              onScroll={handleScroll}
              scrollEventThrottle={16}
            />
          </View>
        )}
      />

      {renderDynamicHeader()}
      <StatusBar style="auto" />
    </SafeAreaView>
  );
};

export default BoycottedPlacesScreen;
