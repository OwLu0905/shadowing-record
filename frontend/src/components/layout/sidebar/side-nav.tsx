"use client";
import { Button } from "@/components/ui/button";
import useToggleSidebar from "@/hooks/useToggleSidebar";
import { MenuIcon, Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { v4 as uuid } from "uuid";

const SideNav = () => {
  // NOTE: use useSyncExternalStore to store in localstorage
  const [open, setOpen] = useToggleSidebar("SidebarToggle");
  const [isMount, setMount] = useState(false);

  const router = useRouter();

  useEffect(() => {
    setMount(true);
  }, []);

  if (!isMount) return <></>;

  return (
    <div
      className="hidden flex-[0_0_auto] flex-col bg-gradient-to-b from-secondary via-secondary/60 to-secondary  transition-all duration-300 ease-in-out data-[expand=false]:w-[60px] data-[expand=true]:w-60 md:flex"
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
        <li className="w-full truncate">
          <Button variant={"link"} asChild>
            <Link href={`/records/${uuid()}`}>
              dolore doloribus ducimus minus laudantium impedit quam omnis a
              eius dicta, nesciunt repudiandae necessitatibus quos autem illum
              nam?
            </Link>
          </Button>
        </li>

        <li className="w-full truncate">
          <Button variant={"link"} asChild>
            <Link href={`/records/${uuid()}`}>
              eius dicta, nesciunt repudiandae necessitatibus quos autem illum
            </Link>
          </Button>
        </li>

        <li className="w-full truncate">
          <Button variant={"link"} asChild>
            <Link href={`/records/${uuid()}`}>
              eius dicta, nesciunt repudiandae necessitatibus quos autem illum
            </Link>
          </Button>
        </li>
      </ul>
    </div>
  );
};

export default SideNav;
