import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();

  await prisma.cart.create({
    data: {
      id: 'cart1',
      userId: 'u1',
      restaurantId: 'r1',
      promoCode: null,
      discount: 0,
      items: {
        create: [
          {
            id: 'ci1',
            menuItemId: 'm5',
            name: 'Truffle Risotto',
            price: 24.00,
            quantity: 2,
            imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCnxLAGNxPUKfragocPZQHc79Q0NlosyANRJU47BRkOYgAG0czvbMVaeC-BbLM8fRCKCnr8FZQi1GddLcOwGirBkFmy170twrnNOsoPafb4ty6u-3n3XaieXktVrSmzoZAQbm6QtOcZ4kkN7UhFGYWYGucaG_jzZ4QWF26X_1F-uvUQXH9mM-Ojjf5sDqx8PwQ413PyA3ERZx6A3aFACK2bnuBfx0J8dimvtIbwnK8O9vu6V1At7eAA3NFusOgYmh4qthn2Nc-X_yk',
            specialInstructions: 'Extra cheese please',
            selectedAddOns: JSON.stringify([{ name: 'Extra Parmesan', price: 3.00 }]),
          },
          {
            id: 'ci2',
            menuItemId: 'm1',
            name: 'Burrata Pugliese',
            price: 18.00,
            quantity: 1,
            imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAVk1Wb1wI5FSvx3Dihn_LiGcgaJYGrFvN14YPuBMCDuxIovV11i7_2j5bq3oVT04UTcZMlUSFalaXN6CsG0_P1WJYqDM0h3Qc4AnzJKJmOMAIZUXBIcXyOyHMPaWwZr-rv8mIaf13C4zZpQhenw3vw9ncBtpZxEs0JjLhrQnW9RoNHJWslU1p3ZFtOlGNu1vaRtOUF3yuuSoaNIoMjcbxK176nODK5EhSznyXDNZtiMnYV4IsztTnQnP2KqkZZrdpKmEJpAYCdQq8',
            specialInstructions: null,
            selectedAddOns: null,
          },
        ],
      },
    },
  });

  console.log('Cart seed completed');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
