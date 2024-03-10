import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

const GuestHeader = () => {
  return (
    <div>
      <Button asChild variant={"secondary"}>
        <Link href="/login">Login</Link>
      </Button>
    </div>
  );
};

export default GuestHeader;
