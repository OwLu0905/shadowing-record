"use client";
import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MenuIcon, Plus } from "lucide-react";

import useRecordListsQuery from "@/api/record/useRecordLists";
import { DrawerClose } from "@/components/ui/drawer";
import { useRouter } from "next/navigation";

type MobileNavProps = {
  userId: string;
};

const MobileNav = (props: MobileNavProps) => {
  const { userId } = props;
  const { data: recordLists, isLoading } = useRecordListsQuery(userId);
  const router = useRouter();
  return (
    <div>
      <Button variant={"ghost"} size="sm" className="mx-3 mb-4 w-fit px-2">
        <MenuIcon className="h-5 w-5" />
      </Button>

      <DrawerClose>
        <Button
          variant={"default"}
          onClick={() => router.push("/records")}
          size="sm"
          className="mx-3 mb-4 w-fit px-2"
        >
          <Plus className="h-5 w-5" />
        </Button>
      </DrawerClose>

      <DrawerClose>
        <Button variant="outline" size="sm" className="mx-3 mb-4 w-fit px-2">
          x
        </Button>
      </DrawerClose>

      <DrawerClose asChild>
        <ul className="mx-6 flex flex-col items-start gap-y-2 transition-opacity duration-300 ease-in data-[expand=true]:visible data-[expand=false]:invisible data-[expand=false]:opacity-0 data-[expand=true]:opacity-100">
          {recordLists?.map((i) => {
            return (
              <li key={i.recordId} className="w-full truncate">
                <Button variant={"link"} asChild>
                  <Link href={`/records/${i.recordId}`}>{i.title}</Link>
                </Button>
              </li>
            );
          })}
        </ul>
      </DrawerClose>
    </div>
  );
};

export default MobileNav;
