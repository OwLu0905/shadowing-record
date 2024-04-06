"use client";
import Link from "next/link";
import { ChevronRightIcon, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  function handleLogin() {
    router.push("/login");
  }
  return (
    <>
      <section className="container mx-auto px-20 py-10">
        <h2 className="pt-6 text-5xl font-bold">Practice Your Pronunciation</h2>
        <h3 className="mr-auto py-4 pb-4 pr-80 text-xl font-medium text-foreground/80">
          Improve your speaking skills with fun and engaging exercises designed
          to help you sound more confident and natural.
        </h3>
      </section>
      <section className="container mx-auto px-20 pb-4">
        <div className="flex flex-col justify-center space-y-8">
          <div className="flex flex-col gap-1.5">
            <Link
              className="inline-flex items-center space-x-2 text-sm font-medium transition-colors hover:underline"
              href="#"
            >
              <span>🎙️ Sound Recordings</span>
              <ChevronRightIcon className="peer-group-hover:translate-x-1 h-4 w-4 transition-transform" />
            </Link>
            <p className="peer-group-hover:underline text-sm text-gray-500">
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
              <ChevronRightIcon className="peer-group-hover:translate-x-1 h-4 w-4 transition-transform" />
            </Link>
            <p className="peer-group-hover:underline text-sm text-gray-500">
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
              <ChevronRightIcon className="peer-group-hover:translate-x-1 h-4 w-4 transition-transform" />
            </Link>
            <p className="peer-group-hover:underline text-sm text-gray-500">
              Master the sounds of a language with these exercises that focus on
              pronunciation.
            </p>
          </div>
        </div>

        <div className="pt-8">
          <Button
            size="lg"
            className="font-bold"
            variant={"destructive"}
            onClick={handleLogin}
          >
            Become Terrific <Flame className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>
    </>
  );
}
