import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, provider, db } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import Header from "./Header";
import { toast } from "react-toastify";

const SignUpSignIn = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [flag, setFlag] = useState(false);
  const navigate = useNavigate();

  const createUserDocument = async (user) => {
    setLoading(true);
    if (!user) return;

    const userRef = doc(db, "users", user.uid);
    const userData = await getDoc(userRef);

    if (!userData.exists()) {
      const { displayName, email, photoURL } = user;
      const createdAt = new Date();

      try {
        await setDoc(userRef, {
          name: displayName ? displayName : name,
          email,
          photoURL: photoURL ? photoURL : "",
          createdAt,
        });
        toast.success("Cuenta creada!");
        setLoading(false);
      } catch (error) {
        toast.error(error.message);
        console.error("Error al crear el usuario: ", error);
        setLoading(false);
      }
    }
  };

  const signUpWithEmail = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = result.user;
      await createUserDocument(user);
      toast.success("Registrado exitosamente!");
      setLoading(false);
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.message);
      console.error(
        "Error al registrarse con correo electrónico y contraseña: ",
        error.message
      );
      setLoading(false);
    }
  };

  const signInWithEmail = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const user = result.user;
      navigate("/dashboard");
      toast.success("Has iniciado sesión exitosamente!");
      setLoading(false);
    } catch (error) {
      toast.error(error.message);
      console.error(
        "Error al iniciar sesión con correo electrónico y contraseña: ",
        error.message
      );
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      await createUserDocument(user);
      toast.success("Usuario autenticado exitosamente!");
      setLoading(false);
      navigate("/dashboard");
    } catch (error) {
      setLoading(false);
      toast.error(error.message);
      console.error("Error al iniciar sesion con Google: ", error.message);
    }
  };

  return (
    <>
      <Header />
      <div className="wrapper">
        {flag ? (
          <div className="signup-signin-container">
            <h2 className="text-center">
              Iniciar sesión en <span className="text-blue-500">FinanDay.</span>
            </h2>
            <form onSubmit={signUpWithEmail}>
              <div className="input-wrapper">
                <p>Email</p>
                <input
                  type="email"
                  placeholder="ijpenaloza@unicesar.edu.co"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input"
                />
              </div>

              <div className="input-wrapper">
                <p>Password</p>
                <input
                  type="password"
                  placeholder="Ejemplo1234567"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input"
                />
              </div>

              <button
                disabled={loading}
                className="btn"
                onClick={signInWithEmail}
              >
                {loading ? "Loading..." : "Iniciar sesión con correo electrónico y contraseña"}
              </button>
            </form>
            <p className="text-center"></p>
            <button
              disabled={loading}
              className="btn btn-blue"
              onClick={signInWithGoogle}
            >
              {loading ? "Loading..." : "Iniciar sesión con Google"}
            </button>
            <p
              onClick={() => setFlag(!flag)}
              className="text-center mb-0 mt-2 cursor-pointer"
            >
              ¿No tienes una cuenta? <span className="text-blue-500">Haga clic aquí.</span>
            </p>
          </div>
        ) : (
          <div className="signup-signin-container">
            <h2 className="text-center">
              Registrarse en <span className="text-blue-500">FinanDay.</span>
            </h2>
            <form onSubmit={signUpWithEmail}>
              <div className="input-wrapper">
                <p>Nombre completo</p>
                <input
                  type="text"
                  placeholder="Ismael Peñaloza"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input"
                />
              </div>
              <div className="input-wrapper">
                <p>Email</p>
                <input
                  type="email"
                  placeholder="ijpenaloza@unicesar.edu.co"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input"
                />
              </div>

              <div className="input-wrapper">
                <p>Contraseña</p>
                <input
                  type="password"
                  placeholder="Ejemplo1234567"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input"
                />
              </div>

              <div className="input-wrapper">
                <p>Confirmar Contraseña</p>
                <input
                  type="password"
                  placeholder="Ejemplo1234567"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="input"
                />
              </div>

              <button type="submit" className="btn">
                {loading ? "Loading..." : "Registrarse con correo electrónico y contraseña"}
              </button>
            </form>
            <button
              disabled={loading}
              className="btn btn-blue"
              onClick={signInWithGoogle}
            >
              {loading ? "Loading..." : "Registrarse con Google"}
            </button>
            <p
              onClick={() => setFlag(!flag)}
              className="text-center mb-0 mt-2 cursor-pointer"
            >
              ¿Ya tienes una cuenta? <span className="text-blue-500">Haga clic aquí.</span>
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default SignUpSignIn;
