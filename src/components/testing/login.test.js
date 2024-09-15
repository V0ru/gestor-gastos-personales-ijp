// testing/login.test.js
import { signInWithEmail, signInWithGoogle } from './login';

jest.mock('firebase/auth', () => ({
  signInWithEmailAndPassword: jest.fn(),
  signInWithPopup: jest.fn(),
}));

describe('Login tests', () => {
  let auth, provider, navigate, setLoading, toast, createUserDocument;

  beforeEach(() => {
    auth = {};
    provider = {};
    navigate = jest.fn();
    setLoading = jest.fn();
    toast = {
      success: jest.fn(),
      error: jest.fn(),
    };
    createUserDocument = jest.fn();
  });

  describe('signInWithEmail', () => {
    test('debería mostrar un error si el email o contraseña no cumplen con las restricciones', async () => {
      const e = { preventDefault: jest.fn() };
      const email = 'abc';
      const password = '123';
      
      await signInWithEmail(e, email, password, auth, navigate, setLoading, toast);

      expect(toast.error).toHaveBeenCalledWith("Verifica que el email y la contraseña cumplan con las restricciones.");
      expect(setLoading).toHaveBeenCalledWith(false);
    });

    test('debería iniciar sesión exitosamente', async () => {
      const e = { preventDefault: jest.fn() };
      const email = 'juan.perez@gmail.com';
      const password = '123456';
      const user = { uid: '123' };
      
      const signInWithEmailAndPassword = require('firebase/auth').signInWithEmailAndPassword;
      signInWithEmailAndPassword.mockResolvedValue({ user });

      await signInWithEmail(e, email, password, auth, navigate, setLoading, toast);

      expect(navigate).toHaveBeenCalledWith("/dashboard");
      expect(toast.success).toHaveBeenCalledWith("Has iniciado sesión exitosamente!");
      expect(setLoading).toHaveBeenCalledWith(false);
    });

    test('debería manejar un error durante el inicio de sesión', async () => {
      const e = { preventDefault: jest.fn() };
      const email = 'juan.perez@gmail.com';
      const password = '123456';

      const signInWithEmailAndPassword = require('firebase/auth').signInWithEmailAndPassword;
      signInWithEmailAndPassword.mockRejectedValue({ message: "Error al iniciar sesión" });

      await signInWithEmail(e, email, password, auth, navigate, setLoading, toast);

      expect(toast.error).toHaveBeenCalledWith("Error al iniciar sesión");
      expect(setLoading).toHaveBeenCalledWith(false);
    });
  });

  describe('signInWithGoogle', () => {
    test('debería iniciar sesión exitosamente con Google', async () => {
      const user = { uid: '123' };
      const signInWithPopup = require('firebase/auth').signInWithPopup;
      signInWithPopup.mockResolvedValue({ user });

      await signInWithGoogle(auth, provider, createUserDocument, navigate, setLoading, toast);

      expect(createUserDocument).toHaveBeenCalledWith(user);
      expect(toast.success).toHaveBeenCalledWith("Usuario autenticado exitosamente!");
      expect(navigate).toHaveBeenCalledWith("/dashboard");
      expect(setLoading).toHaveBeenCalledWith(false);
    });

    test('debería manejar un error durante el inicio de sesión con Google', async () => {
      const signInWithPopup = require('firebase/auth').signInWithPopup;
      signInWithPopup.mockRejectedValue({ message: "Error al iniciar sesión con Google" });

      await signInWithGoogle(auth, provider, createUserDocument, navigate, setLoading, toast);

      expect(toast.error).toHaveBeenCalledWith("Error al iniciar sesión con Google");
      expect(setLoading).toHaveBeenCalledWith(false);
    });
  });
});
