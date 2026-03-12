import { prisma } from "../lib/prisma";

export const createAsset = async (
  userId: number,
  data: {
    name: string;
    symbol: string;
    amount: number;
    category: string;
  },
) => {
  return prisma.asset.create({
    data: {
      ...data,
      userId,
    },
  });
};

export const getUserAssets = async (userId: number) => {
  return prisma.asset.findMany({
    where: { userId },
  });
};

export const deleteAsset = async (assetId: number, userId: number) => {
  return prisma.asset.deleteMany({
    where: {
      id: assetId,
    },
  });
};

//this is a mock list TODO: hook up db query or api call
const MOCK_ASSETS = [
  { id: 1, name: "Bitcoin", symbol: "BTC", category: "Crypto" },
  { id: 2, name: "Ethereum", symbol: "ETH", category: "Crypto" },
  { id: 3, name: "Apple", symbol: "AAPL", category: "Stock" },
];

export const searchGlobalAssets = async (query: string) => {
  return MOCK_ASSETS.filter(
    (a) =>
      a.name.toLowerCase().includes(query.toLowerCase()) ||
      a.symbol.toLowerCase().includes(query.toLowerCase()),
  );
};

export const upsertAsset = async (userId: number, assetData: any) => {
  return prisma.asset.upsert({
    where: {
      userId_symbol: {
        userId: userId,
        symbol: assetData.symbol,
      },
    },
    update: {
      amount: { increment: assetData.amount },
    },
    create: {
      ...assetData,
      userId: userId,
    },
  });
};

export const updateAssetPrice = async (assetId: number, price: number) => {
  return prisma.asset.update({
    where: { id: assetId },
    data: { lastPrice: price },
  });
};

export const getAssetById = async (assetId: number, userId: number) => {
  return prisma.asset.findFirst({
    where: {
      id: assetId,
      userId: userId,
    },
  });
};

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
