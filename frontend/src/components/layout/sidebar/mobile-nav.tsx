"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRecordListsQuery } from "@/api/record/useRecordLists";
import { DrawerClose } from "@/components/ui/drawer";
import { CheckIcon, Headphones, Plus } from "lucide-react";

import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";

type MobileNavProps = {
  userId: string;
};

const MobileNav = (props: MobileNavProps) => {
  const { userId } = props;
  const { data: recordLists } = useRecordListsQuery(userId);
  const router = useRouter();
  return (
    <aside className="sticky top-0 mt-4 h-[100dvh]">
      <DrawerClose
        onClick={() => {
          router.push("/records");
        }}
        className="mx-auto my-4 flex w-1/2 flex-col items-center rounded-full bg-primary/20 py-1 active:bg-primary/60"
      >
        <Plus className="h-5 w-5" />
      </DrawerClose>

      <ScrollArea className="mx-4 flex h-[100dvh] flex-grow flex-col items-start overflow-hidden pb-40 transition-opacity duration-300 ease-in data-[expand=true]:visible data-[expand=false]:invisible data-[expand=false]:opacity-0 data-[expand=true]:opacity-100 [&>div>div]:!block [&>div>div]:pr-4">
        {recordLists?.map((monthData) => {
          return (
            <div key={monthData.month}>
              <div className="mb-2 mt-4 flex w-full items-center justify-between px-4 py-1 text-sm font-semibold text-muted-foreground shadow-card">
                <span>{monthData.month}</span>
                <div className="flex items-center gap-x-2">
                  <CheckIcon className="h-4 w-4 text-emerald-500" />
                  <div className="font-light">{monthData.data.length}</div>
                </div>
              </div>
              {monthData?.data?.map((i) => {
                const formatDate = format(
                  new Date(i.createdAt),
                  "yyyy-MM-dd hh:mm",
                );
                return (
                  <div
                    key={i.recordId}
                    className={cn(
                      "group/item flex w-full rounded-full px-4 py-1.5 font-normal text-secondary-foreground transition-colors duration-300 ease-in-out hover:bg-primary/10 ",
                    )}
                  >
                    <Link
                      href={`/records/${i.recordId}`}
                      className={"w-full flex-1 py-1 text-xs"}
                    >
                      <DrawerClose
                        asChild
                        className="flex w-full items-center truncate"
                      >
                        <div>
                          <Headphones className="h-4 w-4" />
                          <div className="mx-4 w-full max-w-[12rem]  flex-1 flex-grow space-y-2 truncate py-1 text-xs sm:max-w-[16rem]">
                            <p className="truncate">{i.title}</p>
                            <p className="text-foreground">{formatDate}</p>
                          </div>
                        </div>
                      </DrawerClose>
                    </Link>
                  </div>
                );
              })}
            </div>
          );
        })}
      </ScrollArea>
    </aside>
  );
};

export default MobileNav;
