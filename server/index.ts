import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import adviceRouter from './api/advice';
import 'dotenv/config';
import { sendDiscordLog } from './utils/discordLogger';

const server = express();

server.use(express.json());
server.use(cors());
server.use(express.urlencoded({ extended: true }));

server.use('/api', adviceRouter);

server.use((req: Request, res: Response, next: NextFunction) => {
  const errorMessage = `Endpoint not found: ${req.method} ${req.originalUrl}`;
  console.warn(`[Sanovise - Warning] ${errorMessage}. IP: ${req.ip || 'unknown'}`);
  sendDiscordLog(`[404] ${errorMessage}. IP: ${req.ip || 'unknown'}. User-Agent: ${req.headers['user-agent'] || 'unknown'}`, 'WARNING');
  res.status(404).json({ success: false, error: errorMessage });
});

server.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('[Sanovise - Error] Unhandled server error: ', err);
  
  sendDiscordLog(
    `Unhandled server error: ${err.message}. ` +
    `Stack: ${err.stack ? err.stack.substring(0, 1000) : 'N/A'}. ` +
    `Request URL: ${req.originalUrl}. ` +
    `Method: ${req.method}. ` +
    `IP: ${req.ip || 'unknown'}. ` +
    `User-Agent: ${req.headers['user-agent'] || 'unknown'}.`,
    'ERROR'
  );

  if (res.headersSent) {
    return next(err);
  }

  res.status(500).json({
    success: false,
    error: 'An unexpected server error occurred. Please try again later.',
    details: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const PORT = process.env.PORT || 3000;
const serverInstance = server.listen(PORT, () => {
  console.log(`[Sanovise - Info] The server has been started. Port: ${PORT}`);
  sendDiscordLog(`The server has been started. Port: ${PORT}`, 'INFO');
});

const gracefulShutdown = (signal: string) => {
  console.log(`[Sanovise - Info] Received ${signal}. Shutting down gracefully.`);
  sendDiscordLog(`Server received ${signal}. Shutting down gracefully.`, 'INFO');

  serverInstance.close((err) => {
    if (err) {
      console.error('[Sanovise - Error] Error during server shutdown: ', err);
      sendDiscordLog(`Error during server shutdown: ${err.message}`, 'ERROR');
      process.exit(1);
    }
    console.log('[Sanovise - Info] Server closed. Exiting process.');
    sendDiscordLog('Server closed. Exiting process.', 'INFO');
    process.exit(0);
  });

  setTimeout(() => {
    console.error('[Sanovise - Error] Forcefully shutting down after timeout!');
    sendDiscordLog('Forcefully shutting down after timeout!', 'ERROR');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));