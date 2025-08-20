import prisma from "../utils/database.js";
import { hashPassword, comparePassword } from "../utils/hash.js";

export const register = async (req, res) => {
  const { name, email, password } = req.body;
  
  try {
    console.log(`Intento de registro para email: ${email}`);
    
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      console.log(`Email ya registrado: ${email}`);
      return res.status(400).json({ message: "Email ya registrado" });
    }

    const hashed = await hashPassword(password);
    const user = await prisma.user.create({
      data: { name, email, password: hashed },
    });
    
    console.log(`Usuario registrado exitosamente: ${user.id}`);
    res.status(201).json({ id: user.id, name: user.name, email: user.email });
  } catch (err) {
    console.error("Error en registro:", {
      message: err.message,
      stack: err.stack,
      email: email,
      timestamp: new Date().toISOString()
    });
    
    // Manejo específico de errores de Prisma
    if (err.code === 'P2002') {
      console.error("Error de duplicado en base de datos");
      return res.status(400).json({ message: "Email ya registrado" });
    }
    
    res.status(500).json({ error: "Error al registrar usuario" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  
  try {
    console.log(`Intento de login para email: ${email}`);
    
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      console.log(`Login fallido - Usuario no encontrado: ${email}`);
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    const valid = await comparePassword(password, user.password);
    if (!valid) {
      console.log(`Login fallido - Contraseña incorrecta para: ${email}`);
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    console.log(`Login exitoso para usuario: ${user.id}`);
    // Sin JWT, solo demostración
    res.json({ id: user.id, name: user.name, email: user.email });
  } catch (err) {
    console.error("Error en login:", {
      message: err.message,
      stack: err.stack,
      email: email,
      timestamp: new Date().toISOString()
    });
    
    res.status(500).json({ error: "Error al iniciar sesión" });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  
  try {
    console.log(`Intento de recuperación de contraseña para email: ${email}`);
    
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      console.log(`Recuperación fallida - Usuario no encontrado: ${email}`);
      return res.status(404).json({ message: "No se encontró una cuenta con ese email" });
    }

    // Resetear contraseña a "password123"
    const newPassword = "password123";
    const hashedPassword = await hashPassword(newPassword);
    
    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword },
    });
    
    console.log(`Contraseña reseteada exitosamente para usuario: ${user.id}`);
    res.json({ 
      message: "Contraseña restablecida exitosamente",
      newPassword: newPassword,
      note: "Te recomendamos cambiar esta contraseña después de iniciar sesión"
    });
  } catch (err) {
    console.error("Error en recuperación de contraseña:", {
      message: err.message,
      stack: err.stack,
      email: email,
      timestamp: new Date().toISOString()
    });
    
    res.status(500).json({ error: "Error al restablecer la contraseña" });
  }
};
