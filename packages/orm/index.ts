import { PrismaClient } from "./generated";
export * from "type-graphql";

const prisma = new PrismaClient();

export default prisma;
