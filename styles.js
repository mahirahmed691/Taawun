import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cameraContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  camera: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  scanButton: {
    backgroundColor: "tomato",
    padding: 15,
    borderRadius: 8,
    margin: 20,
    alignItems: "center",
  },
  scanButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  scanResultContainer: {
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 8,
    margin: 20,
    alignItems: "center",
  },
  scanResultText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  searchBar: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
    borderRadius: 8,
    backgroundColor: "#fff",
    alignSelf: "center",
    width: "80%",
  },
  listItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    width: "100%",
    justifyContent: "flex-start",
  },
  logo: {
    width: "20%",
    height: 100,
    marginTop: 20,
    marginBottom: 10,
    alignSelf: "center",
    resizeMode: "contain",
    alignItems: "center",
  },
  itemImage: {
    flex: 1,
    resizeMode: "contain",
    justifyContent: "center",
    alignItems: "center",
    height: 200,
    width: 100,
  },
  headerText: {
    alignSelf: "center",
    marginBottom: 10,
    marginLeft: 20,
    fontWeight: "900",
  },
  itemCountText: {
    marginLeft: 10,
    marginTop: 10,
    marginBottom: 10,
    fontWeight: "900",
  },
  sectionHeader: {
    marginLeft: 10,
    fontSize: 30,
    fontWeight: "bold",
    color:'black',
  },

  sectionHeader2: {
    fontSize: 20,
    padding:1,
    fontWeight: "900",
    letterSpacing:1,
    color:'white',
    backgroundColor:'teal'
  },
  detailImage: {
    width: "100%",
    height: 150,
    alignSelf:'center',
    resizeMode: "cover",

  },
  urlContainer: {
    backgroundColor: "#e0e0e0",
    padding: 5,
    marginTop: 5,
    borderRadius: 5,
  },
  urlText: {
    color: "#333",
  },
  descriptionText: {
    fontWeight: "900",
    color: "white",
    backgroundColor: "#000",
    padding: 5,
  },
  urlContainer: {
    marginBottom: 20,
  },
  urlText: {
    fontSize: 22,
    color: "#111",
    fontWeight: "900",
    marginBottom: 5,
  },
  urlImage: {
    width: "100%",
    height: 150,
    resizeMode: "cover",
    borderRadius: 10,
    marginBottom: 10,
  },
  linkDateText: {
    fontSize: 14,
    color: "#888",
  },
  listItem: {
    margin: 10,
    padding: 10,
    backgroundColor: "#FFF",
    borderRadius: 8,
    elevation: 4,
  },
  itemImage: {
    width: "100%",
    height: 200,
    overflow: "hidden",
    position: "relative",
  },
  joinBoycottButton: {
    position: "absolute",
    top: 0,
    right: 0,
    alignSelf: "center",
    backgroundColor: "#000",
    padding: 10,
  },
  joinBoycottButtonText: {
    fontWeight: "bold",
    color: "white",
  },
  imageBackground: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
    alignItems: "center",
    height: 200,
    width: "100%",
  },
  peopleJoined: {
    backgroundColor: "#00cbaf",
    width: 70,
    padding: 5,
    marginTop: 0,
    borderRadius: 0,
  },
  joinCountText: {
    fontWeight: "bold",
    position: "absolute",
    top: 10,
    left: 10,
    marginLeft: 5,
    color: "red",
    zIndex: 100,
  },
  dynamicHeaderContainer: {
    backgroundColor: "#fff",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  dynamicHeaderText: {
    fontWeight: "bold",
    fontSize: 16,
  },
  fixedDynamicHeaderContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    alignItems: "center",
    justifyContent: "center",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  logoContainer: {
    marginRight: 16,
  },
  logo: {
    width: 40,
    height: 40,
  },
  searchBarContainer: {
    flex: 1,
  },
  searchBar: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 12,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#000",
  },
  createButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "tomato",
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  createButtonText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
  forumList: {
    flex: 1,
    width: "100%",
  },
  forumItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    backgroundColor: "#f0f0f0",
    marginBottom: 10,
    borderRadius: 10,
  },
  forumTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#000",
  },
  forumDate: {
    fontSize: 14,
    color: "#888",
    marginBottom: 5,
  },
  forumDescription: {
    fontSize: 16,
    color: "#000",
  },
  modalContainer: {
    padding: 16,
    backgroundColor: "red",
  },
  modalHeaderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    marginLeft: 20,
    marginRight: 20,
  },
  inputContainer: {
    width: "90%",
    marginBottom: 20,
    alignSelf: "center",
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: "#000",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    backgroundColor: "#fff",
    color: "#000",
  },
  longPressMenu: {
    position: "absolute",
    bottom: 0,
    right: 50,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    flexDirection: "column",
    alignItems: "flex-end",
    zIndex: 2,
  },
  longPressMenuItem: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  longPressMenuItemText: {
    marginLeft: 5,
    color: "#000",
  },
  tabBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 0,
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    alignSelf: "center",
  },
  tabBarButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6,
    paddingVertical: 10,
    borderRadius: 0,
  },
  tabBarIcon: {
    marginRight: 5,
    width: "25%",
    alignSelf: "center",
  },
  activeTab: {
    backgroundColor: "#000",
  },
  activeTabText: {
    color: "tomato",
    fontSize: 22,
  },
  postContainer: {
    marginVertical: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  postItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  tweetItem: {
    borderColor: "#1DA1F2",
    borderLeftWidth: 5,
  },
  instagramItem: {
    borderColor: "#E1306C",
    borderLeftWidth: 5,
  },
  facebookItem: {
    borderColor: "#1877F2",
    borderLeftWidth: 5,
  },
  postContentContainer: {
    marginLeft: 10,
    flex: 1,
    flexDirection: "column",
  },
  postTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  postDate: {
    color: "#555",
  },
  postContent: {
    marginTop: 5,
  },
  postImage: {
    marginTop: 10,
    width: "100%",
    height: 200,
    borderRadius: 10,
  },
  tabBar: {
    flexDirection: "row",
    backgroundColor: "#fff",
    elevation: 2,
  },
  tabBarButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  activeTab: {
    backgroundColor: "#094349",
  },
  tabBarIcon: {
    marginBottom: 3,
  },
  activeTabText: {
    color: "#fff",
  },
  badgeContainer: {
    position: "absolute",
    top: 5,
    right: 30,
    width: 20,
    height: 20,
    backgroundColor: "tomato",
    borderRadius: 10,
    padding: 0,
    zIndex: 1,
  },
  badgeText: {
    color: "#fff",
    marginTop: 2,
    alignSelf: "center",
  },
  createButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  instagramLink: {
    position: "absolute",
    top: -5,
    right: 5,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    padding: 5,
    borderRadius: 5,
    color: "tomato",
    fontWeight: "700",
    fontSize: 15,
  },
  alternativeBrandsContainer: {
    width: "100%",
    marginLeft: "0%",
    alignSelf: "flex-end",
    flexDirection: "column",
    backgroundColor: "#f0f0f0",
    padding: 5,
  },
  alternativeBrandsScrollView: {
    alignItems: "center",
    marginLeft: 20,
  },
  alternativeBrandImage: {
    width: 80,
    height: 80,
    marginRight: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },

  toggleAlternativesButton: {
    backgroundColor: "#000",
    width: "90%",
    alignSelf: "center",
    paddingVertical: 10,
    marginTop: 0,
  },
  toggleAlternativesButtonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },

  clockContainer: {
    height: 300,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  clockBackground: {
    flex: 1,
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  clockOverlay: {
    position: "absolute",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 10,
    padding: 20,
  },
  overlayContent: {
    marginBottom: 10,
  },
  overlayText: {
    color: "#fff",
    fontSize: 16,
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  timeSegment: {
    color: "#fff",
    fontSize: 40,
  },
  timeSeparator: {
    color: "#fff",
    fontSize: 40,
    marginHorizontal: 5,
  },
  seconds: {
    color: "#fff",
    fontSize: 16,
    alignSelf: "center",
  },
  prayerTimeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  prayerName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  prayerTime: {
    fontSize: 16,
  },
  duasContainer: {
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  languageToggleContainer: {
    marginBottom: 10,
  },
  languageToggleText: {
    color: "#3498db",
    fontSize: 16,
  },
  duasHeader: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  duaContainer: {
    marginBottom: 15,
  },
  duaTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2c3e50",
  },
  duaContent: {
    fontSize: 16,
    color: "#7f8c8d",
  },
  zikrContainer: {
    padding: 20,
    backgroundColor: "#ecf0f1",
  },
  zikrHeader: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  zikrItemContainer: {
    marginBottom: 15,
  },
  zikrTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#e74c3c",
  },
  zikrDescription: {
    fontSize: 16,
    color: "#95a5a6",
  },
  zikrCount: {
    fontSize: 14,
    color: "#34495e",
  },
  modalContainer: {
    justifyContent: "flex-end",
    margin: 0,
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    minHeight: "100%",
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
    opacity: 1,
  },
  roundCounter: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  counterText: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 10,
    color: "white",
  },
  currentZikrText: {
    fontSize: 18,
    textAlign: "center",
    marginVertical: 5,
    color: "white",
  },
  floatingEmojisContainer: {
    zIndex: 1,
  },
  floatingEmoji: {
    fontSize: 32,
  },
  stopCounterButton: {
    backgroundColor: "#000",
    padding: 10,
  },
  tileItemContainer: {
    flex: 1,
    margin: 5,
    borderRadius: 0,
    overflow: "hidden",

    flexDirection:'row' // Ensure a square aspect ratio for the tiles
  },
  tileItemImage: {
    width: 60,
    height: 60,
    flexDirection:'row', 
    resizeMode:'contain'
  },
  toggleViewButton:{
    backgroundColor:'#000',
    padding:15,
  },
  toggleViewButtonText:{
    color:'white',
    alignSelf:'center',
    fontSize:15
  },
  alternativeContainer:{
    height:150,
    backgroundColor:'#f0f0f0'
  }
});

export default styles;
