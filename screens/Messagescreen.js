import { useContext, useEffect, useLayoutEffect } from "react";
import {
  FlatList,
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { GlobalContext } from "../context";
import Messagecomponent from "../components/Messagecomponent";
import  {socket}  from "../utils/index";

export default function Messagescreen({ navigation, route }) {
  const { currentGroupName, currentGroupID } = route.params;
  const {
    allChatMessages,
    setAllChatMessages,
    currentUser,
    currentChatMesage,
    setCurrentChatMessage,
  } = useContext(GlobalContext);

  function handleAddNewMessage() {
    const timeData = {
      hr:
        new Date().getHours() < 10
          ? `0${new Date().getHours()}`
          : new Date().getHours(),
      mins:
        new Date().getMinutes() < 10
          ? `0${new Date().getMinutes()}`
          : new Date().getMinutes(),
    };

    if (currentUser) {
      socket.emit("newChatMessage", {
        currentChatMesage,
        groupIdentifier: currentGroupID,
        currentUser,
        timeData,
      });

      setCurrentChatMessage("");
      Keyboard.dismiss();
    }
  }


  useEffect(()=>{
    socket.emit('findGroup', currentGroupID)
    socket.on('foundGroup', (allChats)=> setAllChatMessages(allChats))
  },[socket])


  return (
    <View style={styles.wrapper}>
      <View
        style={[styles.wrapper, { paddingVertical: 15, paddingHorizontal: 10 }]}
      >
        {allChatMessages && allChatMessages[0] ? (
          <FlatList
            data={allChatMessages}
            renderItem={({ item }) => (
              <Messagecomponent item={item} currentUser={currentUser} />
            )}
            keyExtractor={(item) => item.id}
          />
        ) : (
          ""
        )}
      </View>
      <View style={styles.messageInputContainer}>
        <TextInput
          style={styles.messageInput}
          value={currentChatMesage}
          onChangeText={(value) => setCurrentChatMessage(value)}
          placeholder="Enter your message"
        />

        <Pressable onPress={handleAddNewMessage} style={styles.button}>
          <View>
            <Text style={styles.buttonText}>SEND</Text>
          </View>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#eee",
  },
  messageInputContainer: {
    width: "100%",
    backgroundColor: "#fff",
    paddingVertical: 30,
    paddingHorizontal: 15,
    justifyContent: "center",
    flexDirection: "row",
  },
  messageInput: {
    borderWidth: 1,
    padding: 15,
    flex: 1,
    borderRadius: 50,
    marginRight: 10,
  },
  button: {
    width: "30%",
    backgroundColor: "#703efe",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
  },
  buttonText: {
    color: "#fff",
    fontSize: 20,
  },
});
