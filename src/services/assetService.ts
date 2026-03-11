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
      userId: userId,
    },
  });
};
