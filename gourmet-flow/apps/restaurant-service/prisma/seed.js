import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.review.deleteMany();
  await prisma.restaurant.deleteMany();

  await prisma.restaurant.create({
    data: {
      id: 'r1',
      name: "L'Anima di Roma",
      description: 'Experience authentic Roman cuisine crafted with imported Italian ingredients and centuries-old family recipes. Our chefs bring the heart of Italy to every dish.',
      cuisineType: 'Italian',
      categories: ['Italian', 'Pizza', 'Gourmet', 'Pasta'],
      rating: 4.8,
      reviewCount: 2400,
      priceLevel: '$$',
      deliveryTimeMin: 25,
      deliveryTimeMax: 35,
      deliveryFee: 0,
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDwau_WuzYEzprqxI0PBkoKqzsOS_ga-7-UMLBD89TAEPqNXE81bRHjHLn5zDS5qtPXcfUCDf25xsfKTpSPjtlvxk34YnyhINp_ehqs6TQ7JubTmnAQoJg07vtpR3vmVFILgLaZelVlTWNLYSqzMEkwKdLGvU9KKm0skuj2GKswRQwEIx7Ge2FZ1xIq70UDHWokdEgKnHL6u1HywfWqrYcFH-luEjnhINePD2zmCVXoPdIqR4nOGV6FKweppj4SRjVPnwX0_9yeWFc',
      featured: true,
      isAvailable: true,
      address: '124 Via Roma, Downtown',
      phone: '+1-212-555-0100',
      reviews: {
        create: [
          { id: 'rev1', userId: 'u1', userName: 'Marco V.', rating: 5, comment: 'The truffle risotto is absolutely divine! A true taste of Rome.', createdAt: new Date('2025-12-15T18:30:00Z') },
          { id: 'rev2', userId: 'u1', userName: 'Sophie L.', rating: 4, comment: 'Beautiful ambiance and even better pasta. Will definitely order again.', createdAt: new Date('2025-11-20T19:00:00Z') },
        ],
      },
    },
  });

  await prisma.restaurant.create({
    data: {
      id: 'r2',
      name: 'The Pizza Lab',
      description: 'Artisanal pizzas crafted with a scientific approach to dough fermentation and premium toppings sourced from local farms and Italian imports.',
      cuisineType: 'Italian',
      categories: ['Italian', 'Pizza', 'Gourmet'],
      rating: 4.8,
      reviewCount: 200,
      priceLevel: '$$',
      deliveryTimeMin: 20,
      deliveryTimeMax: 30,
      deliveryFee: 2.99,
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDwau_WuzYEzprqxI0PBkoKqzsOS_ga-7-UMLBD89TAEPqNXE81bRHjHLn5zDS5qtPXcfUCDf25xsfKTpSPjtlvxk34YnyhINp_ehqs6TQ7JubTmnAQoJg07vtpR3vmVFILgLaZelVlTWNLYSqzMEkwKdLGvU9KKm0skuj2GKswRQwEIx7Ge2FZ1xIq70UDHWokdEgKnHL6u1HywfWqrYcFH-luEjnhINePD2zmCVXoPdIqR4nOGV6FKweppj4SRjVPnwX0_9yeWFc',
      featured: true,
      isAvailable: true,
      address: '456 Dough Street, Midtown',
      phone: '+1-212-555-0101',
      reviews: {
        create: [
          { id: 'rev3', userId: 'u1', userName: 'Alex P.', rating: 5, comment: 'Best pizza in town! The sourdough crust is incredible.', createdAt: new Date('2025-12-10T20:00:00Z') },
        ],
      },
    },
  });

  await prisma.restaurant.create({
    data: {
      id: 'r3',
      name: 'Burger Theory',
      description: 'Premium handcrafted burgers using dry-aged beef, artisanal buns, and house-made sauces. Every burger is a masterpiece of flavor engineering.',
      cuisineType: 'American',
      categories: ['American', 'Burgers', 'Grill', 'Fast Food'],
      rating: 4.7,
      reviewCount: 500,
      priceLevel: '$$',
      deliveryTimeMin: 15,
      deliveryTimeMax: 25,
      deliveryFee: 0,
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCqa6keXYfgTsyNr1Yu9Dcb5chbzYXzRpbF2I8lHNPqAbWf5PswsHzjtX6C29bIVWCkOEqL2_krKv74oOhvnoiG3JGgw_NUX9ka7QnUVghxJ1QTVaM8Y8c9MbKz4Pt81Z9T3j-mbfc97ZX7S2DifY2fEafqqTsv6u9zYB5hPs6DVvwLQl1_Sxp7q9S6X9SdwJIxoeLLPrIl7kLX34wbbu64wHpCXqSRGPwApIDDMygp0fQOlcLpN_nfzBuYGqkUtbttE0RW7wyyhOE',
      featured: true,
      isAvailable: true,
      address: '789 Patty Lane, West Side',
      phone: '+1-212-555-0102',
      reviews: {
        create: [
          { id: 'rev4', userId: 'u1', userName: 'Jordan T.', rating: 5, comment: 'The double smash burger is life-changing!', createdAt: new Date('2025-12-05T13:00:00Z') },
          { id: 'rev5', userId: 'u1', userName: 'Casey R.', rating: 4, comment: 'Great burgers, love the truffle fries.', createdAt: new Date('2025-11-28T18:45:00Z') },
        ],
      },
    },
  });

  await prisma.restaurant.create({
    data: {
      id: 'r4',
      name: 'Sashimi Spirit',
      description: 'Premium Japanese cuisine featuring the freshest sushi-grade fish flown in daily from Tsukiji Market. Our master chefs combine tradition with innovation.',
      cuisineType: 'Japanese',
      categories: ['Japanese', 'Sushi', 'Healthy', 'Seafood'],
      rating: 4.9,
      reviewCount: 150,
      priceLevel: '$$$',
      deliveryTimeMin: 30,
      deliveryTimeMax: 45,
      deliveryFee: 4.99,
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCKb3YMbOBpnjEnGMVyH82jpsl1V4kDl6PkoE_Kl0Ne5aMHxBwTMCuHsP_x6FL6F0-lDVLXs0L7iHTgpXUJbfZGOLVS_sp8924t_dfIQ3h5LCvcaKd20Y0g6sajLA4u3PasLFs3TQj3QfuBz1VrTqCY-vSVBUQigT3KxH538kItYFMxIq1cHrgKm0qL1dCimhE2dmtzrCg_xUDM6WfWhfNxDx7801pZ0qdXfm1YlSH0jIrZigGuvQKTRy4zDTlk3zzINXaLP0mFuo4',
      featured: true,
      isAvailable: true,
      address: '321 Ocean Drive, East Side',
      phone: '+1-212-555-0103',
      reviews: {
        create: [
          { id: 'rev6', userId: 'u1', userName: 'Mia K.', rating: 5, comment: 'The freshest sashimi I have had outside of Japan!', createdAt: new Date('2025-12-18T20:30:00Z') },
        ],
      },
    },
  });

  await prisma.restaurant.create({
    data: {
      id: 'r5',
      name: 'Taco Heaven',
      description: 'Vibrant Mexican street food with bold flavors. From al pastor to carnitas, every taco is made with authentic recipes and the freshest ingredients.',
      cuisineType: 'Mexican',
      categories: ['Mexican', 'Street Food', 'Spicy', 'Tacos'],
      rating: 4.6,
      reviewCount: 300,
      priceLevel: '$',
      deliveryTimeMin: 10,
      deliveryTimeMax: 20,
      deliveryFee: 1.99,
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAdaedvirvgRlnghe-sJyiNpPDh1fS7NjFndyN1Jpcan8dLmSMTTORb_l7dPbxVNL_37qhuA1B9jSbKc9BBcjW0LeSrYrWAc9M0EJuvpuJz922CyQfVE12apB1i75zP7sBGRL-2ijI_5eTU95OGhlfUQmqwveynSTSHOxHX-0Bo_mzMIRrmAxgMWbsNvV972ZNsW5Cb5beIx-xOeyYB5xR39AO2IJhp8hgdh1WkRPhznUL5bLVk09C_WvRgRfmNDk0vCLV_x3boUBE',
      featured: true,
      isAvailable: true,
      address: '555 Salsa Boulevard, South Side',
      phone: '+1-212-555-0104',
      reviews: {
        create: [
          { id: 'rev7', userId: 'u1', userName: 'Carlos M.', rating: 5, comment: 'Best al pastor tacos in the city!', createdAt: new Date('2025-12-12T14:15:00Z') },
          { id: 'rev8', userId: 'u1', userName: 'Emma W.', rating: 4, comment: 'Love the spicy salsa verde!', createdAt: new Date('2025-11-30T19:30:00Z') },
        ],
      },
    },
  });

  await prisma.restaurant.create({
    data: {
      id: 'r6',
      name: 'Le Gourmet Bistrot',
      description: 'An intimate French bistro experience featuring classic Parisian dishes with a modern twist. Every plate is a work of art.',
      cuisineType: 'French',
      categories: ['French', 'Bistro', 'Premium', 'Fine Dining'],
      rating: 4.8,
      reviewCount: 180,
      priceLevel: '$$$',
      deliveryTimeMin: 25,
      deliveryTimeMax: 35,
      deliveryFee: 3.99,
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDtq5vJZ0rh9TvVdaSHQLwjyAZnKSHlw4CRFSwjRkPG-9dKCg8znbYS-3JcEAwhsfVvh7UKro2uf773i-wyOz5Qo_Q-6Sjk3GTLwILM5G5-jgLzQix7wxbqVOIXQPIrWr0gUYml2MitwM_g2_aoEpLl_g86wNdkxYswaozZZJeJAuV-3M8C15ajcJUCP5mGjxU588GL0SIRJG3ZO10DV1JI5nzOhcmZhWiYgIa-QwKa8aSfnz8lul4Cw9MwL0WHSU8oYwQBNnVN54U',
      featured: false,
      isAvailable: true,
      address: '888 Rue de la Cuisine, Downtown',
      phone: '+1-212-555-0105',
      reviews: {
        create: [
          { id: 'rev9', userId: 'u1', userName: 'Pierre D.', rating: 5, comment: 'Exquisite French cuisine. The coq au vin is remarkable.', createdAt: new Date('2025-12-01T21:00:00Z') },
        ],
      },
    },
  });

  console.log('Restaurant seed completed');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
