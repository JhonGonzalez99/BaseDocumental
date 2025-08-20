import bcrypt from "bcrypt";

const hashPassword = async (password) => {
  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  } catch (error) {
    console.error("Error al hashear contraseña:", {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
    throw new Error("Error al procesar la contraseña");
  }
};

const comparePassword = async (password, hash) => {
  try {
    const isValid = await bcrypt.compare(password, hash);
    return isValid;
  } catch (error) {
    console.error("Error al comparar contraseñas:", {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
    throw new Error("Error al verificar la contraseña");
  }
};

export { hashPassword, comparePassword };
