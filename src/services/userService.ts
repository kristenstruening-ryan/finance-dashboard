import { prisma } from "../lib/prisma";
import bcrypt from "bcrypt";

// export const createUser = async (
//   email: string,
//   password: string,
//   name?: string,
// ) => {
//   const hashedPassword = await bcrypt.hash(password, 10);

//   return prisma.user.create({
//     data: {
//       email,
//       password: hashedPassword,
//       name,
//     },
//   });
// };

// export const findUserByEmail = async (email: string) => {
//   return prisma.user.findUnique({
//     where: { email },
//   });
// };
