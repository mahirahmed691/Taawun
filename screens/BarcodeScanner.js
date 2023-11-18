import React, { useState, useEffect } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Image,
  Animated,
} from "react-native";

import { BarCodeScanner } from "expo-barcode-scanner";
import Modal from "react-native-modal";

const BarcodeScanner = () => {
  const [scannedData, setScannedData] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [showHappyModal, setShowHappyModal] = useState(false);
  const [showSadModal, setShowSadModal] = useState(false);
  const fadeAnim = new Animated.Value(1);

  useEffect(() => {
    requestCameraPermission();
  }, []);

  const handleBarCodeScanned = ({ data }) => {
    setScannedData(data);
    setIsScanning(false);

    if (data.startsWith("5010")) {
      setShowSadModal(true);
    } else {
      setShowHappyModal(true);
    }
  };

  const startScanning = () => {
    setScannedData(null);
    setIsScanning(true);
  };

  const requestCameraPermission = async () => {
    const { status } = await BarCodeScanner.requestPermissionsAsync();
    if (status !== "granted") {
      console.log("Camera permission denied");
    }
  };

  const closeModal = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setShowHappyModal(false);
      setShowSadModal(false);
      fadeAnim.setValue(1);
    });
  };

  return (
    <View style={styles.container}>
      {!isScanning && (
        <>
          <Image
            source={require("../assets/scanner.gif")}
            style={styles.scannerImage}
          />
          <Text style={styles.infoText}>
            Welcome to Revolt! Ensure proper lighting conditions for accurate
            barcode scanning. Hold your device steady while scanning. Our app
            supports various barcode formats. Your privacy is our priority, and
            we do not store or share scanned data without your consent. Contact
            support@revolt.com for assistance.
          </Text>
          <TouchableOpacity
            style={styles.scanButton}
            onPress={startScanning}
          >
            <Text style={styles.scanButtonText}>Scan Barcode</Text>
          </TouchableOpacity>
        </>
      )}

      {isScanning && (
        <BarCodeScanner
          onBarCodeScanned={handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
      )}

      {!isScanning && (
        <Image
          source={require("../assets/barcode.avif")}
          style={{ width: 200, height: 50, marginBottom: 10 }}
        />
      )}

      {scannedData && (
        <View style={styles.scanResultContainer}>
          <Text style={styles.scanResultText}>{scannedData}</Text>
        </View>
      )}

      <Modal
        isVisible={showHappyModal}
        animationIn="zoomIn"
        animationOut="zoomOut"
        animationInTiming={300}
        animationOutTiming={300}
        onModalHide={closeModal}
      >
        <Animated.View style={styles.modalContainer}>
          <Image
            source={require("../assets/palestine.jpeg")}
            style={styles.faceImage}
          />
          <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </Animated.View>
      </Modal>

      <Modal
        isVisible={showSadModal}
        animationIn="zoomIn"
        animationOut="zoomOut"
        animationInTiming={300}
        animationOutTiming={300}
        onModalHide={closeModal}
      >
        <Animated.View style={styles.modalContainer}>
          <Image
            source={require("../assets/boycott.gif")}
            style={styles.faceImage}
          />
          <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </Animated.View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
  },
  scannerImage: {
    height: 300,
    width: 300,
    marginBottom: 20,
  },
  infoText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    fontWeight:'900',
    color: "black",
  },
  scanButton: {
    backgroundColor: "black",
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 30,
    marginBottom: 20,
  },
  scanButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  scanResultContainer: {
    padding: 15,
    backgroundColor: "black",
    elevation: 3,
    marginBottom: 20,
  },
  scanResultText: {
    fontSize: 16,
    fontWeight: "200",
    color: "#fff",
    letterSpacing: 3,
  },
  modalContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  faceImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  closeButton: {
    width: 100,
    paddingVertical: 15,
    backgroundColor: "#e74c3c",
    borderRadius: 10,
    elevation: 3,
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
    alignSelf: "center",
  },
});

export default BarcodeScanner;
