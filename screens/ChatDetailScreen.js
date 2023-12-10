import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  StyleSheet,
  Image,
  Slider,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { Audio } from "expo-av";
import EmojiSelector from "react-native-emoji-selector";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";

const ChatDetailScreen = ({ route }) => {
  const { userName, onlineStatus } = route.params;
  const [sound, setSound] = useState();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [showEmojiSelector, setShowEmojiSelector] = useState(false);
  const [isOnline, setIsOnline] = useState(onlineStatus);
  const [recording, setRecording] = useState();
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);

  const navigation = useNavigation();

  useEffect(() => {
    // Update online status when it changes
    setIsOnline(onlineStatus);
    askForPermissions();
  }, [onlineStatus]);

  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  const askForPermissions = async () => {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      if (status === "granted") {
        // Permission granted, you can start recording here
        startRecording();
      } else {
        console.log("Permission denied for audio recording");
      }
    } catch (error) {
      console.error("Error asking for permissions:", error);
    }
  };

  const playSound = async (uri) => {
    try {
      // Unload any existing sound
      if (sound) {
        await sound.unloadAsync();
      }

      console.log('Loading sound...');
      const { sound: newSound, status, duration } = await Audio.Sound.createAsync(
        { uri },
        { shouldPlay: true }
      );
      console.log('Sound loaded successfully.');

      if (status === 'ok') {
        await newSound.setVolumeAsync(1.0); // Adjust the volume here
        await newSound.setIsLoopingAsync(false); // Disable looping for voice messages
        console.log('Volume set successfully.');

        setSound(newSound);
        setDuration(duration);
      } else {
        console.error('Failed to load sound');
      }
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  };

  const sendMessage = () => {
    if (newMessage.trim() !== "") {
      const timestamp = new Date().getTime();
      const newSentMessage = {
        text: newMessage,
        sender: "user",
        timestamp,
        status: "sent",
      };
      setMessages([...messages, newSentMessage]);
      setNewMessage("");

      // Auto-reply logic
      setTimeout(() => {
        const autoReply = {
          text: "I'm currently away, but I'll get back to you soon!",
          sender: "auto-reply",
          timestamp: new Date().getTime(),
        };
        setMessages((prevMessages) => [...prevMessages, autoReply]);
      }, 1000); // You can adjust the delay as needed

      // For audio messages
      if (isRecording) {
        const newSentVoiceMessage = {
          uri: recording.getURI(),
          sender: "user",
          timestamp,
          status: "sent",
          type: "audio",
        };
        setMessages([...messages, newSentVoiceMessage]);
        setIsRecording(false);
      }
    }
  };

  const toggleEmojiSelector = () => {
    setShowEmojiSelector(!showEmojiSelector);
  };

  const handleEmojiSelected = (emoji) => {
    setNewMessage((prevMessage) => prevMessage + emoji);
    setShowEmojiSelector(false);
  };

  const startRecording = async () => {
    try {
      console.log("Recording started");

      // Set audio mode
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { status } = await Audio.requestPermissionsAsync();

      if (status !== "granted") {
        console.log("Permission denied for audio recording");
        return;
      }

      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync(
        Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      );

      // Save the recording object in state
      setRecording(recording);

      // Start recording
      await recording.startAsync();

      setIsRecording(true);
    } catch (error) {
      console.error("Error starting recording:", error);
    }
  };

  const stopRecording = async () => {
    try {
      console.log("Recording stopped");

      if (recording) {
        await recording.stopAndUnloadAsync();
        const uri = recording.getURI();

        const timestamp = new Date().getTime();
        const newSentVoiceMessage = {
          uri,
          sender: "user",
          timestamp,
          status: "sent",
          type: "audio",
        };

        setMessages([...messages, newSentVoiceMessage]);
        setIsRecording(false);

        // Play the recorded sound
        playSound(uri);
      } else {
        console.warn("Recording is not available to stop.");
      }
    } catch (error) {
      console.error("Error stopping recording:", error);
    }
  };

  const updatePosition = (value) => {
    if (sound) {
      sound.setPositionAsync(value);
      setPosition(value);
    }
  };

  const pauseSound = async () => {
    if (sound) {
      await sound.pauseAsync();
    }
  };

  const resumeSound = async () => {
    if (sound) {
      await sound.playAsync();
    }
  };

  const pickImage = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status === "granted") {
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          quality: 1,
        });

        if (!result.cancelled) {
          // Process the selected image
          console.log("Selected Image URI:", result.uri);

          const timestamp = new Date().getTime();
          const newSentImageMessage = {
            uri: result.uri,
            sender: "user",
            timestamp,
            status: "sent",
          };

          setMessages([...messages, newSentImageMessage]);

          // Auto-reply logic
          setTimeout(() => {
            const autoReply = {
              text: "I'm currently away, but I'll get back to you soon!",
              sender: "auto-reply",
              timestamp: new Date().getTime(),
            };
            setMessages((prevMessages) => [...prevMessages, autoReply]);
          }, 1000); // You can adjust the delay as needed
        }
      } else {
        console.log("Permission denied to access the gallery");
      }
    } catch (error) {
      console.error("Error picking image:", error);
    }
  };

  const playReceivedVoiceMessage = async (uri) => {
    try {
      const { sound: newSound, status, duration } = await Audio.Sound.createAsync(
        { uri },
        { shouldPlay: true }
      );
  
      if (status === 'ok') {
        await newSound.setVolumeAsync(1.0);
        await newSound.setIsLoopingAsync(false);
        setSound(newSound);
        setDuration(duration);
      } else {
        console.error('Failed to load sound');
      }
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  };
  

  const renderPlaybackControls = () => (
    <View style={styles.playbackControls}>
      <TouchableOpacity onPress={() => updatePosition(position - 5000)}>
        <Ionicons name="rewind" size={30} color="black" />
      </TouchableOpacity>

      <TouchableOpacity onPress={isPlaying ? pauseSound : resumeSound}>
        <Ionicons name={isPlaying ? "pause" : "play"} size={30} color="black" />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => updatePosition(position + 5000)}>
        <Ionicons name="fast-forward" size={30} color="black" />
      </TouchableOpacity>
    </View>
  );

  const renderItem = ({ item }) => (
    <View
      style={item.sender === 'user' ? styles.userMessage : styles.otherMessage}
    >
      {/* ... (your existing code) */}
      {item.uri && item.type === 'audio' && (
        <View style={styles.audioContainer}>
          <TouchableOpacity onPress={() => playReceivedVoiceMessage(item.uri)}>
            <Ionicons name="play-circle" size={30} color="black" />
          </TouchableOpacity>
          <Text style={styles.timestamp}>
            {formatTimestamp(item.timestamp)} - {item.status}
          </Text>
        </View>
      )}
    </View>
  );

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return `${date.getHours()}:${date.getMinutes()}`;
  };

  return (
    <View style={styles.screenContainer}>
      <View style={styles.headerContainer}>
        <Ionicons
          name="menu"
          color="white"
          size={20}
          onPress={() => navigation.navigate("ChatList")}
        />
        <Text style={styles.headerText}>
          {userName}{" "}
          {isOnline ? (
            <Ionicons name="md-help-circle-sharp" size={20} color="lime" />
          ) : (
            <Ionicons name="md-help-circle-sharp" size={20} color="crimson" />
          )}
        </Text>
        <TouchableOpacity onPress={playSound}>
          <Ionicons name="call" color="white" size={20} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />

      {sound && duration > 0 && (
        <View>
          {renderPlaybackControls()}
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={duration}
            value={position}
            onValueChange={updatePosition}
          />
          <Text style={styles.timestamp}>
            {formatTimestamp(position)} / {formatTimestamp(duration)}
          </Text>
        </View>
      )}

      <View style={styles.inputContainer}>
        <TouchableOpacity onPress={toggleEmojiSelector}>
          <Ionicons name="happy" color="black" size={20} />
        </TouchableOpacity>

        <TouchableOpacity onPress={pickImage}>
          <Ionicons name="image" color="black" size={20} />
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          value={newMessage}
          onChangeText={(text) => setNewMessage(text)}
        />

<TouchableOpacity
          style={styles.recordButton}
          onPressIn={startRecording}
          onPressOut={stopRecording}
        >
          <Ionicons
            name={isRecording ? "mic-off" : "mic"}
            color={isRecording ? "#FF0000" : "white"}
            size={20}
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>

      {showEmojiSelector && (
        <EmojiSelector
          onEmojiSelected={handleEmojiSelected}
          showSearchBar={false}
          showTabs={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headerContainer: {
    backgroundColor: "#000",
    padding: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerText: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "900",
    color: "white",
  },
  onlineIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "green",
    marginLeft: 5,
  },
  offlineIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "red",
    marginLeft: 5,
  },
  userMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#f0f0f0",
    padding: 8,
    margin: 5,
    borderRadius: 10,
  },
  otherMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#EAEAEA",
    padding: 8,
    margin: 5,
    borderRadius: 10,
  },
  inputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    marginBottom: 20,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
  },
  input: {
    flex: 1,
    height: 40,
    paddingLeft: 10,
    marginLeft: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    paddingHorizontal: 0,
  },
  sendButton: {
    marginLeft: 10,
    padding: 10,
    borderRadius: 20,
    backgroundColor: "#000",
  },
  recordButton: {
    marginLeft: 10,
    padding: 10,
    borderRadius: 20,
    backgroundColor: "#FF0000", // Red for recording
  },
  sendButtonText: {
    color: "white",
  },
  timestamp: {
    fontSize: 12,
    color: "gray",
    alignSelf: "flex-end",
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginVertical: 5,
  },
  audioContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  playbackControls: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  slider: {
    width: "80%",
    alignSelf: "center",
    marginVertical: 10,
  },
  recordButton: {
    marginLeft: 10,
    padding: 10,
    borderRadius: 20,
    backgroundColor: "#FF0000", // Red for recording
  },
});

export default ChatDetailScreen;
