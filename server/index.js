import express from 'express';
import cors from 'cors';
//allows requests from 5173 port front-end server
import api from './routes/api.js';
//importing express and cors for setup of server from routes/api.js

const app = express();
//express app instance for server
const PORT = 3000;
//using PORT 3000 for backend server

app.use(cors());
app.use(express.json());
//app using express.json for JSON bodies

app.use('/api', api);
//using cors and json middleware for request handling

app.listen(PORT, () => {});
//could place message for console log here, not sure how to access