import React from 'react'
import styled from 'styled-components'

const Message = ({to,from,timestamp,message,isOwnerConnected}) => {
    return (
        <Container>
            <div className={isOwnerConnected?`sender`:'receiver'}>
            <p>{message}</p>
            </div>
             
        </Container>
    )
}

export default Message
const Container = styled.div``