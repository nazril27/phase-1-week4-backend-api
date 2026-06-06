import app from './app.js';
import { prisma } from '../prisma/prisma.ts';
import config from './config/config.js';
import logger from './config/logger.js';

// const startServer = async () => {
//   try {
//     await prisma.$connect();
//     console.log("Connected to Database");

//     app.listen(port, () => {
//       console.log(`Listening on port ${port}`);
//     });
//   } catch (error) {
//     console.error("Failed to connect to database:", error);
//     process.exit(1);
//   }
// };

// process.on("SIGINT", async () => {
//   await prisma.$disconnect();
//   process.exit(0);
// });

// process.on("SIGTERM", async () => {
//   await prisma.$disconnect();
//   process.exit(0);
// });

// startServer();

let server;

if (prisma) {
  logger.info('Connected to Database');
  server = app.listen(config.port, () => {
    logger.info(`Listening to port ${config.port}`);
  });
}

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  if (server) {
    server.close();
  }
});
