import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Logo } from "@/components/logo";
import { ArrowRight } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
        <div className="absolute top-8 left-8">
            <Logo size="medium" />
        </div>
      <div className="text-center mb-12">
        <h1 className="text-5xl font-headline font-bold tracking-tight mb-4">Welcome to Kathaipom</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A premium social experience. Connect, share, and discover content tailored just for you.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="text-2xl font-headline">I am an Admin</CardTitle>
            <CardDescription>Manage content and users.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-6">Access the admin dashboard to create new posts, moderate content, and view analytics.</p>
            <Button asChild className="w-full">
              <Link href="/admin/login">
                Proceed to Admin Login <ArrowRight className="ml-2" />
              </Link>
            </Button>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="text-2xl font-headline">I am a User</CardTitle>
            <CardDescription>Explore the social feed.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-6">Sign in to view your personalized feed, like, comment on, and share posts from creators you love.</p>
            <Button asChild className="w-full">
              <Link href="/login">
                Proceed to User Login <ArrowRight className="ml-2" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
      <footer className="absolute bottom-8 text-muted-foreground text-sm">
        © {new Date().getFullYear()} Kathaipom. All rights reserved.
      </footer>
    </div>
  );
}
