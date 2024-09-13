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
  const [phone, setPhone] = useState(""); // Añadido
  const [loading, setLoading] = useState(false);
  const [flag, setFlag] = useState(false);
  const navigate = useNavigate();

  const validateFields = () => {
    if (name.length < 1 || name.length > 30) {
      toast.error("El nombre completo debe tener entre 1 y 30 caracteres.");
      return false;
    }

    if (email.length < 10 || email.length > 30) {
      toast.error("El email debe tener entre 10 y 30 caracteres.");
      return false;
    }

    if (password.length < 6 || password.length > 12) {
      toast.error("La contraseña debe tener entre 6 y 12 caracteres.");
      return false;
    }


    if (password !== confirmPassword) {
      toast.error("Las contraseñas no coinciden.");
      return false;
    }

    if (!/^\d{10}$/.test(phone)) {
      toast.error("El teléfono debe tener exactamente 10 dígitos numéricos.");
      return false;
    }

    return true;
  };

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
          phone, 
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

    if (!validateFields()) {
      setLoading(false);
      return;
    }

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
    
    if (email.length < 10 || email.length > 30 || password.length < 6 || password.length > 12) {
      toast.error("Verifica que el email y la contraseña cumplan con las restricciones.");
      setLoading(false);
      return;
    }

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
      console.error("Error al iniciar sesión con Google: ", error.message);
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
            <form onSubmit={signInWithEmail}>
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
                type="submit"
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
                <p>Teléfono</p>
                <input
                  type="text"
                  placeholder="3002231200" // Debe tener 11 dígitos
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
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
