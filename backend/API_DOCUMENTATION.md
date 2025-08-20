# API Documentation - Backend de Autenticación y Usuarios

## Base URL
```
http://localhost:3000/api
```

## Endpoints de Autenticación

### POST /auth/register
Registra un nuevo usuario.

**Body:**
```json
{
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "password": "123456"
}
```

**Respuesta exitosa (201):**
```json
{
  "id": "507f1f77bcf86cd799439011",
  "name": "Juan Pérez",
  "email": "juan@example.com"
}
```

**Validaciones:**
- `name`: Obligatorio, no puede estar vacío
- `email`: Obligatorio, debe ser un email válido
- `password`: Obligatorio, mínimo 6 caracteres

---

### POST /auth/login
Inicia sesión de un usuario.

**Body:**
```json
{
  "email": "juan@example.com",
  "password": "123456"
}
```

**Respuesta exitosa (200):**
```json
{
  "id": "507f1f77bcf86cd799439011",
  "name": "Juan Pérez",
  "email": "juan@example.com"
}
```

**Validaciones:**
- `email`: Obligatorio, debe ser un email válido
- `password`: Obligatorio, no puede estar vacío

---

## Endpoints de Usuarios (CRUD)

### GET /users
Obtiene todos los usuarios (sin contraseñas).

**Respuesta exitosa (200):**
```json
[
  {
    "id": "507f1f77bcf86cd799439011",
    "name": "Juan Pérez",
    "email": "juan@example.com"
  },
  {
    "id": "507f1f77bcf86cd799439012",
    "name": "María García",
    "email": "maria@example.com"
  }
]
```

---

### GET /users/:id
Obtiene un usuario específico por ID.

**Parámetros:**
- `id`: ID del usuario (ObjectId de MongoDB)

**Respuesta exitosa (200):**
```json
{
  "id": "507f1f77bcf86cd799439011",
  "name": "Juan Pérez",
  "email": "juan@example.com"
}
```

**Validaciones:**
- `id`: Debe ser un ObjectId válido de MongoDB (24 caracteres hexadecimales)

---

### POST /users
Crea un nuevo usuario (alternativo al registro).

**Body:**
```json
{
  "name": "Ana López",
  "email": "ana@example.com",
  "password": "123456"
}
```

**Respuesta exitosa (201):**
```json
{
  "id": "507f1f77bcf86cd799439013",
  "name": "Ana López",
  "email": "ana@example.com"
}
```

**Validaciones:**
- `name`: Obligatorio, no puede estar vacío
- `email`: Obligatorio, debe ser un email válido
- `password`: Obligatorio, mínimo 6 caracteres

---

### PUT /users/:id
Actualiza completamente un usuario.

**Parámetros:**
- `id`: ID del usuario (ObjectId de MongoDB)

**Body:**
```json
{
  "name": "Juan Carlos Pérez",
  "email": "juancarlos@example.com",
  "password": "nueva123456"
}
```

**Respuesta exitosa (200):**
```json
{
  "id": "507f1f77bcf86cd799439011",
  "name": "Juan Carlos Pérez",
  "email": "juancarlos@example.com"
}
```

**Validaciones:**
- `id`: Debe ser un ObjectId válido de MongoDB
- `name`: Opcional, si se proporciona no puede estar vacío
- `email`: Opcional, si se proporciona debe ser un email válido
- `password`: Opcional, si se proporciona mínimo 6 caracteres

---

### PATCH /users/:id
Actualiza parcialmente un usuario.

**Parámetros:**
- `id`: ID del usuario (ObjectId de MongoDB)

**Body:**
```json
{
  "name": "Juan Carlos Pérez"
}
```

**Respuesta exitosa (200):**
```json
{
  "id": "507f1f77bcf86cd799439011",
  "name": "Juan Carlos Pérez",
  "email": "juan@example.com"
}
```

**Validaciones:**
- `id`: Debe ser un ObjectId válido de MongoDB
- `name`: Opcional, si se proporciona no puede estar vacío
- `email`: Opcional, si se proporciona debe ser un email válido
- `password`: Opcional, si se proporciona mínimo 6 caracteres

---

### DELETE /users/:id
Elimina un usuario.

**Parámetros:**
- `id`: ID del usuario (ObjectId de MongoDB)

**Respuesta exitosa (200):**
```json
{
  "message": "Usuario eliminado exitosamente"
}
```

**Validaciones:**
- `id`: Debe ser un ObjectId válido de MongoDB

---

## Códigos de Error Comunes

### 400 - Bad Request
```json
{
  "error": "Email ya registrado"
}
```

### 401 - Unauthorized
```json
{
  "message": "Credenciales inválidas"
}
```

### 404 - Not Found
```json
{
  "error": "Usuario no encontrado"
}
```

### 500 - Internal Server Error
```json
{
  "error": "Error interno del servidor"
}
```

## Errores de Validación
```json
{
  "errors": [
    {
      "type": "field",
      "value": "",
      "msg": "El nombre es obligatorio",
      "path": "name",
      "location": "body"
    }
  ]
}
```

## Características de Seguridad

- ✅ Contraseñas hasheadas con bcrypt
- ✅ Validación de datos de entrada
- ✅ Logging detallado de errores
- ✅ Manejo de errores de base de datos
- ✅ Validación de ObjectIds de MongoDB
- ✅ Exclusión de contraseñas en respuestas
- ✅ Verificación de emails únicos

## Logging

El sistema registra automáticamente:
- Todas las requests con timestamp
- Errores de validación
- Operaciones exitosas de CRUD
- Errores de base de datos
- Intentos de login fallidos
- Errores de conexión

## Ejemplos de Uso

### Crear un usuario
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "123456"
  }'
```

### Obtener todos los usuarios
```bash
curl http://localhost:3000/api/users
```

### Actualizar un usuario
```bash
curl -X PUT http://localhost:3000/api/users/507f1f77bcf86cd799439011 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Name",
    "email": "updated@example.com"
  }'
```

### Eliminar un usuario
```bash
curl -X DELETE http://localhost:3000/api/users/507f1f77bcf86cd799439011
``` 