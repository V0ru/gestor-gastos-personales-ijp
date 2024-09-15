// testing/validarCampos.test.js
import { validarCampos } from './validarCampos';

describe('validarCampos', () => {
  test('debería validar correctamente cuando todos los campos son válidos', () => {
    const result = validarCampos("Juan Pérez", "juan.perez@gmail.com", "123456", "123456", "1234567890");
    expect(result).toBe("Valido");
  });

  test('debería mostrar error si el nombre es demasiado corto', ( ) => {
    const result = validarCampos("", "juan.perez@gmail.com", "123456", "123456", "1234567890");
    expect(result).toBe("El nombre completo debe tener entre 1 y 30 caracteres.");
  });
  
  test('debería mostrar error si el email es demasiado corto', () => {
    const result = validarCampos("Juan Pérez", "abc@gmail.com", "123456", "123456", "1234567890");
    expect(result).toBe("El email debe tener entre 10 y 30 caracteres.");
  });

  test('debería mostrar error si las contraseñas no coinciden', () => {
    const result = validarCampos("Juan Pérez", "juan.perez@gmail.com", "123456", "654321", "1234567890");
    expect(result).toBe("Las contraseñas no coinciden.");
  });

  test('debería mostrar error si el teléfono no tiene 10 dígitos', () => {
    const result = validarCampos("Juan Pérez", "juan.perez@gmail.com", "123456", "123456", "12345");
    expect(result).toBe("El teléfono debe tener exactamente 10 dígitos numéricos.");
  });
});
