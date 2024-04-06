import React from "react";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

import { recordUuidSchema } from "@/schema/item-params";
import { getAudiosById, getRecordById } from "@/db/record";

import RecordContainer from "@/view/records/record-container";
import History from "@/view/records/History";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";

const RecordItemPage = async ({ params }: { params: { itemId: string } }) => {
  const user = await auth();
  const queryClient = new QueryClient();

  if (!user) redirect("/login");

  const itemId = params.itemId;
  const validId = recordUuidSchema.safeParse(itemId);

  if (!validId.success) {
    redirect("/records");
  }

  const recordUuid = validId.data;

  const data = await getRecordById(recordUuid);

  if (user?.user?.id) {
    queryClient.prefetchQuery({
      queryFn: () => getAudiosById(itemId),
      queryKey: [itemId, "history"],
    });
  }

  if (!data || data?.length === 0) {
    redirect("/records");
  }

  return (
    <>
      <RecordContainer recordInfo={data} />
      <section className="container mx-auto flex-col md:flex">
        <HydrationBoundary state={dehydrate(queryClient)}>
          <History recordId={data[0].recordId} />
        </HydrationBoundary>
      </section>
    </>
  );
};

export default RecordItemPage;
