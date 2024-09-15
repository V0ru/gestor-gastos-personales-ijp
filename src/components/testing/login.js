// Importamos las funciones necesarias de Firebase
import { signInWithEmailAndPassword } from 'firebase/auth';
import { toast } from 'react-toastify';

// Mock de las funciones Firebase y navigate
jest.mock('firebase/auth', () => ({
  signInWithEmailAndPassword: jest.fn(),
}));

jest.mock('react-toastify', () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));

// Simulamos la función navigate
const navigate = jest.fn();
const setLoading = jest.fn();

// Función de login (supongo que está en otro archivo)
const signInWithEmail = async (e, email, password, auth, navigate, setLoading, toast) => {
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
    setLoading(false);
  }
};

// Test para login exitoso
test('debería iniciar sesión exitosamente', async () => {
  // Mock del evento e.preventDefault
  const e = { preventDefault: jest.fn() };

  // Definimos los valores de prueba para email, password y el usuario de Firebase
  const email = 'testuser@gmail.com';
  const password = '123456';
  const auth = {}; // Puedes usar un objeto vacío para simular `auth`
  const user = { uid: '123' };

  // Simulamos la respuesta de Firebase para un login exitoso
  signInWithEmailAndPassword.mockResolvedValue({ user });

  // Ejecutamos la función de login
  await signInWithEmail(e, email, password, auth, navigate, setLoading, toast);

  // Verificamos que `navigate` fue llamado correctamente
  expect(navigate).toHaveBeenCalledWith("/dashboard");

  // Verificamos que el mensaje de éxito fue mostrado
  expect(toast.success).toHaveBeenCalledWith("Has iniciado sesión exitosamente!");

  // Verificamos que setLoading fue llamado con `false`
  expect(setLoading).toHaveBeenCalledWith(false);
});
