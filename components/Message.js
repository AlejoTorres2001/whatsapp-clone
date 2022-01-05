import React from 'react'
import styled from 'styled-components'

const Message = ({to,from,timestamp,message,isUserTheOwner}) => {
    const TypeOfMessage = isUserTheOwner ? Sender : Receiver 
    return (
        <Container>
            
            <TypeOfMessage>{message}
            
            <Timestamp>{timestamp}</Timestamp>
            </TypeOfMessage>
           <Timestamp></Timestamp>
        </Container>
    )
}

export default Message
const Container = styled.div``
const MessageElement = styled.p`
width:fit-content;
padding:15px;
border-radius:8px;
margin:10px;
min-width:60px;
padding-bottom:26px;
position:relative;
text-align:right;
`
const Sender = styled(MessageElement)`
margin-left:auto;
background-color:#dcf8c6;
`
const Receiver = styled(MessageElement)`
text-align:left;
background-color:whitesmoke;
`
const Timestamp = styled.span`
color:gray;
padding:10px;
font-size:9px;
position:absolute;
bottom:0;
text-align:right;
right:0;
`