import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const categories = [
  // 🍔 Food & Dining
  { label: "Groceries", emoji: "🛒" },
  { label: "Restaurants", emoji: "🍽️" },
  { label: "Coffee & Snacks", emoji: "☕" },
  { label: "Fast Food", emoji: "🍔" },
  { label: "Alcohol", emoji: "🍷" },
  { label: "Food Delivery", emoji: "🚴‍♂️" },

  // 🚗 Transportation
  { label: "Fuel / Gas", emoji: "⛽" },
  { label: "Public Transport", emoji: "🚌" },
  { label: "Taxi & Rideshare", emoji: "🚕" },
  { label: "Car Maintenance", emoji: "🛠️" },
  { label: "Parking", emoji: "🅿️" },
  { label: "Vehicle Insurance", emoji: "📄" },

  // 🏡 Housing & Utilities
  { label: "Rent", emoji: "🏠" },
  { label: "Mortgage", emoji: "🏦" },
  { label: "Electricity", emoji: "💡" },
  { label: "Water Bill", emoji: "🚰" },
  { label: "Gas Bill", emoji: "🔥" },
  { label: "Internet", emoji: "🌐" },
  { label: "Phone Bill", emoji: "📱" },
  { label: "Home Maintenance", emoji: "🛠️" },

  // 🛍️ Shopping
  { label: "Clothing", emoji: "👕" },
  { label: "Electronics", emoji: "💻" },
  { label: "Personal Care", emoji: "🧴" },
  { label: "Furniture", emoji: "🪑" },
  { label: "Beauty & Cosmetics", emoji: "💄" },

  // 🎉 Entertainment & Leisure
  { label: "Movies & Shows", emoji: "🎬" },
  { label: "Streaming Services", emoji: "📺" },
  { label: "Gaming", emoji: "🎮" },
  { label: "Books & Magazines", emoji: "📚" },
  { label: "Events & Concerts", emoji: "🎟️" },
  { label: "Vacation & Travel", emoji: "✈️" },
  { label: "Hobbies", emoji: "🎨" },

  // 🏥 Health & Fitness
  { label: "Gym Membership", emoji: "🏋️" },
  { label: "Sports & Activities", emoji: "⚽" },
  { label: "Doctor Visits", emoji: "👨‍⚕️" },
  { label: "Medications", emoji: "💊" },
  { label: "Health Insurance", emoji: "🏥" },
  { label: "Therapy", emoji: "🧠" },

  // 💼 Work & Education
  { label: "Office Supplies", emoji: "📎" },
  { label: "Courses & Education", emoji: "🎓" },
  { label: "Professional Subscriptions", emoji: "📰" },

  // 🐶 Pets
  { label: "Pet Food", emoji: "🐾" },
  { label: "Pet Care & Grooming", emoji: "✂️" },
  { label: "Vet Visits", emoji: "🩺" },

  // 💳 Financial Expenses
  { label: "Loan Payments", emoji: "💳" },
  { label: "Credit Card Payments", emoji: "💰" },
  { label: "Bank Fees", emoji: "🏦" },
  { label: "Investments", emoji: "📈" },
  { label: "Savings", emoji: "💵" },

  // 🎁 Gifts & Donations
  { label: "Gifts", emoji: "🎁" },
  { label: "Charity & Donations", emoji: "🤝" },

  // 📦 Miscellaneous
  { label: "Subscriptions", emoji: "🔔" },
  { label: "Other Insurance", emoji: "📝" },
  { label: "Other", emoji: "📦" },
];

async function main() {
  await prisma.category.createMany({
    data: categories,
    skipDuplicates: true, // prevents errors if you run the seed multiple times
  });

  console.log("✅ All categories seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
