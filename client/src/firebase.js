import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyCdlfxGbQH2rNdSpFGbgiSNcx5XU4yNZjw",
  authDomain: "video-91f9d.firebaseapp.com",
  projectId: "video-91f9d",
  storageBucket: "video-91f9d.appspot.com",
  messagingSenderId: "155083230469",
  appId: "1:155083230469:web:7126ecb1f8fd93ff8fbb6c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth();
export const provider = new GoogleAuthProvider();
export default app;