import { PrismaClient } from "@prisma/client/extension";

export class Pool {
  static conn = new PrismaClient();
}
