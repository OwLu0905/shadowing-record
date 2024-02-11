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
import {
  TableHead,
  TableRow,
  TableHeader,
  TableCell,
  TableBody,
  Table,
} from "@/components/ui/table";
import Record from "./Record";

export default function Component() {
  return (
    <div className="flex flex-col h-screen">
      <header className="flex h-14 py-8 items-center gap-4 border-b bg-gray-100/40 px-6 dark:bg-gray-800/40">
        <Link className="lg:hidden" href="#">
          <Package2Icon className="h-6 w-6" />
          <span className="sr-only">Home</span>
        </Link>
        <div className="w-full flex-1">
          <form>
            <div className="relative">
              <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
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
            <Button>
              <PlayIcon className="h-6 w-6" />
            </Button>
            <Button>
              <PauseIcon className="h-6 w-6" />
            </Button>
            <Button>
              <MonitorStopIcon className="h-6 w-6" />
            </Button>
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
          <h2 className="font-semibold text-lg md:text-2xl">
            Recording History
          </h2>
          <div className="hidden md:block border shadow-sm rounded-lg mt-4 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Date</TableHead>
                  <TableHead className="max-w-[150px]">Topic</TableHead>
                  <TableHead className="md:table-cell">Duration</TableHead>
                  <TableHead className="w-[50%]">Waveform</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Feb 6, 2024</TableCell>
                  <TableCell>Meeting with team</TableCell>
                  <TableCell className="md:table-cell">1h 30m</TableCell>
                  <TableCell>
                    <div className="h-6 w-full bg-gray-200" />
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button className="w-8 h-8 rounded-full">
                        <PlayIcon className="h-6 w-6" />
                      </Button>
                      <Button className="w-8 h-8 rounded-full">
                        <MonitorStopIcon className="h-6 w-6" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Feb 5, 2024</TableCell>
                  <TableCell>Project planning</TableCell>
                  <TableCell className="md:table-cell">2h 15m</TableCell>
                  <TableCell>
                    <div className="h-6 w-full bg-gray-200" />
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button className="w-8 h-8 rounded-full">
                        <PlayIcon className="h-6 w-6" />
                      </Button>
                      <Button className="w-8 h-8 rounded-full">
                        <MonitorStopIcon className="h-6 w-6" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Feb 4, 2024</TableCell>
                  <TableCell>Design review</TableCell>
                  <TableCell className="md:table-cell">1h 45m</TableCell>
                  <TableCell>
                    <div className="h-6 w-full bg-gray-200" />
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button className="w-8 h-8 rounded-full">
                        <PlayIcon className="h-6 w-6" />
                      </Button>
                      <Button className="w-8 h-8 rounded-full">
                        <MonitorStopIcon className="h-6 w-6" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
          <div className="md:hidden flex flex-col gap-4">
            <Card className="border shadow-sm rounded-lg mt-4">
              <CardHeader>
                <h2 className="font-semibold text-lg md:text-2xl">
                  Feb 6, 2024 - Meeting with team
                </h2>
              </CardHeader>
              <CardContent>
                <div className="h-6 w-full bg-gray-200 mb-4" />
                <div className="flex gap-2">
                  <Button className="w-8 h-8 rounded-full">
                    <PlayIcon className="h-6 w-6" />
                  </Button>
                  <Button className="w-8 h-8 rounded-full">
                    <MonitorStopIcon className="h-6 w-6" />
                  </Button>
                </div>
              </CardContent>
            </Card>
            <Card className="border shadow-sm rounded-lg mt-4">
              <CardHeader>
                <h2 className="font-semibold text-lg md:text-2xl">
                  Feb 5, 2024 - Project planning
                </h2>
              </CardHeader>
              <CardContent>
                <div className="h-6 w-full bg-gray-200 mb-4" />
                <div className="flex gap-2">
                  <Button className="w-8 h-8 rounded-full">
                    <PlayIcon className="h-6 w-6" />
                  </Button>
                  <Button className="w-8 h-8 rounded-full">
                    <MonitorStopIcon className="h-6 w-6" />
                  </Button>
                </div>
              </CardContent>
            </Card>
            <Card className="border shadow-sm rounded-lg mt-4">
              <CardHeader>
                <h2 className="font-semibold text-lg md:text-2xl">
                  Feb 4, 2024 - Design review
                </h2>
              </CardHeader>
              <CardContent>
                <div className="h-6 w-full bg-gray-200 mb-4" />
                <div className="flex gap-2">
                  <Button className="w-8 h-8 rounded-full">
                    <PlayIcon className="h-6 w-6" />
                  </Button>
                  <Button className="w-8 h-8 rounded-full">
                    <MonitorStopIcon className="h-6 w-6" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}

function MonitorStopIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="9" y="7" width="6" height="6" />
      <rect width="20" height="14" x="2" y="3" rx="2" />
      <path d="M12 17v4" />
      <path d="M8 21h8" />
    </svg>
  );
}

function Package2Icon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
      <path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9" />
      <path d="M12 3v6" />
    </svg>
  );
}

function PauseIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="4" height="16" x="6" y="4" />
      <rect width="4" height="16" x="14" y="4" />
    </svg>
  );
}

function PlayIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  );
}

function SearchIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}
