"use client";
import useRecordListsQuery from "@/api/record/useRecordLists";
import WarningDialog from "@/components/common/warn-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { HoverCardTrigger } from "@/components/ui/hover-card";
import { deleteaRecordById } from "@/db/record";
import useToggleSidebar from "@/hooks/useToggleSidebar";
import { cn } from "@/lib/utils";
import { DropdownMenuGroup } from "@radix-ui/react-dropdown-menu";
import { HoverCard, HoverCardContent } from "@radix-ui/react-hover-card";
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  EllipsisVertical,
  Headphones,
  MenuIcon,
  Plus,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useRef, useState } from "react";
import toast from "react-hot-toast";

type SideNavProps = {
  userId: string;
};

const SideNav = ({ userId }: SideNavProps) => {
  // NOTE: use useSyncExternalStore to store in localstorage
  const [open, setOpen] = useToggleSidebar("SidebarToggle");
  const [warning, setWarning] = useState(false);
  const { data: recordLists } = useRecordListsQuery(userId);
  const queryClient = useQueryClient();
  const router = useRouter();
  const params = useParams<{ itemId: string }>();
  const onDeleteValue = useRef<string | null>(null);

  async function onConfirmDeleteRecord(_: boolean) {
    if (!onDeleteValue.current) return;
    try {
      await deleteaRecordById(onDeleteValue.current);
      toast.success("Ok");
      onDeleteValue.current = null;
      queryClient.invalidateQueries({ queryKey: [userId, "records"] });
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div
      className="hidden flex-[0_0_auto] flex-col bg-card transition-all duration-300 ease-in-out data-[expand=false]:w-sidebar-close data-[expand=true]:w-sidebar-open md:flex"
      data-expand={open}
    >
      <Button
        variant={"ghost"}
        onClick={() => setOpen(!open)}
        size="sm"
        className="mx-6 my-4 w-fit rounded-lg px-2"
      >
        <MenuIcon className="h-5 w-5" />
      </Button>

      <Button
        variant={"ghost"}
        onClick={() => router.push("/records")}
        size="sm"
        className="mx-6 mb-4 w-fit rounded-full px-2"
      >
        <Plus className="h-5 w-5" />
        <span
          className="transition-opacity duration-300 ease-in data-[expand=true]:visible data-[expand=false]:invisible data-[expand=true]:ml-2 data-[expand=false]:w-0 data-[expand=true]:px-2 data-[expand=false]:opacity-0 data-[expand=true]:opacity-100"
          data-expand={open}
        >
          New Record
        </span>
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
          const formatDate = format(new Date(i.createdAt), "yyyy-MM-dd hh:mm");
          return (
            <li
              key={i.recordId}
              tabIndex={0}
              className={cn(
                "group/item flex w-full rounded-full px-4 py-1.5 font-normal text-secondary-foreground transition-colors duration-300 ease-in-out hover:bg-primary/10 [&:has([data-state=open])]:bg-primary/10",
                i.recordId === params.itemId ? "bg-accent" : "",
              )}
            >
              <HoverCard openDelay={500}>
                <HoverCardTrigger asChild>
                  <div className="flex w-full items-center truncate">
                    <Headphones className="h-4 w-4" />
                    <Link
                      href={`/records/${i.recordId}`}
                      className={"mx-4 w-full flex-1 truncate py-1 text-xs"}
                    >
                      {i.title}
                    </Link>
                  </div>
                </HoverCardTrigger>
                <HoverCardContent
                  side="right"
                  hideWhenDetached={true}
                  className="z-5 mx-4 w-60 bg-secondary py-2 shadow-xl shadow-card"
                >
                  <div className="flex items-center justify-center space-x-4">
                    {i.thumbnailUrl && (
                      <img
                        src={i.thumbnailUrl}
                        alt={i.title}
                        className="h-20 w-20 rounded-xl object-scale-down py-2"
                      />
                    )}
                    <div className="flex shrink-0 flex-col items-center text-xs font-semibold">
                      <p>{formatDate.split(" ")[0]}</p>
                      <p>{formatDate.split(" ")[1]}</p>
                    </div>
                  </div>
                </HoverCardContent>
              </HoverCard>

              <DropdownMenu>
                <DropdownMenuTrigger className="group-edit invisible flex items-center rounded-full bg-transparent hover:bg-primary/20 active:visible group-hover/item:visible group-focus:visible data-[state=open]:visible data-[state=open]:bg-primary/20">
                  <EllipsisVertical className="h-6 w-6 rounded-full p-1" />
                </DropdownMenuTrigger>
                <DropdownMenuContent side="right">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuGroup>
                    <DropdownMenuItem>
                      <div
                        className="flex cursor-pointer items-center text-red-500"
                        onClick={() => {
                          onDeleteValue.current = i.recordId;
                          setWarning(true);
                        }}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </li>
          );
        })}
      </ul>

      <WarningDialog
        show={warning}
        handleClose={setWarning}
        label={"Delete"}
        title="Warning: Delete Data"
        description="You are deleting this record. Do you want to continue delete or return the change?"
        onConfirm={onConfirmDeleteRecord}
      />
    </div>
  );
};

export default SideNav;
