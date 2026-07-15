import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import config from '../config/index.js';

const prisma = new PrismaClient({
  datasources: { db: { url: config.database.url } },
});

export async function register({ email, password, name }) {
  const existing = await prisma.userCredential.findUnique({ where: { email } });
  if (existing) {
    const err = new Error('Email already registered');
    err.statusCode = 409;
    err.code = 'EMAIL_EXISTS';
    throw err;
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await prisma.userCredential.create({
    data: { email, passwordHash, name, role: 'user' },
  });

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  const decoded = jwt.decode(refreshToken);
  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt: new Date(decoded.exp * 1000),
    },
  });

  return {
    user: { id: user.id, email: user.email, name: user.name, role: user.role },
    accessToken,
    refreshToken,
  };
}

export async function login({ email, password }) {
  const user = await prisma.userCredential.findUnique({ where: { email } });
  if (!user) {
    const err = new Error('Invalid email or password');
    err.statusCode = 401;
    err.code = 'INVALID_CREDENTIALS';
    throw err;
  }

  const passwordMatch = await bcrypt.compare(password, user.passwordHash);
  if (!passwordMatch) {
    const err = new Error('Invalid email or password');
    err.statusCode = 401;
    err.code = 'INVALID_CREDENTIALS';
    throw err;
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  const decoded = jwt.decode(refreshToken);
  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt: new Date(decoded.exp * 1000),
    },
  });

  return {
    user: { id: user.id, email: user.email, name: user.name, role: user.role },
    accessToken,
    refreshToken,
  };
}

export function logout() {
  return { message: 'Logged out successfully' };
}

export async function refresh({ refreshToken }) {
  let payload;
  try {
    payload = jwt.verify(refreshToken, config.jwt.refreshSecret);
  } catch {
    const err = new Error('Invalid or expired refresh token');
    err.statusCode = 401;
    err.code = 'INVALID_REFRESH_TOKEN';
    throw err;
  }

  const stored = await prisma.refreshToken.findUnique({ where: { token: refreshToken } });
  if (!stored) {
    const err = new Error('Refresh token not recognized');
    err.statusCode = 401;
    err.code = 'INVALID_REFRESH_TOKEN';
    throw err;
  }

  if (stored.expiresAt < new Date()) {
    await prisma.refreshToken.delete({ where: { id: stored.id } });
    const err = new Error('Refresh token expired');
    err.statusCode = 401;
    err.code = 'INVALID_REFRESH_TOKEN';
    throw err;
  }

  const user = await prisma.userCredential.findUnique({ where: { id: payload.sub } });
  if (!user) {
    await prisma.refreshToken.delete({ where: { id: stored.id } });
    const err = new Error('User not found');
    err.statusCode = 401;
    err.code = 'USER_NOT_FOUND';
    throw err;
  }

  await prisma.refreshToken.delete({ where: { id: stored.id } });

  const newAccessToken = generateAccessToken(user);
  const newRefreshToken = generateRefreshToken(user);

  const decoded = jwt.decode(newRefreshToken);
  await prisma.refreshToken.create({
    data: {
      token: newRefreshToken,
      userId: user.id,
      expiresAt: new Date(decoded.exp * 1000),
    },
  });

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
}

export async function verify(userId) {
  const user = await prisma.userCredential.findUnique({ where: { id: userId } });
  if (!user) {
    const err = new Error('User not found');
    err.statusCode = 404;
    err.code = 'USER_NOT_FOUND';
    throw err;
  }

  return { id: user.id, email: user.email, name: user.name, role: user.role };
}

function generateAccessToken(user) {
  return jwt.sign(
    { sub: user.id, email: user.email, name: user.name, role: user.role },
    config.jwt.secret,
    { expiresIn: config.jwt.accessExpiration }
  );
}

function generateRefreshToken(user) {
  return jwt.sign(
    { sub: user.id },
    config.jwt.refreshSecret,
    { expiresIn: config.jwt.refreshExpiration }
  );
}
