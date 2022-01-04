import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import styled from "styled-components";
import { auth, db } from "../firebase";
import { useRouter } from "next/router";
import { Avatar, IconButton } from "@material-ui/core";
import getRecipientEmail from "../utils/getRecipientEmail";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { AttachFile } from "@material-ui/icons";
import { useCollection } from "react-firebase-hooks/firestore";
import { collection, orderBy, where,getDoc, query } from "firebase/firestore";
import Message from "./Message";
const ChatScreen = ({ chat, messages }) => {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const qConstrains =[where("chatId", "==", chat.id), orderBy("timestamp")]
  const q = query(collection(db, "messages"),...qConstrains );
  const [messagesSnapshot] = useCollection(q)

  const showMessages = () => {
      if(messagesSnapshot){
          return messagesSnapshot.docs.map((message)=>(
              <Message key={message.id}
                        from={message.data().from}
                        to={message.data().to}
                        message={message.data().message}
                        timestamp={message.data().timestamp.toDate().getTime()}
                        isOwnerConnected={message.data().from === user?.email}
                        />
          ))
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
const MessagesContainer = styled.div``;
