import { PrismaClient, Asset } from "@prisma/client";
import { prisma } from "../lib/prisma";

interface Trade {
  id: number;
  action: "BUY" | "SELL";
  shares: number;
  amount: number;
}

export const executeRebalance = async (trades: Trade[]) => {
  // Use a database transaction to ensure all updates happen together
  return await prisma.$transaction(async (tx) => {
    const updatedAssets: Asset[] = [];
    for (const trade of trades) {
      // Update the Asset quantity
      const updatedAsset = await tx.asset.update({
        where: { id: trade.id },
        data: {
          amount: {
            [trade.action === "BUY" ? "increment" : "decrement"]: trade.shares,
          },
        },
      });

      //Log the individual trade in the Transaction table
      await tx.transaction.create({
        data: {
          assetId: trade.id,
          type: trade.action,
          amount: trade.amount,
          shares: trade.shares,
        },
      });

      updatedAssets.push(updatedAsset);
    }
    return updatedAssets;
  });
};

export const getRecentTransactions = async (userId: number) => {
  return await prisma.transaction.findMany({
    where: {
      asset: {
        userId: userId, // Filter transactions belonging to this user's assets
      },
    },
    include: {
      asset: {
        select: {
          symbol: true,
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc", // Newest trades first
    },
    take: 10, // Only show the last 10 for the dashboard
  });
};

export const clearUserTransactions = async (userId: number) => {
  return await prisma.transaction.deleteMany({
    where: {
      asset: {
        userId: userId,
      },
    },
  });
};
