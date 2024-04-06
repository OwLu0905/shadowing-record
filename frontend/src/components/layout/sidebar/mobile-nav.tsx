"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRecordListsQuery } from "@/api/record/useRecordLists";
import { DrawerClose } from "@/components/ui/drawer";
import { Headphones, Plus } from "lucide-react";

import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";

type MobileNavProps = {
  userId: string;
};

const MobileNav = (props: MobileNavProps) => {
  const { userId } = props;
  const { data: recordLists, isLoading } = useRecordListsQuery(userId);
  const router = useRouter();
  return (
    <aside className="mt-4 h-full">
      <DrawerClose
        onClick={() => {
          router.push("/records");
        }}
        className="mx-auto my-4 flex w-1/2 flex-col items-center rounded-full bg-primary/20 py-1 active:bg-primary/60"
      >
        <Plus className="h-5 w-5" />
      </DrawerClose>

      <ScrollArea className="mx-4 flex h-[80dvh] flex-col items-start gap-y-2">
        {recordLists?.map((i) => {
          const formatDate = format(new Date(i.createdAt), "yyyy-MM-dd hh:mm");
          return (
            <div
              key={i.recordId}
              className={cn(
                "group/item flex w-full rounded-full px-4 py-1.5 font-normal text-secondary-foreground transition-colors duration-300 ease-in-out hover:bg-primary/10 [&:has([data-state=open])]:bg-primary/10",
              )}
            >
              <Link
                href={`/records/${i.recordId}`}
                className={"w-full flex-1 truncate py-1 text-xs"}
              >
                <DrawerClose
                  asChild
                  className="flex w-full items-center truncate"
                >
                  <div>
                    <Headphones className="h-4 w-4" />
                    <div className="mx-4 w-full flex-1 space-y-2 truncate py-1 text-xs">
                      <p className="">{i.title}</p>
                      <p className="text-foreground">{formatDate}</p>
                    </div>
                  </div>
                </DrawerClose>
              </Link>
            </div>
          );
        })}
      </ScrollArea>
    </aside>
  );
};

export default MobileNav;
