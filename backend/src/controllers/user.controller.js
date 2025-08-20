import prisma from "../utils/database.js";

// GET - Obtener todos los usuarios (sin contraseñas)
export const getAllUsers = async (req, res) => {
  try {
    console.log("Solicitud para obtener todos los usuarios");
    
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        // Excluimos password por seguridad
      }
    });
    
    console.log(`Usuarios obtenidos exitosamente: ${users.length} usuarios`);
    res.json(users);
  } catch (err) {
    console.error("Error al obtener usuarios:", {
      message: err.message,
      stack: err.stack,
      timestamp: new Date().toISOString()
    });
    
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
};

// GET - Obtener un usuario por ID
export const getUserById = async (req, res) => {
  const { id } = req.params;
  
  try {
    console.log(`Solicitud para obtener usuario con ID: ${id}`);
    
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        // Excluimos password por seguridad
      }
    });
    
    if (!user) {
      console.log(`Usuario no encontrado con ID: ${id}`);
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    
    console.log(`Usuario obtenido exitosamente: ${user.id}`);
    res.json(user);
  } catch (err) {
    console.error("Error al obtener usuario por ID:", {
      message: err.message,
      stack: err.stack,
      userId: id,
      timestamp: new Date().toISOString()
    });
    
    res.status(500).json({ error: "Error al obtener usuario" });
  }
};

// POST - Crear un nuevo usuario (alternativo al register)
export const createUser = async (req, res) => {
  const { name, email, password } = req.body;
  
  try {
    console.log(`Intento de crear usuario con email: ${email}`);
    
    // Verificar si el usuario ya existe
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      console.log(`Email ya registrado: ${email}`);
      return res.status(400).json({ error: "Email ya registrado" });
    }
    
    // Importar hashPassword dinámicamente para evitar dependencias circulares
    const { hashPassword } = await import("../utils/hash.js");
    const hashed = await hashPassword(password);
    
    const user = await prisma.user.create({
      data: { name, email, password: hashed },
      select: {
        id: true,
        name: true,
        email: true,
        // Excluimos password por seguridad
      }
    });
    
    console.log(`Usuario creado exitosamente: ${user.id}`);
    res.status(201).json(user);
  } catch (err) {
    console.error("Error al crear usuario:", {
      message: err.message,
      stack: err.stack,
      email: email,
      timestamp: new Date().toISOString()
    });
    
    // Manejo específico de errores de Prisma
    if (err.code === 'P2002') {
      console.error("Error de duplicado en base de datos");
      return res.status(400).json({ error: "Email ya registrado" });
    }
    
    res.status(500).json({ error: "Error al crear usuario" });
  }
};

// PUT - Actualizar un usuario
export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, password } = req.body;
  
  try {
    console.log(`Intento de actualizar usuario con ID: ${id}`);
    
    // Verificar si el usuario existe
    const existingUser = await prisma.user.findUnique({ where: { id } });
    if (!existingUser) {
      console.log(`Usuario no encontrado para actualizar: ${id}`);
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    
    // Preparar datos de actualización
    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (password) {
      const { hashPassword } = await import("../utils/hash.js");
      updateData.password = await hashPassword(password);
    }
    
    // Si no hay datos para actualizar
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: "No hay datos para actualizar" });
    }
    
    // Verificar si el email ya existe (si se está actualizando)
    if (email && email !== existingUser.email) {
      const emailExists = await prisma.user.findUnique({ where: { email } });
      if (emailExists) {
        console.log(`Email ya existe: ${email}`);
        return res.status(400).json({ error: "Email ya registrado" });
      }
    }
    
    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        // Excluimos password por seguridad
      }
    });
    
    console.log(`Usuario actualizado exitosamente: ${updatedUser.id}`);
    res.json(updatedUser);
  } catch (err) {
    console.error("Error al actualizar usuario:", {
      message: err.message,
      stack: err.stack,
      userId: id,
      timestamp: new Date().toISOString()
    });
    
    // Manejo específico de errores de Prisma
    if (err.code === 'P2002') {
      console.error("Error de duplicado en base de datos");
      return res.status(400).json({ error: "Email ya registrado" });
    }
    
    if (err.code === 'P2025') {
      console.error("Usuario no encontrado para actualizar");
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    
    res.status(500).json({ error: "Error al actualizar usuario" });
  }
};

// DELETE - Eliminar un usuario
export const deleteUser = async (req, res) => {
  const { id } = req.params;
  
  try {
    console.log(`Intento de eliminar usuario con ID: ${id}`);
    
    // Verificar si el usuario existe
    const existingUser = await prisma.user.findUnique({ where: { id } });
    if (!existingUser) {
      console.log(`Usuario no encontrado para eliminar: ${id}`);
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    
    await prisma.user.delete({ where: { id } });
    
    console.log(`Usuario eliminado exitosamente: ${id}`);
    res.json({ message: "Usuario eliminado exitosamente" });
  } catch (err) {
    console.error("Error al eliminar usuario:", {
      message: err.message,
      stack: err.stack,
      userId: id,
      timestamp: new Date().toISOString()
    });
    
    // Manejo específico de errores de Prisma
    if (err.code === 'P2025') {
      console.error("Usuario no encontrado para eliminar");
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    
    res.status(500).json({ error: "Error al eliminar usuario" });
  }
};

// PATCH - Actualización parcial de usuario
export const patchUser = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;
  
  try {
    console.log(`Intento de actualización parcial de usuario con ID: ${id}`);
    
    // Verificar si el usuario existe
    const existingUser = await prisma.user.findUnique({ where: { id } });
    if (!existingUser) {
      console.log(`Usuario no encontrado para actualización parcial: ${id}`);
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    
    // Filtrar solo campos válidos
    const validFields = ['name', 'email', 'password'];
    const filteredData = {};
    
    for (const [key, value] of Object.entries(updateData)) {
      if (validFields.includes(key) && value !== undefined) {
        filteredData[key] = value;
      }
    }
    
    // Si no hay datos válidos para actualizar
    if (Object.keys(filteredData).length === 0) {
      return res.status(400).json({ error: "No hay datos válidos para actualizar" });
    }
    
    // Hashear contraseña si se está actualizando
    if (filteredData.password) {
      const { hashPassword } = await import("../utils/hash.js");
      filteredData.password = await hashPassword(filteredData.password);
    }
    
    // Verificar email único si se está actualizando
    if (filteredData.email && filteredData.email !== existingUser.email) {
      const emailExists = await prisma.user.findUnique({ where: { email: filteredData.email } });
      if (emailExists) {
        console.log(`Email ya existe: ${filteredData.email}`);
        return res.status(400).json({ error: "Email ya registrado" });
      }
    }
    
    const updatedUser = await prisma.user.update({
      where: { id },
      data: filteredData,
      select: {
        id: true,
        name: true,
        email: true,
        // Excluimos password por seguridad
      }
    });
    
    console.log(`Usuario actualizado parcialmente exitosamente: ${updatedUser.id}`);
    res.json(updatedUser);
  } catch (err) {
    console.error("Error en actualización parcial de usuario:", {
      message: err.message,
      stack: err.stack,
      userId: id,
      timestamp: new Date().toISOString()
    });
    
    // Manejo específico de errores de Prisma
    if (err.code === 'P2002') {
      console.error("Error de duplicado en base de datos");
      return res.status(400).json({ error: "Email ya registrado" });
    }
    
    if (err.code === 'P2025') {
      console.error("Usuario no encontrado para actualización parcial");
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    
    res.status(500).json({ error: "Error al actualizar usuario" });
  }
}; 