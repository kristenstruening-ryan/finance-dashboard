import { prisma } from "../lib/prisma";
import { AssetUpdateInput } from "../schemas/assetSchema";

/**
 * Creates a single asset record.
 */
export const createAsset = async (userId: number, data: AssetUpdateInput) => {
  return prisma.asset.create({
    data: {
      ...data,
      userId,
    },
  });
};

/**
 * Retrieves all assets belonging to a specific user.
 */
export const getUserAssets = async (userId: number) => {
  return prisma.asset.findMany({
    where: { userId },
  });
};

/**
 * Deletes an asset, ensuring the userId matches for security.
 */
export const deleteAsset = async (assetId: number, userId: number) => {
  return prisma.asset.deleteMany({
    where: {
      id: assetId,
      userId: userId,
    },
  });
};

/**
 * Handles adding assets. If the asset exists, it calculates the
 * weighted average purchase price and increments the amount (upsert).
 */
export const upsertAsset = async (
  userId: number,
  assetData: AssetUpdateInput,
) => {
  let asset = await prisma.asset.findUnique({
    where: { userId_symbol: { userId, symbol: assetData.symbol } },
  });

  if (asset) {
    const currentTotalCost = asset.amount * asset.purchasePrice;
    const newAdditionCost = assetData.amount * assetData.purchasePrice;
    const totalAmount = asset.amount + assetData.amount;
    const newAveragePrice = (currentTotalCost + newAdditionCost) / totalAmount;

    asset = await prisma.asset.update({
      where: { id: asset.id },
      data: { amount: totalAmount, purchasePrice: newAveragePrice },
    });
  } else {
    asset = await prisma.asset.create({
      data: { ...assetData, userId },
    });
  }

  await prisma.transaction.create({
    data: {
      assetId: asset.id,
      type: "BUY",
      amount: assetData.amount * assetData.purchasePrice,
      shares: assetData.amount,
    },
  });

  return asset;
};

export const getRecentTransactions = async (userId: number) => {
  return prisma.transaction.findMany({
    where: { asset: { userId } },
    include: { asset: true },
    orderBy: { createdAt: "desc" },
    take: 10,
  });
};
/**
 * Updates the last known market price of an asset.
 */
export const updateAssetPrice = async (assetId: number, price: number) => {
  return prisma.asset.update({
    where: { id: assetId },
    data: { lastPrice: price },
  });
};

/**
 * Finds a specific asset by ID, scoped to a user.
 */
export const getAssetById = async (assetId: number, userId: number) => {
  return prisma.asset.findFirst({
    where: {
      id: assetId,
      userId: userId,
    },
  });
};

/**
 * Simple quantity update for manual adjustments.
 */
export const updateAssetQuantity = async (
  assetId: number,
  userId: number,
  newAmount: number,
) => {
  return prisma.asset.update({
    where: {
      id: assetId,
      userId: userId,
    },
    data: { amount: newAmount },
  });
};

/**
 * Fetches the last 30 days of portfolio snapshots.
 */
export const getPortfolioHistory = async (userId: number) => {
  return prisma.portfolioHistory.findMany({
    where: { userId },
    orderBy: { date: "asc" },
    take: 30,
  });
};
