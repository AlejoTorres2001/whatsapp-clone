import React, { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import styled from "styled-components";
import { auth, db } from "../firebase";
import { useRouter } from "next/router";
import { Avatar, IconButton } from "@material-ui/core";
import getRecipientEmail from "../utils/getRecipientEmail";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { AttachFile, InsertEmoticon, Mic } from "@material-ui/icons";
import { useCollection } from "react-firebase-hooks/firestore";
import { collection, orderBy, where, query,addDoc,serverTimestamp} from "firebase/firestore";
import Message from "./Message";
const ChatScreen = ({ chat, messages }) => {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const qConstrains = [where("chatId", "==", chat.id), orderBy("timestamp")];
  const q = query(collection(db, "messages"), ...qConstrains);
  const [messagesSnapshot] = useCollection(q);
  const [newMessage, setNewMessage] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (newMessage) {
                addDoc(collection(db,"messages"), {
                    chatId: chat.id,
                    from: user.email,
                    to: getRecipientEmail(chat.users, user),
                    message: newMessage,
                    timestamp: serverTimestamp() || Date().now(),
                })
        }
        setNewMessage('');

    }
  const showMessages = () => {
    if (messagesSnapshot) {
      return messagesSnapshot.docs.map((message) => (
        <Message
          key={message.id}
          from={message.data().from}
          to={message.data().to}
          message={message.data().message}
          timestamp={message?.data()?.timestamp?.toDate()?.getTime()}
          isOwnerConnected={message.data().from === user?.email}
        />
      ));
    } else {
      const jsonMessages = JSON.parse(messages);
      return jsonMessages.map((message) => (
        <Message
          key={message.id}
          from={message.from}
          to={message.to}
          message={message.message}
          timestamp={"awaiting..."}
          isOwnerConnected={message.from === user?.email}
        />
      ));
    }
  };

  return (
    <Container>
      <Header>
        <Avatar></Avatar>
        <HeaderInformation>
          <h3>{getRecipientEmail(chat.users, user)}</h3>
          <p>last seen</p>
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
        <EndOfMessage></EndOfMessage>
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

const EndOfMessage = styled.div``;
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
