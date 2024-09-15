// testing/validarCampos.js
export const validarCampos = (name, email, password, confirmPassword, phone) => {
    if (name.length < 1 || name.length > 30) {
      return "El nombre completo debe tener entre 1 y 30 caracteres.";
    }
  
    if (email.length < 10 || email.length > 30) {
      return "El email debe tener entre 10 y 30 caracteres.";
    }
  
    if (password.length < 6 || password.length > 12) {
      return "La contraseña debe tener entre 6 y 12 caracteres.";
    }
  
    if (password !== confirmPassword) {
      return "Las contraseñas no coinciden.";
    }
  
    if (!/^\d{10}$/.test(phone)) {
      return "El teléfono debe tener exactamente 10 dígitos numéricos.";
    }
  
    return "Valido";
  };
  