import { AppLayout } from "@/components/layout/app-layout";
import { CreatePostForm } from "@/components/admin/create-post-form";

export default function AdminDashboardPage() {
  return (
    <main>
      <AppLayout>
        <div className="p-4 md:p-6">
            <h2 className="text-3xl font-headline font-bold mb-6">Admin Dashboard</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <h3 className="text-xl font-headline font-semibold mb-4">Create a New Post</h3>
                    <CreatePostForm />
                </div>
                <div>
                    {/* Future admin stats can go here */}
                </div>
            </div>
        </div>
      </AppLayout>
    </main>
  );
}
