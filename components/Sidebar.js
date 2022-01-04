import styled from "styled-components";
import { Avatar, Button, IconButton, Input } from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { Chat } from "@material-ui/icons";
import { Search } from "@material-ui/icons";
import Modal from "./Modal";
import { useState } from "react";
import { signOut } from "firebase/auth";
import * as EmailValidator from "email-validator";
import { auth, db } from "../firebase";
import { collection, addDoc, where, query } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import ChatEntry from "./ChatEntry";
const Sidebar = () => {
  const [user] = useAuthState(auth);
  const chatsRef = collection(db, "chats");
  const q = query(chatsRef, where("users", "array-contains", user.email));

  const [chatSnapshot,loading] = useCollection(q);
  //console.log(chatSnapshot)
  const [showModal, setShowModal] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const receiverEmail = e.target[0].value;
    if (
      EmailValidator.validate(receiverEmail) &&
      !ChatAlreadyExist(receiverEmail) &&
      receiverEmail !== user.email
    ) {
      CreateNewChat(receiverEmail);
      setShowModal(false);
    } else {
      console.error("Error!");
    }
  };
  const OpenModal = () => {
    setShowModal(true);
  };
  const CreateNewChat = (receiverEmail) => {
    addDoc(chatsRef, {
      users: [user.email, receiverEmail],
    });
  };
  const ChatAlreadyExist = (receiverEmail) =>
    !!chatSnapshot.docs.find((doc) => doc.data().users.includes(receiverEmail));

  return (
    <>
      <Container>
        <Modal
          onClose={() => setShowModal(false)}
          show={showModal}
          title={"Insert the user's email to start a new chat"}
        >
          <form onSubmit={handleSubmit}>
            <ModalInput type="text" />
          </form>
        </Modal>
        <Header>
          <UserAvatar src={user.photoURL} onClick={() => signOut(auth)}></UserAvatar>
          <IconsContainer>
            <IconButton>
              <Chat />
            </IconButton>
            <IconButton>
              <MoreVertIcon />
            </IconButton>
          </IconsContainer>
        </Header>
        <SearchBar>
          <Search />
          <SearchInput placeholder="Search in Chat"></SearchInput>
        </SearchBar>
        <SideBarButton onClick={OpenModal}>Start a New Chat</SideBarButton>
        {/* List of chats */}
        {loading?<h1>Loading chats...</h1> : chatSnapshot.docs.map((chat) => {
            return <ChatEntry key={chat.id} id={chat.id} users={chat.data().users}/>
        })}
      </Container>
      <div id="modal-root"></div>
    </>
  );
};

export default Sidebar;

const Container = styled.div``;

const Header = styled.div`
  display: flex;
  position: sticky;
  top: 0;
  background-color: #fff;
  z-index: 1;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  height: 80px;
  border-bottom: 1px solid whitesmoke;
`;

const IconsContainer = styled.div``;

const UserAvatar = styled(Avatar)`
  cursor: pointer;
  :hover {
    opacity: 0.8;
  }
`;
const SearchBar = styled.div`
  display: flex;
  align-items: center;
  padding: 20px;
  border-radius: 2px;
`;
const SearchInput = styled.input`
  outline-width: 0;
  flex: 1;
  border: none;
  padding: 10px;
`;

const SideBarButton = styled(Button)`
  width: 100%;
  &&& {
    border-top: 1px solid whitesmoke;
    border-bottom: 1px solid whitesmoke;
  }
`;
const ModalInput = styled(Input)`
  width: 100%;
  height: 30px;
  margin-top: 20px;
`;
