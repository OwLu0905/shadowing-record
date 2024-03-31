"use client";
import useRecordListsQuery from "@/api/record/useRecordLists";
import { Button } from "@/components/ui/button";
import useToggleSidebar from "@/hooks/useToggleSidebar";
import { MenuIcon, Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type SideNavProps = {
  userId: string;
};

const SideNav = ({ userId }: SideNavProps) => {
  // NOTE: use useSyncExternalStore to store in localstorage
  const [open, setOpen] = useToggleSidebar("SidebarToggle");
  const { data: recordLists, isLoading } = useRecordListsQuery(userId);

  const router = useRouter();

  return (
    <div
      className="hidden flex-[0_0_auto] flex-col bg-gradient-to-b from-secondary via-secondary/60 to-secondary  transition-all duration-300 ease-in-out data-[expand=false]:w-sidebar-close data-[expand=true]:w-sidebar-open md:flex"
      data-expand={open}
    >
      <Button
        variant={"ghost"}
        onClick={() => setOpen(!open)}
        size="sm"
        className="mx-3 my-4 w-fit px-2"
      >
        <MenuIcon className="h-5 w-5" />
      </Button>

      <Button
        variant={"default"}
        onClick={() => router.push("/records")}
        size="sm"
        className="mx-3 mb-4 w-fit px-2"
      >
        <Plus className="h-5 w-5" />
      </Button>
      <ul
        className="mx-6 flex flex-col items-start gap-y-2 transition-opacity duration-300 ease-in data-[expand=true]:visible data-[expand=false]:invisible data-[expand=false]:opacity-0 data-[expand=true]:opacity-100"
        data-expand={open}
      >
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
    </div>
  );
};

export default SideNav;
