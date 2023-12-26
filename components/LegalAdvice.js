import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ScrollView,
  Animated,
  RefreshControl,
} from "react-native";
import { TextInput } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import * as WebBrowser from "expo-web-browser";

// Import logos (replace with actual logo paths)
const LegalZoomLogo = {
  uri: "https://logos.bugcrowdusercontent.com/logos/b08f/c66d/5f62a7e1/923e4beb905d222083c9b696bcd7b95e_image.png",
};
const AvvoLogo = {
  uri: "https://avatars.githubusercontent.com/u/23085?s=200&v=4",
};
const RocketLawyerLogo = {
  uri: "https://entrepreneurhandbook.co.uk/wp-content/uploads/2014/01/RocketLawyer.png.webp",
};

const LegalAdvice = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredServices, setFilteredServices] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [sortCriteria, setSortCriteria] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const animatedValue = new Animated.Value(0);
  const [legalAdviceServices, setLegalAdviceServices] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

  // Real legal advice service data with logos, telephone numbers, and ratings
  const realLegalAdviceServices = [
    {
      id: 1,
      name: "LegalZoom",
      type: "Online Legal Services",
      website: "https://www.legalzoom.com",
      logo: LegalZoomLogo,
      phoneNumber: "(888) 379-0854",
      rating: 4.5,
      reviews: 120,
    },
    {
      id: 2,
      name: "Avvo",
      type: "Legal Marketplace",
      website: "https://www.avvo.com",
      logo: AvvoLogo,
      phoneNumber: "(206) 734-4111",
      rating: 4.0,
      reviews: 85,
    },
    {
      id: 3,
      name: "Rocket Lawyer",
      type: "Online Legal Services",
      website: "https://www.rocketlawyer.com",
      logo: RocketLawyerLogo,
      phoneNumber: "(877) 881-0947",
      rating: 3.8,
      reviews: 60,
    },
    {
      id: 4,
      name: "LegalMatch",
      type: "Legal Matching Service",
      website: "https://www.legalmatch.com",
      logo: LegalZoomLogo,
      phoneNumber: "(800) 496-9906",
      rating: 4.2,
      reviews: 95,
    },
    {
      id: 5,
      name: "UpCounsel",
      type: "Legal Marketplace",
      website: "https://www.upcounsel.com",
      logo: AvvoLogo,
      phoneNumber: "(888) 981-7449",
      rating: 4.1,
      reviews: 78,
    },
    {
      id: 6,
      name: "Nolo",
      type: "Legal Information and Forms",
      website: "https://www.nolo.com",
      logo: RocketLawyerLogo,
      phoneNumber: "(800) 464-5502",
      rating: 3.9,
      reviews: 55,
    },
    // Add more legal services with their actual data, logos, phone numbers, and ratings
  ];

  useEffect(() => {
    setLegalAdviceServices(realLegalAdviceServices);
    setFilteredServices(realLegalAdviceServices);
  }, []);

  const handleSearch = (query) => {
    const filteredServices = legalAdviceServices.filter((service) =>
      service.name.toLowerCase().includes(query.toLowerCase())
    );

    setFilteredServices(filteredServices);
    setSearchQuery(query);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const handleFilterPress = (filter) => {
    const updatedFilters = selectedFilters.includes(filter)
      ? selectedFilters.filter((selectedFilter) => selectedFilter !== filter)
      : [...selectedFilters, filter];

    setSelectedFilters(updatedFilters);
    const filteredServices = applyFilters(updatedFilters);
    setFilteredServices(filteredServices);
  };

  const applyFilters = (filters) => {
    if (filters.length === 0) {
      return legalAdviceServices;
    }
    return legalAdviceServices.filter((service) =>
      filters.includes(service.type)
    );
  };

  const handleServicePress = async (website) => {
    try {
      await WebBrowser.openBrowserAsync(website);
    } catch (error) {
      console.error("Error opening the web browser:", error);
    }
  };

  const renderRatingStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Ionicons
          key={i}
          name={i <= rating ? "star" : "star-outline"}
          size={20}
          color={i <= rating ? "#fff" : "#CCCCCC"}
        />
      );
    }
    return stars;
  };

  const applySorting = (criteria, order) => {
    return [...filteredServices].sort((a, b) => {
      const aValue = a[criteria];
      const bValue = b[criteria];

      if (order === "asc") {
        return aValue.localeCompare(bValue);
      } else {
        return bValue.localeCompare(aValue);
      }
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          mode="outlined"
          style={styles.searchInput}
          placeholder="Search for legal advice services"
          value={searchQuery}
          onChangeText={(text) => handleSearch(text)}
        />
        <TouchableOpacity
          style={styles.searchButton}
          onPress={() => handleSearch(searchQuery)}
        >
          <Ionicons name="search" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        <View style={styles.filterContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {Array.from(
              new Set(legalAdviceServices.map((service) => service.type))
            ).map((filter) => (
              <TouchableOpacity
                key={filter}
                style={[
                  styles.filterButton,
                  selectedFilters.includes(filter) &&
                    styles.selectedFilterButton,
                ]}
                onPress={() => handleFilterPress(filter)}
              >
                <Text
                  style={[
                    styles.filterButtonText,
                    selectedFilters.includes(filter) &&
                      styles.selectedFilterButtonText,
                  ]}
                >
                  {filter}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <AnimatedFlatList
          data={applySorting(sortCriteria, sortOrder)}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item, index }) => (
            <Animated.View
              style={{
                ...styles.serviceContainer,
                transform: [
                  {
                    translateY: 10,
                  },
                ],
              }}
            >
              <Text style={styles.serviceName}>{item.name}</Text>
              <Text style={styles.servicePhoneNumber}>{item.phoneNumber}</Text>
              <View style={styles.ratingContainer}>
                {renderRatingStars(item.rating)}
                <Text style={styles.ratingText}>({item.reviews} reviews)</Text>
              </View>
              <Text style={styles.serviceType}>{item.type}</Text>
            </Animated.View>
          )}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: animatedValue } } }],
            { useNativeDriver: true }
          )}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffff",
    paddingHorizontal: 16,
  },
  searchContainer: {
    flexDirection: "row",
    marginBottom: 16,
    overflow: "hidden",
    paddingVertical: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  searchButton: {
    height: 40,
    backgroundColor: "#234A57",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    marginLeft: 8,
  },
  filterContainer: {
    marginBottom: 16,
  },
  filterButton: {
    backgroundColor: "#234A57",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginEnd: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  selectedFilterButton: {
    backgroundColor: "crimson",
  },
  filterButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  selectedFilterButtonText: {
    fontWeight: "bold",
    color: "#fff",
  },
  serviceContainer: {
    backgroundColor: "#234A57",
    borderRadius: 8,
    marginVertical: 8,
    padding: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  serviceName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  servicePhoneNumber: {
    fontSize: 16,
    color: "crimson",
    fontWeight: "bold",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 14,
    color: "#fff",
  },
  serviceType: {
    fontSize: 16,
    color: "#fff",
    marginTop: 8,
  },
});

export default LegalAdvice;
