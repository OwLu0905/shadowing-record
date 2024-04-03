"use client";
import useRecordListsQuery from "@/api/record/useRecordLists";
import { Button } from "@/components/ui/button";
import useToggleSidebar from "@/hooks/useToggleSidebar";
import { cn } from "@/lib/utils";
import { MenuIcon, Plus } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

type SideNavProps = {
  userId: string;
};

const SideNav = ({ userId }: SideNavProps) => {
  // NOTE: use useSyncExternalStore to store in localstorage
  const [open, setOpen] = useToggleSidebar("SidebarToggle");
  const { data: recordLists, isLoading } = useRecordListsQuery(userId);
  const router = useRouter();
  const params = useParams<{ itemId: string }>();

  return (
    <div
      className="hidden flex-[0_0_auto] flex-col bg-card transition-all duration-300 ease-in-out data-[expand=false]:w-sidebar-close data-[expand=true]:w-sidebar-open md:flex"
      data-expand={open}
    >
      <Button
        variant={"ghost"}
        onClick={() => setOpen(!open)}
        size="sm"
        className="mx-6 my-4 w-fit px-2"
      >
        <MenuIcon className="h-5 w-5" />
      </Button>

      <Button
        variant={"default"}
        onClick={() => router.push("/records")}
        size="sm"
        className="mx-6 mb-4 w-fit px-2"
      >
        <Plus className="h-5 w-5" />
      </Button>

      <ul
        className="mx-4 flex flex-col items-start gap-y-2 transition-opacity duration-300 ease-in data-[expand=true]:visible data-[expand=false]:invisible data-[expand=false]:opacity-0 data-[expand=true]:opacity-100"
        data-expand={open}
      >
        {/**<div className="mb-2 flex w-full justify-center gap-x-8 border-b border-primary px-4 pb-4">
          <div>Latest</div>
          <div>Date</div>
        </div>*/}
        {recordLists?.map((i) => {
          return (
            <li
              key={i.recordId}
              className={cn(
                "w-full truncate rounded-full px-4 py-1.5 font-normal text-secondary-foreground transition-colors duration-300 ease-in-out hover:bg-primary/10",
                i.recordId === params.itemId ? "text-indigo-600" : "",
              )}
            >
              <Link
                href={`/records/${i.recordId}`}
                className={"px-4 py-2 text-sm"}
              >
                {i.title}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default SideNav;
