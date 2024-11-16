import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, provider, db } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  fetchSignInMethodsForEmail,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import Header from "./Header";
import { toast } from "react-toastify";

const SignUpSignIn = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
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

  const checkEmailExists = async (email) => {
    try {
      const methods = await fetchSignInMethodsForEmail(auth, email);
      return methods.length > 0; // Retorna true si el correo ya está en uso
    } catch (error) {
      console.error("Error al verificar el correo: ", error);
      return false;
    }
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

    const emailExists = await checkEmailExists(email);
    if (emailExists) {
      toast.error("El correo electrónico ya está registrado.");
      setLoading(false);
      return;
    }

    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
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
      <div className="flex justify-center items-center w-screen h-[90vh] mt-20 p-5">
        <div className="w-[30vw] min-w-[400px] shadow-lg rounded-lg p-8 bg-white">
          {flag ? (
            <>
              <h2 className="text-center">Iniciar sesión en <span className="text-theme">FinanDay.</span></h2>
              <form onSubmit={signInWithEmail}>
                <div className="mb-4">
                  <label>Email</label>
                  <input
                    type="email"
                    placeholder="ijpenaloza@unicesar.edu.co"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border-b border-black w-full p-2"
                  />
                </div>
                <div className="mb-4">
                  <label>Contraseña</label>
                  <input
                    type="password"
                    placeholder="Ejemplo1234567"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border-b border-black w-full p-2"
                  />
                </div>
                <button disabled={loading} className="bg-blue-500 text-white w-full p-2 rounded" type="submit">
                  {loading ? "Cargando..." : "Iniciar sesión"}
                </button>
              </form>
              <button disabled={loading} className="bg-blue-500 text-white w-full p-2 rounded mt-4" onClick={signInWithGoogle}>
                {loading ? "Cargando..." : "Iniciar sesión con Google"}
              </button>
              <p onClick={() => setFlag(!flag)} className="text-center cursor-pointer">
                ¿No tienes una cuenta? <span className="text-theme">Haga clic aquí.</span>
              </p>
            </>
          ) : (
            <>
              <h2 className="text-center">Registrarse en <span className="text-theme">FinanDay.</span></h2>
              <form onSubmit={signUpWithEmail}>
                <div className="mb-4">
                  <label>Nombre completo</label>
                  <input
                    type="text"
                    placeholder="Ismael Peñaloza"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="border-b border-black w-full p-2"
                  />
                </div>
                <div className="mb-4">
                  <label>Email</label>
                  <input
                    type="email"
                    placeholder="ijpenaloza@unicesar.edu.co"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border-b border-black w-full p-2"
                  />
                </div>
                <div className="mb-4">
                  <label>Teléfono</label>
                  <input
                    type="text"
                    placeholder="3002231200"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="border-b border-black w-full p-2"
                  />
                </div>
                <div className="mb-4">
                  <label>Contraseña</label>
                  <input
                    type="password"
                    placeholder="Ejemplo1234567"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border-b border-black w-full p-2"
                  />
                </div>
                <div className="mb-4">
                  <label>Confirmar Contraseña</label>
                  <input
                    type="password"
                    placeholder="Ejemplo1234567"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="border-b border-black w-full p-2"
                  />
                </div>
                <button type="submit" className="bg-blue-500 text-white w-full p-2 rounded">
                  {loading ? "Cargando..." : "Registrarse"}
                </button>
              </form>
              <button disabled={loading} className="bg-blue-500 text-white w-full p-2 rounded mt-4" onClick={signInWithGoogle}>
                {loading ? "Cargando..." : "Registrarse con Google"}
              </button>
              <p onClick={() => setFlag(!flag)} className="text-center cursor-pointer">
                ¿Ya tienes una cuenta? <span className="text-theme">Haga clic aquí.</span>
              </p>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default SignUpSignIn;
