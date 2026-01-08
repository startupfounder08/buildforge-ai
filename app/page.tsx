import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground">
      <main className="flex flex-col items-center gap-8 p-8 text-center sm:p-20">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl text-primary">
          BuildForge AI
        </h1>
        <p className="text-lg text-muted-foreground max-w-xl">
          The professional AI SaaS for construction firms. Automate permits, contracts, and proposals with ease.
        </p>

        <div className="flex gap-4">
          <Button asChild size="lg">
            <Link href="/auth/signup">Get Started</Link>
          </Button>
          <Button variant="outline" asChild size="lg">
            <Link href="/auth/login">Login</Link>
          </Button>
        </div>
      </main>
      <footer className="p-8 text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} BuildForge AI. All rights reserved.
      </footer>
    </div>
  );
}
