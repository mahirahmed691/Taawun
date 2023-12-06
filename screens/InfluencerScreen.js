import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { app } from '../config/firebaseConfig.js';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const InfluencerScreen = () => {
  const [influencers, setInfluencers] = useState([]);
  const [selectedInfluencers, setSelectedInfluencers] = useState([]);

  useEffect(() => {
    const fetchInfluencers = async () => {
      try {
        const influencersSnapshot = await getDocs(collection(getFirestore(app), 'Influencers'));
        const influencersData = influencersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setInfluencers(influencersData);
      } catch (error) {
        console.error('Error fetching influencers: ', error);
      }
    };
  
    fetchInfluencers();
  }, []);

  const toggleFollowStatus = (id) => {
    setSelectedInfluencers((prevSelectedInfluencers) => {
      if (prevSelectedInfluencers.includes(id)) {
        return prevSelectedInfluencers.filter((influencerId) => influencerId !== id);
      } else {
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
          backgroundColor: isFollowed(item.id) ? '#00c1b2' : '#f0f0f0',
        },
      ]}
      onPress={() => toggleFollowStatus(item.id)}
    >
      <View style={[styles.textContainer]}>
        <Text style={[styles.name, { color: isFollowed(item.id) ? '#fff' : '#111' }]}>{item.name}</Text>
        <Text style={[styles.description, { color: isFollowed(item.id) ? '#fff' : '#111' }]}>{item.description}</Text>
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
      data={influencers}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
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
    height: 250,
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
    fontSize: 14,
    color: '#111',
  },
  socialMediaContainer: {
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 0,
    backgroundColor: 'white',
    width: 120,
    alignSelf: 'center',
    padding: 20,
    borderRadius: 10,
    position: 'absolute',
    bottom: 0,
  },
  socialIcon: {
    marginRight: 8,
  },
  followButton: {
    padding: 10,
    borderRadius: 20,
    justifyContent: 'center',
    width: 120,
    alignItems: 'center',
    backgroundColor: '#1E90FF',
  },
  followButtonText: {
    fontWeight: 'bold',
  },
});

export default InfluencerScreen;
