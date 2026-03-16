import "dotenv/config";
import { Pool } from "pg";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const password = "password123";
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  console.log("🌱 Starting central seed...");

  const guestUser = await prisma.user.upsert({
    where: { email: "guest@example.com" },
    update: { password: hashedPassword },
    create: {
      email: "guest@example.com",
      name: "Guest User",
      password: hashedPassword,
    },
  });

  console.log(`✅ Guest User ready (ID: ${guestUser.id})`);

  // --- SEED ASSETS ---
  const assetsToSeed = [
    { name: "Bitcoin", symbol: "BTC", amount: 0.5, category: "Crypto", purchasePrice: 45000.0 },
    { name: "Apple", symbol: "AAPL", amount: 10, category: "Stock", purchasePrice: 195.0 },
  ];

  for (const assetData of assetsToSeed) {
    const asset = await prisma.asset.upsert({
      where: { userId_symbol: { userId: guestUser.id, symbol: assetData.symbol } },
      update: { amount: assetData.amount },
      create: {
        userId: guestUser.id,
        ...assetData,
      },
    });

    // --- SEED INITIAL TRANSACTIONS ---
    // This ensures your Trade History UI isn't empty!
    await prisma.transaction.create({
      data: {
        assetId: asset.id,
        type: "BUY",
        amount: assetData.amount * assetData.purchasePrice,
        shares: assetData.amount,
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      },
    });
    console.log(`📦 Seeded ${assetData.symbol} with initial transaction.`);
  }

  // --- SEED PORTFOLIO HISTORY ---
  const daysToSeed = 30;
  const initialValue = 25000;
  console.log(`📈 Generating ${daysToSeed} days of history...`);

  for (let i = daysToSeed; i >= 0; i--) {
    const date = new Date();
    date.setUTCHours(0, 0, 0, 0);
    date.setUTCDate(date.getUTCDate() - i);

    const dailyValue = initialValue * (1 + (Math.random() * 0.1 - 0.05));

    await prisma.portfolioHistory.upsert({
      where: {
        userId_date: {
          userId: guestUser.id,
          date,
        },
      },
      update: { totalValue: dailyValue },
      create: {
        userId: guestUser.id,
        date,
        totalValue: dailyValue,
      },
    });
  }

  console.log("✅ All seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end(); // Clean up the pool connection too
  });