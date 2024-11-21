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
import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';

const SignUpSignIn = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [flag, setFlag] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
      <div className="flex justify-center items-center w-screen min-h-screen pt-20 p-5 bg-gray-50">
        <div className="w-[30vw] min-w-[400px] shadow-2xl rounded-xl p-10 bg-white transition-all duration-300 hover:shadow-xl my-2">
          {flag ? (
            <>
              <h2 className="text-3xl font-bold text-center mb-8">
                Bienvenido a <span className="text-theme bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">FinanDay</span>
              </h2>
              <form onSubmit={signInWithEmail} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    placeholder="ijpenaloza@unicesar.edu.co"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
                <div className="mb-4 relative">
                  <label>Contraseña</label>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Ejemplo1234567"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border-b border-black w-full p-2"
                  />
                  <span 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 transform -translate-y-0  cursor-pointer"
                  >
                    {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                  </span>
                </div>
                <button 
                  disabled={loading} 
                  className="w-full p-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-medium hover:opacity-90 transition-all duration-200 disabled:opacity-50"
                  type="submit"
                >
                  {loading ? "Cargando..." : "Iniciar sesión"}
                </button>
              </form>
              <button 
                disabled={loading} 
                className="w-full mt-4 p-3 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-all duration-200 flex items-center justify-center gap-2"
                onClick={signInWithGoogle}
              >
                <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
                {loading ? "Cargando..." : "Iniciar sesión con Google"}
              </button>
              <p onClick={() => setFlag(!flag)} className="text-center mt-6 text-gray-600 hover:text-gray-800 cursor-pointer transition-all duration-200">
                ¿No tienes una cuenta? <span className="text-blue-500 font-medium">Regístrate aquí</span>
              </p>
            </>
          ) : (
            <>
              <h2 className="text-3xl font-bold text-center mb-8">
                Registrarse en <span className="text-theme bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">FinanDay</span>
              </h2>
              <form onSubmit={signUpWithEmail} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Nombre completo</label>
                  <input
                    type="text"
                    placeholder="Ismael Peñaloza"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    placeholder="ijpenaloza@unicesar.edu.co"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Teléfono</label>
                  <input
                    type="text"
                    placeholder="3002231200"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
                <div className="space-y-2 mb-4 relative">
                  <label className="text-sm font-medium text-gray-700">Contraseña</label>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Ejemplo1234567"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                  <span 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 transform -translate-y-1 cursor-pointer"
                  >
                    {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                  </span>
                </div>
                <div className="space-y-2 mb-4 relative">
                  <label className="text-sm font-medium text-gray-700">Confirmar Contraseña</label>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Ejemplo1234567"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                  <span 
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-2 top-1/2 transform -translate-y-1 cursor-pointer"
                  >
                    {showConfirmPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                  </span>
                </div>
                <button 
                  type="submit" 
                  className="w-full p-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-medium hover:opacity-90 transition-all duration-200 disabled:opacity-50"
                >
                  {loading ? "Cargando..." : "Registrarse"}
                </button>
              </form>
              <button 
                disabled={loading} 
                className="w-full mt-4 p-3 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-all duration-200 flex items-center justify-center gap-2"
                onClick={signInWithGoogle}
              >
                <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
                {loading ? "Cargando..." : "Registrarse con Google"}
              </button>
              <p onClick={() => setFlag(!flag)} className="text-center mt-6 text-gray-600 hover:text-gray-800 cursor-pointer transition-all duration-200">
                ¿Ya tienes una cuenta? <span className="text-blue-500 font-medium">Inicia sesión aquí</span>
              </p>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default SignUpSignIn;
