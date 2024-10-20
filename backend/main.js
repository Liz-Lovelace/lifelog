import express from 'express';
import cookieParser from 'cookie-parser';
import moment from 'moment';
import cors from 'cors';
import shortUUID from 'short-uuid';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config();

const prisma = new PrismaClient();

const app = express();

app.use(cookieParser());
app.use(express.json());

if (process.env.NODE_ENV === 'development') {
  app.use(cors({
    origin: 'http://localhost:1234',
    credentials: true,
  }));
}


const authenticate = (req, res, next) => {
  const authString = req.cookies.lifelog_auth;
  if (!authString) {
    return res.status(401).send('Authentication required');
  }

  const hashedAuth = crypto.createHash('sha256').update(authString).digest('hex');
  if (hashedAuth !== process.env.LIFELOG_SECRET_COOKIE_HASH) {
    return res.status(403).send('Invalid authentication');
  }

  next();
};

app.post('/login', async (req, res) => {
  const password = req.body.password;
  if (!password) {
    return res.status(401).send('Authentication required');
  }

  const hashedAuth = crypto.createHash('sha256').update(password).digest('hex');
  if (hashedAuth !== process.env.LIFELOG_PASSWORD_HASH) {
    return res.status(403).send('Invalid authentication');
  }
  res.cookie('lifelog_auth', process.env.LIFELOG_SECRET_COOKIE, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
  })

  res.send('Logged in');
});

app.use(authenticate);

app.post('/event', async (req, res) => {
  if (!req.body.note) {
    return res.status(400).json({ error: 'Note is required' });
  }
  const event = await prisma.event.create({
    data: {
      uuid: shortUUID.generate(),
      timestamp: moment().unix(),
      note: req.body.note,
    }
  });
  res.json({
    event,
  });
});

app.get('/history', async (req, res) => {
  const events = await prisma.event.findMany();
  res.json({
    history: events,
  });
});

app.listen(4444, () => {
  console.log('Server running on port 4444');
});