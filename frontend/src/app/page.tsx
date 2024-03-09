"use client";
import Link from "next/link";
import { ChevronRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  function handleLogin() {
    router.push("/login");
  }
  return (
    <>
      <section className="mx-auto container px-20 py-10">
        <h2 className="pt-6 text-5xl font-bold">Practice Your Pronunciation</h2>
        <h3 className="mr-auto pr-80 pb-4 text-xl font-medium text-foreground/80 py-4">
          Improve your speaking skills with fun and engaging exercises designed
          to help you sound more confident and natural.
        </h3>
      </section>
      <section className="px-20 mx-auto pb-4 container">
        <div className="flex flex-col justify-center space-y-8">
          <div className="flex flex-col gap-1.5">
            <Link
              className="inline-flex items-center space-x-2 text-sm font-medium transition-colors hover:underline"
              href="#"
            >
              <span>🎙️ Sound Recordings</span>
              <ChevronRightIcon className="h-4 w-4 peer-group-hover:translate-x-1 transition-transform" />
            </Link>
            <p className="text-sm text-gray-500 peer-group-hover:underline">
              Practice speaking and compare your pronunciation to native
              speakers.
            </p>
          </div>
          <div className="flex flex-col gap-1.5">
            <Link
              className="inline-flex items-center space-x-2 text-sm font-medium transition-colors hover:underline"
              href="#"
            >
              <span>🗣️ Conversation Prompts</span>
              <ChevronRightIcon className="h-4 w-4 peer-group-hover:translate-x-1 transition-transform" />
            </Link>
            <p className="text-sm text-gray-500 peer-group-hover:underline">
              Start a discussion with these thought-provoking topics and
              practice speaking fluently.
            </p>
          </div>
          <div className="flex flex-col gap-1.5">
            <Link
              className="inline-flex items-center space-x-2 text-sm font-medium transition-colors hover:underline"
              href="#"
            >
              <span>🔠 Phonetic Drills</span>
              <ChevronRightIcon className="h-4 w-4 peer-group-hover:translate-x-1 transition-transform" />
            </Link>
            <p className="text-sm text-gray-500 peer-group-hover:underline">
              Master the sounds of a language with these exercises that focus on
              pronunciation.
            </p>
          </div>
        </div>

        <div className="pt-8">
          <Button size="lg" className="font-bold" onClick={handleLogin}>
            Start Terrific
          </Button>
        </div>
      </section>
    </>
  );
}
