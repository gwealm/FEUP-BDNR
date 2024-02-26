import express from 'express';
import Redis from 'ioredis';
import morgan from 'morgan';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 3000;

// Create Redis
const redis = new Redis();

app.use(express.json());

// HTTP logging
app.use(morgan('tiny'));


// Allow every origin (for dev purposes only)
app.use(cors());

app.get('/', (req, res) => {
  res.send('Hello Redis with Express.js and TypeScript!');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
