import { db } from "@/lib/db";
import { users } from "./schema";
import { eq } from "drizzle-orm";

export const getUserById = async (id: string) => {
  try {
    const user = await db.select().from(users).where(eq(users.id, id));

    return user;
  } catch (err) {
    console.log("cant get the uer", { err });

    return null;
  }
};

export const getUserByEmail = async (email: string) => {
  try {
    const user = await db.select().from(users).where(eq(users.email, email));

    return user;
  } catch (err) {
    console.log("cant get the uer", { err });

    return null;
  }
};
