import { Avatar } from "@material-ui/core";
import { useAuthState } from "react-firebase-hooks/auth";
import styled from "styled-components";
import { auth, db } from "../firebase";
import getRecipientEmail from "../utils/getRecipientEmail";
import { useCollection } from "react-firebase-hooks/firestore";
import { collection, query, where } from "firebase/firestore";
import {useRouter} from "next/router"
const ChatEntry = ({id,users}) => {
  const router = useRouter();
  const [user] = useAuthState(auth);
  const recipientEmail = getRecipientEmail(users,user)
  const usersRef = collection(db, "users");
  const q = query(usersRef, where("email", "==",recipientEmail));
  const [recipientSnapshot] = useCollection(q);
  const recipient = recipientSnapshot?.docs?.[0]?.data();

  const enterChat = ()=>{
    router.push(`/chat/${id}`)
  }
    return (
      <Container onClick={enterChat}>
        {recipient ? (
        
        <UserAvatar src={recipient?.photoURL}></UserAvatar>

        ): 
        <UserAvatar>{recipientEmail[0]}</UserAvatar>}
        {recipientEmail}
      </Container>
    )
}

export default ChatEntry


const Container = styled.div`display:flex;align-items:center; padding:15px; word-break: break-all; cursor:pointer; :hover{
  background-color:#e9eaeb;
} `
const UserAvatar = styled(Avatar)` margin:5px; margin-right: 15px;`