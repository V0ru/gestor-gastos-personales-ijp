import React from 'react';
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import app from './firebaseConfig';

const Login = () => {
  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log('Login Success:', user);
      // Manejar el inicio de sesión exitoso
    } catch (error) {
      console.error('Login Failed:', error);
      // Manejar el inicio de sesión fallido
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <button onClick={handleLogin} className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded">
        Login with Google
      </button>
    </div>
  );
};

export default Login;
