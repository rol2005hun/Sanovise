import express from 'express';
import cors from 'cors';
// import adviceRouter from './api/advice';
import adviceRouter2 from './api/advice2';
import 'dotenv/config';

const server = express();

server.use(express.json());
server.use(cors());
server.use(express.urlencoded({ extended: true }));
// server.use('/api', adviceRouter);
server.use('/api', adviceRouter2);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`[Sanovise - Info] A szerver sikeresen elindult, port: ${PORT}`);
});