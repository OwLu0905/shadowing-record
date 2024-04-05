import React, { Suspense } from "react";
import SideNav from "./side-nav";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { auth } from "@/lib/auth";
import { getRecordByUserId } from "@/db/record";

const SidebarContainer = async () => {
  const queryClient = new QueryClient();
  const session = await auth();

  if (session?.user?.id) {
    queryClient.prefetchQuery({
      queryFn: () => getRecordByUserId(session!.user!.id!),
      queryKey: [session.user.id, "records"],
    });
  }

  if (!session?.user?.id) return <></>;

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SideNav userId={session.user.id} />
    </HydrationBoundary>
  );
};

export default SidebarContainer;
