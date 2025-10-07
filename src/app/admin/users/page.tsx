import { AppLayout } from "@/components/layout/app-layout";
import { getUsers } from "@/lib/data";
import { UserList } from "@/components/admin/user-list";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function UserManagementPage() {
    const { user: currentUser } = await auth();

    // Protect this page to only be accessible by admins
    if (!currentUser || !currentUser.isAdmin) {
        redirect('/feed');
    }
    
    const users = await getUsers();


  return (
    <main>
      <AppLayout>
        <div className="p-4 md:p-6">
          <h2 className="text-3xl font-headline font-bold mb-6">
            User Management
          </h2>
          <UserList users={users} />
        </div>
      </AppLayout>
    </main>
  );
}
