import SeparatorWithText from "@/components/SeparatorWithText";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          Contact us at
          <Link
            href="mailto:memoraapp.com@gmail.com"
            className="ml-2 text-blue-600"
          >
            memoraapp.com@gmail.com
          </Link>
        </p>
      </div>

      <div className="flex flex-col space-y-10">
        <Button variant="outline">
          <Link href="/login">Create account</Link>
        </Button>
        <SeparatorWithText text="OR" />
        <Button variant="default">
          <Link href="/join">Join a gallery</Link>
        </Button>
      </div>
      <h2>More coming soon...</h2>
    </main>
  );
}
