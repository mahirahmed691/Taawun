import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Import the JSON data
import influencersData from '../data/people.json';

const InfluencerScreen = () => {
  const [selectedInfluencers, setSelectedInfluencers] = useState([]);

  const toggleFollowStatus = (id) => {
    setSelectedInfluencers((prevSelectedInfluencers) => {
      if (prevSelectedInfluencers.includes(id)) {
        // If the influencer is already selected, remove them from the list
        return prevSelectedInfluencers.filter((influencerId) => influencerId !== id);
      } else {
        // If the influencer is not selected, add them to the list
        return [...prevSelectedInfluencers, id];
      }
    });
  };

  const isFollowed = (id) => selectedInfluencers.includes(id);

  const renderSocialIcons = (socialMedia) => (
    <View style={styles.socialMediaContainer}>
      <Ionicons name="logo-twitter" size={20} color="#1DA1F2" style={styles.socialIcon} />
      <Ionicons name="logo-instagram" size={20} color="#E4405F" style={styles.socialIcon} />
      <Ionicons name="logo-facebook" size={20} color="#1877F2" style={styles.socialIcon} />
    </View>
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.influencerItem,
        {
          backgroundColor: isFollowed(item.id) ? '#00c1b2' : '#f0f0f0', // Light Blue for Follow, Default color for Unfollow
        },
      ]}
      onPress={() => toggleFollowStatus(item.id)}
    >
      <View style={[styles.textContainer]}>
        <Text style={[ styles.name, { color: isFollowed(item.id) ? '#fff' : '#111' }]}>{item.name}</Text>
        <Text style={[styles.description,{ color: isFollowed(item.id) ? '#fff' : '#111' } ]}>{item.description}</Text>
        {renderSocialIcons(item.socialMedia)}
      </View>
      <View style={styles.followButton}>
        <Text style={[styles.followButtonText, { color: isFollowed(item.id) ? '#fff' : '#fff' }]}>
          {isFollowed(item.id) ? 'Unfollow' : 'Follow'}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={influencersData.influencers}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      numColumns={2}
      contentContainerStyle={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingTop: 24,
    backgroundColor: '#f8f8f8',
  },
  influencerItem: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    margin: 8,
    elevation: 10,
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  description: {
    fontSize: 16,
    color: '#111',
    
  },
  socialMediaContainer: {
    flexDirection: 'row',
    margin: 15,
    marginLeft:0,
    backgroundColor:'white',
    width:100,
    padding:10,
    borderRadius:10
  },
  socialIcon: {
    marginRight: 8,
  },
  followButton: {
    padding: 10,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1E90FF',
  },
  followButtonText: {
    fontWeight: 'bold',
  },
});

export default InfluencerScreen;
