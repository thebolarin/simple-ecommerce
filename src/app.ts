import { errorHandler, NotFoundError } from './common';
import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import Router from './routes/index';
import 'express-async-errors';
import { config } from 'dotenv';

config()

const app = express();
app.set('trust proxy', true);
app.use(json());

app.use('/api', Router);


app.all('*', async (req, res) => {
  throw new NotFoundError("Route not found!!");
});

app.use(errorHandler);

app.set("port", process.env.PORT || 3000);

export { app };