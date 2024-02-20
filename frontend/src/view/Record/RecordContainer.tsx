import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenu,
} from "@/components/ui/dropdown-menu";
import { CardHeader, CardContent, Card } from "@/components/ui/card";
import Record from "./Record";
import History from "./History";
import HistoryMobile from "./HistoryMobile";

export default function RecordPage() {
  return (
    <div className="flex flex-col h-screen">
      {/**  
      <header className="flex h-14 py-8 items-center gap-4 border-b bg-gray-100/40 px-6 dark:bg-gray-800/40">
        <Link className="lg:hidden" href="#">
          3<span className="sr-only">Home</span>
                </Link>
        <div className="w-full flex-1">
          <form>
            <div className="relative">
              3333
              <Input
                className="w-full bg-white shadow-none appearance-none pl-8 md:w-2/3 lg:w-1/3 dark:bg-gray-950"
                placeholder="Search recordings..."
                type="search"
              />
            </div>
          </form>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              className="rounded-full border border-gray-200 w-8 h-8 dark:border-gray-800"
              size="icon"
              variant="ghost"
            >
              <img
                alt="Avatar"
                className="rounded-full"
                height="32"
                src="/placeholder.svg"
                style={{
                  aspectRatio: "32/32",
                  objectFit: "cover",
                }}
                width="32"
              />
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Support</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>
*/}

      <main className="flex flex-1 flex-col md:flex-row gap-4 p-4 md:gap-8 md:py-6 md:px-40 ">
        <div className="w-1/3 flex flex-col items-center justify-center bg-gray-200">
          <img
            alt="Placeholder for video"
            className="w-full h-1/3 object-cover"
            height="200"
            src="/placeholder.svg"
            style={{
              aspectRatio: "500/500",
              objectFit: "cover",
            }}
            width="200"
          />
          <div className="flex gap-4 mt-4">
            <Button>1</Button>
            <Button>2</Button>
            <Button>3</Button>
          </div>
        </div>
        <div className="w-2/3 flex flex-col gap-4">
          <div className="flex items-center">
            <h1 className="font-semibold text-lg md:text-2xl">Recordings</h1>
            <Button className="ml-auto" size="sm">
              New Recording
            </Button>
          </div>
          <Card className="border shadow-sm rounded-lg">
            <CardHeader>
              <h2 className="font-semibold text-lg md:text-2xl">Waveform</h2>
            </CardHeader>
            <CardContent>
              <Record />
            </CardContent>
          </Card>
          <Card className="border shadow-sm rounded-lg mt-4">
            <CardHeader>
              <h2 className="font-semibold text-lg md:text-2xl">
                Recording Meta Data
              </h2>
            </CardHeader>
            <CardContent>
              <form className="flex flex-col gap-4">
                <Input
                  className="w-full"
                  placeholder="Enter topic"
                  type="text"
                />
                <Input
                  className="w-full"
                  placeholder="Enter description"
                  type="text"
                />
                <Button className="self-end" type="submit">
                  Save
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>

      <section className="flex flex-col gap-4 p-4 md:gap-8 md:py-6 md:px-40">
        <div className="mt-8">
          <History />
          <HistoryMobile />
        </div>
      </section>
    </div>
  );
}
