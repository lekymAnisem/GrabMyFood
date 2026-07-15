import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.delivery.deleteMany();

  await prisma.delivery.create({
    data: {
      id: 'del1',
      orderId: 'o1',
      driverId: 'd1',
      driverName: 'Mike Johnson',
      driverRating: 4.9,
      driverOrders: 1250,
      driverPhoto: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDwau_WuzYEzprqxI0PBkoKqzsOS_ga-7-UMLBD89TAEPqNXE81bRHjHLn5zDS5qtPXcfUCDf25xsfKTpSPjtlvxk34YnyhINp_ehqs6TQ7JubTmnAQoJg07vtpR3vmVFILgLaZelVlTWNLYSqzMEkwKdLGvU9KKm0skuj2GKswRQwEIx7Ge2FZ1xIq70UDHWokdEgKnHL6u1HywfWqrYcFH-luEjnhINePD2zmCVXoPdIqR4nOGV6FKweppj4SRjVPnwX0_9yeWFc',
      status: 'DELIVERED',
      estimatedMinutes: 0,
      lat: 40.7128,
      lng: -74.006,
    },
  });

  console.log('Delivery seed completed');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
