// AllowedScreen.js
import React, { useState } from 'react';
import { SafeAreaView, Text, TextInput, FlatList, Image, ImageBackground, StatusBar, View } from 'react-native';
import styles from '../styles.js';
import allowedData from '../data/allowed.json';

const AllowedScreen = () => {
  const [search, setSearch] = useState("");
  const [allowedPlaces, setAllowedPlaces] = useState(allowedData.allowedTargets);

  const filteredPlaces = allowedPlaces.filter((place) =>
    place.name.toLowerCase().includes(search.toLowerCase())
  );

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
    .map((key) => ({
      title: key,
      data: groupedPlaces[key].sort((a, b) => a.name.localeCompare(b.name)),
    }));

  const renderItem = ({ item }) => (
    <View style={styles.listItem}>
      <Text style={{ fontWeight: "bold" }}>{item.name}</Text>
      <Text style={{ fontWeight: "400", marginTop: 5 }}>
        {item.description}
      </Text>
      <ImageBackground
        source={{ uri: item.image }}
        style={styles.itemImage}
      ></ImageBackground>
    </View>
  );

  const renderSectionHeader = ({ section }) => (
    <Text style={styles.sectionHeader}>{section.title}</Text>
  );

  return (
    <SafeAreaView style={styles.container}>
       <View style={styles.headerContainer}>
        <View style={styles.logoContainer}>
          <Image source={require("../assets/logo.png")} style={styles.logo} />
        </View>
        <View style={styles.searchBarContainer}>
          <TextInput
            style={styles.searchBar}
            placeholderTextColor="black"
            placeholder="Search verified places by name..."
            onChangeText={(text) => setSearch(text)}
          />
        </View>
      </View>
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
            />
          </View>
        )}
      />
      <StatusBar style="auto" />
    </SafeAreaView>
  );
};

export default AllowedScreen;
