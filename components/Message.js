import React from 'react'
import styled from 'styled-components'

const Message = ({to,from,timestamp,message}) => {
    return (
        <Container>
             <p>{from}</p>
             <p>{to}</p>  
            <p>{message}</p>
        </Container>
    )
}

export default Message
const Container = styled.div``