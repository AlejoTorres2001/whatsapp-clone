import "../styles/globals.css";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import Login from "./login";
import Loading from "../components/Loading";
import { useEffect } from "react";
function MyApp({ Component, pageProps }) {
  const [user, loading] = useAuthState(auth);
  useEffect(() => {
    if (user) {
      const usersRef = doc(db, "users", user.uid);
      setDoc(usersRef, {
        email: user.email,
        lastSeen: serverTimestamp(),
        photoURL: user.photoURL,
      });
    }
  }, [user]);
  if (loading) return <Loading />;

  if (!user) return <Login></Login>;

  return <Component {...pageProps} />;
}

export default MyApp;
