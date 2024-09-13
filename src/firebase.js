import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, PhoneAuthProvider } from "firebase/auth"; // Asegúrate de incluir PhoneAuthProvider
import { getFirestore, doc, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyABX73zAOn-9bvm2ajlwPzHorJibk4ivBM",
  authDomain: "proyecto-gestor-pagos.firebaseapp.com",
  projectId: "proyecto-gestor-pagos",
  storageBucket: "proyecto-gestor-pagos.appspot.com",
  messagingSenderId: "637220259729",
  appId: "1:637220259729:web:5a355f8fbd2bc927f03c30"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const phoneProvider = new PhoneAuthProvider(auth); // Asegúrate de definir PhoneAuthProvider

export { db, auth, provider, phoneProvider, doc, setDoc };
