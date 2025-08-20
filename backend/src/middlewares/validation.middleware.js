// src/middlewares/validation.middleware.js
import { body, param, validationResult } from "express-validator";

// Middleware para validar ID de MongoDB
export const validateObjectId = [
  param("id")
    .isLength({ min: 24, max: 24 })
    .withMessage("ID inválido")
    .matches(/^[0-9a-fA-F]{24}$/)
    .withMessage("ID debe ser un ObjectId válido de MongoDB"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.error("Error de validación de ID:", {
        errors: errors.array(),
        id: req.params.id,
        timestamp: new Date().toISOString()
      });
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

export const registerValidation = [
  body("name").notEmpty().withMessage("El nombre es obligatorio"),
  body("email").isEmail().withMessage("Email no válido"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("La contraseña debe tener al menos 6 caracteres"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.error("Errores de validación en registro:", {
        errors: errors.array(),
        body: { name: req.body.name, email: req.body.email },
        timestamp: new Date().toISOString()
      });
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

export const loginValidation = [
  body("email").isEmail().withMessage("Email no válido"),
  body("password").notEmpty().withMessage("La contraseña es obligatoria"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.error("Errores de validación en login:", {
        errors: errors.array(),
        body: { email: req.body.email },
        timestamp: new Date().toISOString()
      });
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// Validación para crear usuario
export const createUserValidation = [
  body("name").notEmpty().withMessage("El nombre es obligatorio"),
  body("email").isEmail().withMessage("Email no válido"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("La contraseña debe tener al menos 6 caracteres"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.error("Errores de validación en creación de usuario:", {
        errors: errors.array(),
        body: { name: req.body.name, email: req.body.email },
        timestamp: new Date().toISOString()
      });
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// Validación para actualizar usuario (PUT)
export const updateUserValidation = [
  body("name").optional().notEmpty().withMessage("El nombre no puede estar vacío"),
  body("email").optional().isEmail().withMessage("Email no válido"),
  body("password")
    .optional()
    .isLength({ min: 6 })
    .withMessage("La contraseña debe tener al menos 6 caracteres"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.error("Errores de validación en actualización de usuario:", {
        errors: errors.array(),
        body: req.body,
        timestamp: new Date().toISOString()
      });
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// Validación para actualización parcial (PATCH)
export const patchUserValidation = [
  body("name").optional().notEmpty().withMessage("El nombre no puede estar vacío"),
  body("email").optional().isEmail().withMessage("Email no válido"),
  body("password")
    .optional()
    .isLength({ min: 6 })
    .withMessage("La contraseña debe tener al menos 6 caracteres"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.error("Errores de validación en actualización parcial de usuario:", {
        errors: errors.array(),
        body: req.body,
        timestamp: new Date().toISOString()
      });
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

export const forgotPasswordValidation = [
  body("email").isEmail().withMessage("Email no válido"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.error("Errores de validación en recuperación de contraseña:", {
        errors: errors.array(),
        body: { email: req.body.email },
        timestamp: new Date().toISOString()
      });
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
