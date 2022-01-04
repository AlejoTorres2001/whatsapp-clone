import { collection, query, where,doc, getDocs, orderBy, getDoc } from 'firebase/firestore'
import Head from 'next/head'
import React from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import styled from 'styled-components'
import ChatScreen from '../../components/ChatScreen'
import Sidebar from "../../components/Sidebar"
import { auth, db } from '../../firebase'
import getRecipientEmail from '../../utils/getRecipientEmail'
const Chat = ({chat , messages}) => {
    const [user] = useAuthState(auth)
    return (
        <Container>
            <Head>
              <title>Chat with {getRecipientEmail(chat.users,user)}</title>  
            </Head>
            <Sidebar></Sidebar>
            <ChatContainer>
                <ChatScreen chat={chat} messages={messages}></ChatScreen>
            </ChatContainer>
        </Container>
    )
}

export default Chat

export async function getServerSideProps(context) {
    //grab the messages server side
    const qConstrains = [where("chatId", "==", context.query.id) ,orderBy("timestamp")]
    const q = query(collection(db,"messages"),...qConstrains)
    const snapshot = getDocs(q)
    const messages = snapshot.docs?.maps((doc)=>({
        id:doc.id,
        ...doc.data()
    })).map(messages =>({
        ...messages,
        timestamp:messages.timestamp.toDate().getTime()
    }))
    //prep the chats
    const chatRef =  doc(collection(db,"chats"),context.query.id)
    const chatDoc = await getDoc(chatRef)
    const chat = {
        id:chatDoc.id,
        ...chatDoc.data()
    }
    console.log(chat)
    console.log(messages)
    return {
        props: {
            messages: JSON.stringify(messages) || null,
            chat: chat
        },
    }
}
const Container = styled.div`

display:flex;
`
const ChatContainer = styled.div`
flex:1;
overflow:scroll;
height:100vh;
::-webkit-scrollbar {
    display: none;
}
--ms-overflow-style: none;
scrollbar-width: none;
`
