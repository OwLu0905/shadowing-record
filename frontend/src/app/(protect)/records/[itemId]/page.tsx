import React, { Suspense } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

import { recordUuidSchema } from "@/schema/item-params";
import { getRecordById } from "@/db/record";

import RecordContainer from "@/view/record/record-container";
import History from "@/view/record/History";

const RecordItemPage = async ({ params }: { params: { itemId: string } }) => {
  const user = await auth();

  if (!user) redirect("/login");

  const itemId = params.itemId;
  const validId = recordUuidSchema.safeParse(itemId);

  if (!validId.success) {
    return <section className="container mx-20">Page Not Found!! :(</section>;
  }
  const recordUuid = validId.data;

  const data = await getRecordById(recordUuid);

  // NOTE: select the data from db
  //
  if (!data) return <></>;

  return (
    <>
      <RecordContainer recordInfo={data} />
      <section className="container mx-auto flex flex-col">
        <Suspense fallback={<>loading...</>}>
          <History recordId={data[0].recordId} />
        </Suspense>
      </section>
    </>
  );
};

export default RecordItemPage;
