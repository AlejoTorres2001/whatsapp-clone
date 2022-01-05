import React, { useEffect, useRef, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import styled from "styled-components";
import { auth, db } from "../firebase";
import { useRouter } from "next/router";
import { Avatar, IconButton } from "@material-ui/core";
import getRecipientEmail from "../utils/getRecipientEmail";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { AttachFile, InsertEmoticon, Mic } from "@material-ui/icons";
import { useCollection } from "react-firebase-hooks/firestore";
import {
  collection,
  orderBy,
  where,
  query,
  addDoc,
  serverTimestamp,
  setDoc,
  doc,
  getDocs,
} from "firebase/firestore";
import Message from "./Message";
import TimeAgo from "timeago-react";
import moment from "moment";
const ChatScreen = ({ chat, messages }) => {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const qConstrains = [where("chatId", "==", chat.id), orderBy("timestamp")];
  const q = query(collection(db, "messages"), ...qConstrains);
  const [messagesSnapshot] = useCollection(q);
  const [newMessage, setNewMessage] = useState("");
  const [receiverData, setReceiverData] = useState(null);
  const EndOfMessagesRef = useRef(null);
  const getReceiverData = async () => {
    const receiver = getRecipientEmail(chat.users, user);
    //get receiver's data from firebase
    const q = query(collection(db, "users"), where("email", "==", receiver));
    const data = (await getDocs(q)).docs[0]?.data();
    return data;
  };
  const handleReceiverData = async () => {
    const data = await getReceiverData();
    setReceiverData({
      lastConnection: data?.lastSeen.toDate(),
      photoURL: data?.photoURL,
    });
  };
  useEffect(() => {
    handleReceiverData();
  }, [router.query.id]);

  const setLastSeen = () => {
    setDoc(
      doc(db, "users", user.uid),
      {
        lastSeen: serverTimestamp(),
      },
      { merge: true }
    );
  };
  const scrollToBottom = () => {
    EndOfMessagesRef.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (newMessage) {
      //add message to db collection
      addDoc(collection(db, "messages"), {
        chatId: chat.id,
        from: user.email,
        to: getRecipientEmail(chat.users, user),
        message: newMessage,
        timestamp: serverTimestamp(),
      });
      //Update last seen
      setLastSeen();
    }
    setNewMessage("");
    scrollToBottom();
  };
  const showMessages = () => {
    //up to date messages from client side
    if (messagesSnapshot) {
      return messagesSnapshot.docs.map((message) => (
        <Message
          key={message.id}
          from={message.data().from}
          to={message.data().to}
          message={message.data().message}
          timestamp={
            //message?.data()?.timestamp?.toDate().toLocaleString().split(",")[0]
            moment(message?.data()?.timestamp?.toDate()).format("LT")
          }
          isUserTheOwner={message.data().from === user?.email}
        />
      ));
    } else {
      //messages from server side
      const jsonMessages = JSON.parse(messages);
      return jsonMessages.map((message) => (
        <Message
          key={message.id}
          from={message.from}
          to={message.to}
          message={message.message}
          timestamp={"..."}
          isUserTheOwner={message.from === user?.email}
        />
      ));
    }
  };

  return (
    <Container>
      <Header>
        <Avatar src={receiverData?.photoURL}></Avatar>
        <HeaderInformation>
          <h3>{getRecipientEmail(chat.users, user)}</h3>
          {receiverData ? (
            <p>
              last active:{" "}
              {receiverData?.lastConnection ? (
                <TimeAgo datetime={receiverData?.lastConnection}></TimeAgo>
              ) : (
                "Unavailable"
              )}{" "}
            </p>
          ) : (
            <p>Awaiting...</p>
          )}
        </HeaderInformation>
        <HeaderIcons>
          <IconButton>
            <AttachFile></AttachFile>
          </IconButton>
          <IconButton>
            <MoreVertIcon></MoreVertIcon>
          </IconButton>
        </HeaderIcons>
      </Header>
      <MessagesContainer>
        {showMessages()}
        <EndOfMessage ref={EndOfMessagesRef}></EndOfMessage>
      </MessagesContainer>
      <InputContainer onSubmit={handleSubmit}>
        <InsertEmoticon></InsertEmoticon>
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        ></Input>
        <Mic></Mic>
      </InputContainer>
    </Container>
  );
};

export default ChatScreen;

const Container = styled.div``;

const Header = styled.div`
  position: sticky;
  background-color: white;
  z-index: 100;
  top: 0;
  display: flex;
  padding: 11px;
  height: 80px;
  align-items: center;
  border-bottom: 1px solid whitesmoke;
`;

const HeaderInformation = styled.div`
  margin-left: 15px;
  flex: 1;
  > h3 {
    margin-bottom: 3px;
  }
  > p {
    font-size: 14px;
    color: gray;
  }
`;
const HeaderIcons = styled.div``;

const EndOfMessage = styled.div`
  margin-bottom: 50px;
`;
const MessagesContainer = styled.div`
  padding: 30px;
  background-color: #e5ded8;
  min-height: 90vh;
`;
const InputContainer = styled.form`
  display: flex;
  align-items: center;
  padding: 10px;
  position: sticky;
  bottom: 0;
  background-color: white;
  z-index: 100;
`;
const Input = styled.input`
  flex: 1;
  align-items: center;
  outline: 0;
  border: none;
  padding: 20px;
  position: sticky;
  bottom: 0;
  background-color: whitesmoke;
  border-radius: 10px;
  margin-left: 15px;
  margin-right: 15px;
`;
