import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const categories = [
  { label: 'Paid For Others', emoji: '💸' },
  { label: 'Borrow Money', emoji: '💰' },
  { label: 'Fast Food', emoji: '🍔' },
  { label: 'Groceries', emoji: '🛒' },
  { label: 'Shopping', emoji: '🛍️' },
  { label: 'Gym', emoji: '🏋️' },
  { label: 'Travel', emoji: '🚌' },
  { label: 'Rent', emoji: '🏠' },
  { label: 'Utilities', emoji: '⚡' },
  { label: 'Health', emoji: '💊' },
  { label: 'Entertainment', emoji: '🎬' },
  { label: 'Bills', emoji: '📄' },
  { label: 'Gifts', emoji: '🎁' },
  { label: 'Salary', emoji: '💼' },
  { label: 'Investments', emoji: '📈' },
];

async function main() {
  await prisma.category.createMany({
    data: categories,
    skipDuplicates: true, // prevents errors if you run the seed multiple times
  });

  console.log('✅ All categories seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
