import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.address.deleteMany();
  await prisma.userProfile.deleteMany();

  await prisma.userProfile.create({
    data: {
      id: 'up1',
      authId: 'u1',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1-555-0101',
      avatarUrl: null,
      addresses: {
        create: [
          {
            id: 'a1',
            label: 'Home',
            street: '123 Main Street',
            city: 'New York',
            postalCode: '10001',
            details: 'Apt 4B',
            isDefault: true,
            latitude: 40.7128,
            longitude: -74.006,
          },
          {
            id: 'a2',
            label: 'Work',
            street: '456 Broadway',
            city: 'New York',
            postalCode: '10013',
            details: 'Floor 12',
            isDefault: false,
            latitude: 40.7191,
            longitude: -74.0027,
          },
        ],
      },
    },
  });

  await prisma.userProfile.create({
    data: {
      id: 'up2',
      authId: 'u2',
      name: 'Admin User',
      email: 'admin@grabmyfood.com',
      phone: '+1-555-0000',
      avatarUrl: null,
      addresses: {
        create: [
          {
            id: 'a3',
            label: 'Office',
            street: '789 Park Avenue',
            city: 'New York',
            postalCode: '10021',
            details: 'Suite 300',
            isDefault: true,
            latitude: 40.7712,
            longitude: -73.9632,
          },
        ],
      },
    },
  });

  console.log('User seed completed');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
