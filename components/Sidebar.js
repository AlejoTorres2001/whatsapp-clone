import styled from "styled-components";
import { Avatar, Button, IconButton,Input } from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { Chat } from "@material-ui/icons";
import { Search } from "@material-ui/icons";
import Modal from "./Modal";
import { useState } from "react";
import { signOut } from "firebase/auth";
import * as EmailValidator from "email-validator"
import { auth } from "../firebase";
const Sidebar = () => {
    const [showModal, setShowModal] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        const email = e.target[0].value
        if (EmailValidator.validate(email)) {
            //Need to add the chat into the db
            CreateNewChat(email);
        }
    }
    const OpenModal = () => {
        setShowModal(true);
    }
    const CreateNewChat= (email)=>{

    }

  return (
      <>
    <Container>
        <Modal
          onClose={() => setShowModal(false)}
          show={showModal}
          title={"Insert the user's email to start a new chat"}
        >
            <form onSubmit={handleSubmit}> 
                <ModalInput type="text"/>
            </form>

        </Modal>
      <Header>
        <UserAvatar onClick={()=>signOut(auth)}></UserAvatar>
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
      <SideBarButton onClick={OpenModal} >Start a New Chat</SideBarButton>
      {/* List of chats */}
    </Container>
      <div id="modal-root"></div>
</>
  );
};

export default Sidebar;

const Container = styled.div``;

const Header = styled.div`
display: flex;
position:sticky;
top:0;
background-color: #fff;
z-index:1;
justify-content: space-between;
align-items: center;
padding:15px;
height:80px;
border-bottom: 1px solid whitesmoke;
`;

const IconsContainer = styled.div``;

const UserAvatar = styled(Avatar)`
  cursor: pointer;
  :hover{
      opacity: 0.8;
  }
`;
const SearchBar = styled.div`display:flex; align-items:center; padding:20px; border-radius:2px;`;
const SearchInput = styled.input` outline-width:0; flex:1; border:none; padding:10px;`;

const SideBarButton = styled(Button)` width:100%;
    &&&{
        border-top:1px solid whitesmoke;
        border-bottom:1px solid whitesmoke;
    } 
`;
const ModalInput = styled(Input)`
    width: 100%;
    height: 30px;
    margin-top: 20px;
    
`;