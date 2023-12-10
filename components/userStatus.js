// UserStatus.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const UserStatus = ({ onlineStatus, lastSeen, activityLevel }) => {
  const [blinkAnimation] = useState(new Animated.Value(0));
  const [tooltipVisible, setTooltipVisible] = useState(false);

  useEffect(() => {
    // Add a blinking animation when the component mounts
    Animated.loop(
      Animated.sequence([
        Animated.timing(blinkAnimation, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(blinkAnimation, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [blinkAnimation]);

  useEffect(() => {
    // Toggle the blink animation based on online status
    if (onlineStatus) {
      blinkAnimation.setValue(1);
    } else {
      blinkAnimation.setValue(0);
    }
  }, [onlineStatus, blinkAnimation]);

  const handleTooltipPress = () => {
    setTooltipVisible(!tooltipVisible);
  };

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.statusIndicator,
          {
            backgroundColor: onlineStatus
              ? '#4CAF50' // Green color for online
              : activityLevel === 'high'
              ? '#FFD700' // Yellow color for high activity
              : '#ccc', // Grey color for offline
            opacity: onlineStatus ? 1 : blinkAnimation,
          },
        ]}
      />
      <TouchableOpacity onPress={handleTooltipPress}>
        <Text style={styles.statusText}>
          {onlineStatus ? (
            'Online'
          ) : (
            <Text>
              Last seen{' '}
              <Text style={styles.lastSeenText} numberOfLines={1}>
                {lastSeen}
              </Text>
            </Text>
          )}
        </Text>
      </TouchableOpacity>
      {onlineStatus && (
        <Ionicons name="ios-checkmark-circle" size={16} color="#4CAF50" />
      )}

      {/* Tooltip Modal */}
      <Modal
        transparent={true}
        animationType="slide"
        visible={tooltipVisible}
        onRequestClose={() => setTooltipVisible(false)}
      >
        <View style={styles.tooltipContainer}>
          {/* Add detailed status information here */}
          <Text>Detailed Status Information</Text>
          <TouchableOpacity onPress={() => setTooltipVisible(false)}>
            <Text style={styles.closeTooltip}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#fff',
    marginRight: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2, // For Android shadow
  },
  statusText: {
    color: '#777',
    fontSize: 14,
  },
  lastSeenText: {
    color: '#555',
    fontStyle: 'italic',
  },
  tooltipContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  closeTooltip: {
    color: '#fff',
    marginTop: 20,
  },
});

export default UserStatus;
