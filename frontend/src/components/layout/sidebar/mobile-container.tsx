import React, { Suspense } from "react";
import SideNav from "./side-nav";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { auth } from "@/lib/auth";
import { getRecordByUserId } from "@/db/record";
import MobileNav from "./mobile-nav";

const MobileNavContainer = async () => {
  const queryClient = new QueryClient();
  const session = await auth();

  if (session?.user?.id) {
    queryClient.prefetchQuery({
      queryFn: () => getRecordByUserId(session!.user!.id!),
      queryKey: ["records"],
    });
  }

  if (!session?.user?.id) return <></>;

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <MobileNav userId={session.user.id} />
    </HydrationBoundary>
  );
};

export default MobileNavContainer;
