import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();

  await prisma.order.create({
    data: {
      id: 'o1',
      userId: 'u1',
      restaurantId: 'r1',
      restaurantName: "L'Anima di Roma",
      status: 'DELIVERED',
      subtotal: 66.00,
      deliveryFee: 0,
      platformFee: 3.30,
      discount: 5.00,
      total: 64.30,
      promoCode: 'WELCOME5',
      deliveryAddress: JSON.stringify({
        label: 'Home',
        street: '123 Main Street',
        city: 'New York',
        postalCode: '10001',
        details: 'Apt 4B',
      }),
      paymentMethod: 'CARD',
      specialInstructions: 'Leave at the door',
      paymentId: 'pay1',
      deliveryId: 'del1',
      items: {
        create: [
          {
            id: 'oi1',
            name: 'Truffle Risotto',
            price: 24.00,
            quantity: 2,
            notes: 'Extra cheese please',
          },
          {
            id: 'oi2',
            name: 'Burrata Pugliese',
            price: 18.00,
            quantity: 1,
            notes: null,
          },
        ],
      },
    },
  });

  console.log('Order seed completed');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
