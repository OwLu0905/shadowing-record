import React from "react";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

import { recordUuidSchema } from "@/schema/item-params";
import RecordContainer from "@/view/record/record-container";

const RecordItemPage = async ({ params }: { params: { itemId: string } }) => {
  const user = await auth();

  if (!user) redirect("/login");

  const itemId = params.itemId;
  const validId = recordUuidSchema.safeParse(itemId);
  if (!validId.success) {
    return <section className="container mx-20">Page Not Found!! :(</section>;
  }
  const recordUuid = validId.data;

  // NOTE: select the data from db

  return <RecordContainer />;
};

export default RecordItemPage;
