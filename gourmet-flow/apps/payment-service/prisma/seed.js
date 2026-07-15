import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.payment.deleteMany();

  await prisma.payment.create({
    data: {
      id: 'pay1',
      orderId: 'o1',
      amount: 64.30,
      currency: 'USD',
      status: 'COMPLETED',
      paymentMethod: 'CARD',
      cardLastFour: '4242',
    },
  });

  console.log('Payment seed completed');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
