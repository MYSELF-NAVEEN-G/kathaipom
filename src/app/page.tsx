import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Logo } from "@/components/logo";
import { ArrowRight } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
            <div className="mr-4 hidden md:flex">
                <Logo size="medium" />
            </div>
        </div>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="text-center mb-12">
            <div className="md:hidden mb-8">
                <Logo size="large" />
            </div>
            <h1 className="text-5xl font-headline font-bold tracking-tight mb-4">Welcome to Kathaipom</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Share your stories. Connect with readers and writers. Discover content tailored just for you.
            </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
            <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
                <CardTitle className="text-2xl font-headline">I am a Writer</CardTitle>
                <CardDescription>Manage your stories and audience.</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="mb-6">Access the writer dashboard to publish new stories, manage your content, and view analytics.</p>
                <Button asChild className="w-full">
                <Link href="/admin/login">
                    Proceed to Writer Login <ArrowRight className="ml-2" />
                </Link>
                </Button>
            </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
                <CardTitle className="text-2xl font-headline">I am a Reader</CardTitle>
                <CardDescription>Explore the story feed.</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="mb-6">Sign in to view your personalized feed, like, comment on, and share stories from creators you love.</p>
                <Button asChild className="w-full">
                <Link href="/login">
                    Proceed to Reader Login <ArrowRight className="ml-2" />
                </Link>
                </Button>
            </CardContent>
            </Card>
        </div>
      </main>
      <footer className="py-8 text-center text-muted-foreground text-sm">
        © {new Date().getFullYear()} Kathaipom. All rights reserved.
      </footer>
    </div>
  );
}
