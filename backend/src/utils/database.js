import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Manejo de errores de conexión de Prisma
prisma.$connect()
  .then(() => {
    console.log("Conexión a base de datos establecida");
  })
  .catch((error) => {
    console.error("Error al conectar con la base de datos:", {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
  });

// Manejo de desconexión graceful
process.on('beforeExit', async () => {
  await prisma.$disconnect();
  console.log("Conexión a base de datos cerrada");
});

export default prisma; 