import * as z from "zod";
import { db } from "@/db/drizzle";
import { records } from "@/db/schema/records";

import { eq } from "drizzle-orm";
import { recordUuidSchema } from "@/schema/item-params";
import { NewRecordSchema } from "@/schema/records";
import { ShadowingTypeMap } from "@/type/kinds";

// NOTE: Crate
export const createRecord = async (data: z.infer<typeof NewRecordSchema>) => {
  const type = ShadowingTypeMap[data.shadowingType];

  const params: z.infer<typeof NewRecordSchema> = {
    ...data,
    shadowingType: type,
  };
};

export const getRecordById = async (id: string) => {
  try {
    const recordUuidValid = recordUuidSchema.safeParse(id);
    if (!recordUuidValid.success) return null;

    const record = await db
      .select()
      .from(records)
      .where(eq(records.recordId, id));

    return record;
  } catch (err) {
    console.log("cant get the uer", { err });

    return null;
  }
};

// export const getUserByEmail = async (email: string) => {
//   try {
//     const user = await db.select().from(users).where(eq(users.email, email));
//
//     return user;
//   } catch (err) {
//     console.log("cant get the uer", { err });
//
//     return null;
//   }
// };
