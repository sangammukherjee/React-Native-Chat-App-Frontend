import { useContext, useEffect } from "react";
import {
  FlatList,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { GlobalContext } from "../context";
import { AntDesign } from "@expo/vector-icons";
import Chatcomponent from "../components/Chatcomponent";
import NewGroupModal from "../components/Modal";
import { socket } from "../utils";
export default function Chatscreen({ navigation }) {
  const {
    currentUser,
    allChatRooms,
    setAllChatRooms,
    modalVisible,
    setModalVisible,
    setCurrentUser,
    setShowLoginView,
  } = useContext(GlobalContext);

  useEffect(() => {
    socket.emit("getAllGroups");

    socket.on("groupList", (groups) => {
      console.log(groups ,'hhhhhhhhhhhhhhhhhhhhhhh');
      setAllChatRooms(groups);
    });
  }, [socket]);

  function handleLogout() {
    setCurrentUser("");
    setShowLoginView(false);
  }

  useEffect(() => {
    if (currentUser.trim() === "") navigation.navigate("Homescreen");
  }, [currentUser]);

  return (
    <View style={styles.mainWrapper}>
      <View style={styles.topContainer}>
        <View style={styles.header}>
          <Text style={styles.heading}>Welcome {currentUser}!</Text>
          <Pressable onPress={handleLogout}>
            <AntDesign name="logout" size={30} color={"black"} />
          </Pressable>
        </View>
      </View>
      <View style={styles.listContainer}>
        {allChatRooms && allChatRooms.length > 0 ? (
          <FlatList
            data={allChatRooms}
            renderItem={({ item }) => <Chatcomponent item={item} />}
            keyExtractor={(item) => item.id}
          />
        ) : null}
      </View>
      <View style={styles.bottomContainer}>
        <Pressable onPress={() => setModalVisible(true)} style={styles.button}>
          <View>
            <Text style={styles.buttonText}>Create New Group</Text>
          </View>
        </Pressable>
      </View>
      {modalVisible && <NewGroupModal />}
    </View>
  );
}

const styles = StyleSheet.create({
  mainWrapper: {
    backgroundColor: "#eee",
    flex: 1,
  },
  topContainer: {
    backgroundColor: "#fff",
    height: 70,
    width: "100%",
    padding: 20,
    justifyContent: "center",
    marginBottom: 15,
    flex: 0.3,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  heading: {
    fontSize: 30,
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
  listContainer: {
    flex: 3.4,
    paddingHorizontal: 10,
  },
  bottomContainer: {
    flex: 0.3,
    padding: 10,
  },
  button: {
    backgroundColor: "#703efe",
    padding: 12,
    width: "100%",
    elevation: 1,
    borderRadius: 50,
  },
  buttonText: {
    textAlign: "center",
    color: "#fff",
    fontWeight: "bold",
    fontSize: 20,
  },
});
