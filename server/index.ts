import express from 'express';
require('dotenv').config();

const server = express();

server.listen(process.env.PORT || 3000, () => {
    console.log('[Sanovise] Server is running on port: ' + (process.env.PORT || 3000));
});