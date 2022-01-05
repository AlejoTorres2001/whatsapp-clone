import { Button } from "@material-ui/core";
import Head from "next/head";
import styled from "styled-components";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase";

const Login = () => {
  const SignIn = () => {
    signInWithPopup(auth, provider).catch((error) => alert(error.message));
  };
  return (
    <Container>
      <Head>
        <title>Login</title>
      </Head>
      <LoginContainer>
        <Logo src="http://assets.stickpng.com/images/580b57fcd9996e24bc43c543.png"></Logo>
        <Button onClick={SignIn} variant="outlined">
          Sign in With Google
        </Button>
      </LoginContainer>
    </Container>
  );
};

export default Login;

const Container = styled.div`
  display: grid;
  place-items: center;
  height: 100vh;
  background-color: whitesmoke;
`;

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100px;
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0px 4px 14px -3px rgba(0, 0, 0, 0.75);
`;

const Logo = styled.img`
  height: 200px;
  width: 200px;
  margin-bottom: 20px;
`;
