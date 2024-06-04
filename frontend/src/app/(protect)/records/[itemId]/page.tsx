import React from "react";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

import { recordUuidSchema } from "@/schema/item-params";
import { getAudiosById, getRecordById } from "@/db/record";

import RecordContainer from "@/view/records/record-container";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { getS3SignedItem } from "@/api/s3";
import { ShadowingType } from "@/type/kinds";

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

  let audio_url = data[0].shadowingUrl;

  if (data[0].shadowingType === ShadowingType.File) {
    audio_url = await getS3SignedItem({ audioUrl: data[0].shadowingUrl });
  }

  const newData = {
    ...data[0],
    shadowingUrl: audio_url,
  };

  return (
    <>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <RecordContainer recordInfo={newData} />
      </HydrationBoundary>
    </>
  );
};

export default RecordItemPage;
