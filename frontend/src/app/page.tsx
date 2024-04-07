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
      <section className="container mx-auto pb-8 pt-10 md:pb-12">
        <h2 className="text-center text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
          Practice Your Pronunciation
        </h2>
        <p className="mx-auto mt-4 max-w-3xl text-center text-lg italic text-secondary-foreground/80 md:mt-6">
          Improve your speaking skills with fun and engaging exercises designed
          to help you sound more confident and natural.
        </p>

        <div className="pt-8 text-center">
          <Button
            size="lg"
            className="w-full font-bold md:w-fit"
            variant={"default"}
            onClick={handleLogin}
          >
            Become Terrific
          </Button>
        </div>
      </section>

      <section className="container mx-auto pb-4">
        <div className="flex flex-col justify-center gap-0 md:flex-row md:gap-8">
          <div className="flex w-fit flex-col gap-1.5 px-2 pb-6 md:rounded md:bg-card md:px-8 md:py-6">
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
          <div className="flex w-fit flex-col gap-1.5 px-2 pb-6 md:rounded md:bg-card md:px-8 md:py-6">
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
          <div className="flex w-fit flex-col gap-1.5 px-2 pb-6 md:rounded md:bg-card md:px-8 md:py-6">
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
      </section>
    </>
  );
}
