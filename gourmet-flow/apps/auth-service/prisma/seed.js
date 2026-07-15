import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  await prisma.refreshToken.deleteMany();
  await prisma.userCredential.deleteMany();

  const passwordHash = await bcrypt.hash('password123', 10);

  await prisma.userCredential.create({
    data: {
      id: 'u1',
      email: 'john@example.com',
      passwordHash,
      name: 'John Doe',
      role: 'CUSTOMER',
      isActive: true,
    },
  });

  await prisma.userCredential.create({
    data: {
      id: 'u2',
      email: 'admin@grabmyfood.com',
      passwordHash,
      name: 'Admin User',
      role: 'ADMIN',
      isActive: true,
    },
  });

  console.log('Auth seed completed');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
