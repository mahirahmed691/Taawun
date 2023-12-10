import React, { useState, useEffect, useRef } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Image,
  Animated,
} from "react-native";
import { Camera } from "expo-camera";
import { Ionicons } from "@expo/vector-icons";
import Modal from "react-native-modal";

const generateMockProductInfo = (barcode) => {
  return {
    productName: `Mock Product ${barcode}`,
  };
};

const BarcodeScanner = () => {
  const [scannedData, setScannedData] = useState(null);
  const [countryInfo, setCountryInfo] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [showHappyModal, setShowHappyModal] = useState(false);
  const [showSadModal, setShowSadModal] = useState(false);
  const [flashOn, setFlashOn] = useState(false);
  const [productInfo, setProductInfo] = useState(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const cameraRef = useRef(null);

  useEffect(() => {
    requestCameraPermission();
  }, []);

  const handleBarCodeScanned = async ({ data }) => {
    console.log("Barcode scanned:", data);

    setScannedData(data);
    setIsScanning(false);

    if (data.startsWith("5010")) {
      setShowSadModal(true);
    } else {
      // Mock product information for testing
      const mockProductData = generateMockProductInfo(data);
      console.log("Mock Product data:", mockProductData);

      // Display the mock product information
      setProductInfo(mockProductData);
      setCountryInfo(await getCountryInfo(data));
      setShowHappyModal(true);
    }
  };

  const getProductInfo = async (barcode) => {
    try {
      console.log("Fetching product information for barcode:", barcode);
      const response = await fetch(`YOUR_PRODUCT_API_ENDPOINT/${barcode}`);
      const productData = await response.json();
      console.log("Product data:", productData);
      return productData;
    } catch (error) {
      console.error("Error fetching product information:", error);
      return null;
    }
  };

  const startScanning = () => {
    setScannedData(null);
    setCountryInfo(null);
    setIsScanning(true);
  };

  const requestCameraPermission = async () => {
    const { status } = await Camera.requestPermissionsAsync();
    if (status !== "granted") {
      console.log("Camera permission denied");
    }
  };

  const getCountryInfo = async (barcode) => {
    return { country: "Sample Country", details: "Sample Country Details" };
  };

  const toggleFlashlight = () => {
    setFlashOn(!flashOn);
  };

  const closeModal = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      fadeAnim.setValue(1);
    });

    setTimeout(() => {
      setShowHappyModal(false);
      setShowSadModal(false);
      setCountryInfo(null);
    }, 300);
  };

  const renderFocusBox = () => {
    return (
      <View style={styles.focusContainer}>
        <View style={styles.focusBox}></View>
      </View>
    );
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
            Welcome to From The River! Ensure proper lighting conditions for
            accurate barcode scanning. Hold your device steady while scanning.
            Our app supports various barcode formats. Your privacy is our
            priority, and we do not store or share scanned data without your
            consent. Contact support@fromtheriver.com for assistance.
          </Text>
          <TouchableOpacity style={styles.scanButton} onPress={startScanning}>
            <Text style={styles.scanButtonText}>Scan Barcode</Text>
          </TouchableOpacity>
        </>
      )}

      {productInfo && (
        <View style={styles.productInfoContainer}>
          <Text style={styles.productInfoText}>{productInfo.productName}</Text>
          {/* Include additional product information here */}
        </View>
      )}

      {isScanning && (
        <Camera
          ref={cameraRef}
          style={StyleSheet.absoluteFillObject}
          onBarCodeScanned={handleBarCodeScanned}
          flashMode={
            flashOn
              ? Camera.Constants.FlashMode.torch
              : Camera.Constants.FlashMode.off
          }
        />
      )}

      {!isScanning && (
        <Image
          source={require("../assets/barcode.jpeg")}
          style={styles.logoImage}
        />
      )}

      {scannedData && (
        <View style={styles.scanResultContainer}>
          <Text style={styles.scanResultText}>{scannedData}</Text>
        </View>
      )}

      {countryInfo && (
        <View style={styles.countryInfoContainer}>
          <Text style={styles.countryInfoText}>{countryInfo.country}</Text>
          <Text style={styles.countryInfoDetails}>{countryInfo.details}</Text>
        </View>
      )}

      <Modal
        isVisible={showHappyModal || showSadModal}
        animationIn="zoomIn"
        animationOut="zoomOut"
        animationInTiming={300}
        animationOutTiming={300}
        onModalHide={closeModal}
      >
        <Animated.View style={styles.modalContainer}>
          {showHappyModal && (
            <Image
              source={require("../assets/palestine.jpeg")}
              style={styles.faceImage}
            />
          )}
          {showSadModal && (
            <Image
              source={require("../assets/boycott.gif")}
              style={styles.faceImage}
            />
          )}
          <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </Animated.View>
      </Modal>

      {isScanning && (
        <TouchableOpacity style={styles.flashButton} onPress={toggleFlashlight}>
          <Ionicons
            name={flashOn ? "flash" : "flash-off"}
            size={24}
            color="white"
          />
          <Text style={styles.flashButtonText}>
            {flashOn ? " Turn Flash Off" : " Turn Flash On"}
          </Text>
        </TouchableOpacity>
      )}

      {isScanning && renderFocusBox()}
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
  logoImage: {
    width: 200,
    height: 50,
    marginBottom: 10,
  },
  infoText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    fontWeight: "bold",
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
  flashButton: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    paddingVertical: 15,
    position: "absolute",
    top: 20,
    right: 10,
  },
  flashButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  focusContainer: {
    flex: 1,
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  focusBox: {
    width: 200,
    height: 200,
    borderWidth: 2,
    borderColor: "white",
    borderRadius: 10,
  },
  countryInfoContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    padding: 15,
    borderRadius: 10,
    position: "absolute",
    top: 50,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  countryInfoText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
    marginBottom: 5,
  },
  countryInfoDetails: {
    fontSize: 14,
    color: "black",
  },
  productInfoContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    padding: 15,
    borderRadius: 10,
    position: "absolute",
    top: 50,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  productInfoText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
    marginBottom: 5,
  },
});

export default BarcodeScanner;