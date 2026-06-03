import app from "./app.js";
import { prisma } from "../prisma/prisma.ts";

const port = Number(process.env.PORT) || 3000;

const startServer = async () => {
  try {
    await prisma.$connect();
    console.log("Connected to Database");

    app.listen(port, () => {
      console.log(`Listening on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to connect to database:", error);
    process.exit(1);
  }
};

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

startServer();