import express from "express";
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  patchUser
} from "../controllers/user.controller.js";
import {
  createUserValidation,
  updateUserValidation,
  patchUserValidation,
  validateObjectId
} from "../middlewares/validation.middleware.js";

const router = express.Router();

// GET - Obtener todos los usuarios
router.get("/", getAllUsers);

// GET - Obtener un usuario por ID
router.get("/:id", validateObjectId, getUserById);

// POST - Crear un nuevo usuario
router.post("/", createUserValidation, createUser);

// PUT - Actualizar un usuario completamente
router.put("/:id", validateObjectId, updateUserValidation, updateUser);

// PATCH - Actualizar un usuario parcialmente
router.patch("/:id", validateObjectId, patchUserValidation, patchUser);

// DELETE - Eliminar un usuario
router.delete("/:id", validateObjectId, deleteUser);

export default router; 