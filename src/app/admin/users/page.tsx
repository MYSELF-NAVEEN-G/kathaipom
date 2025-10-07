'use client';

import { AppLayout } from "@/components/layout/app-layout";
import { getUsers } from "@/lib/data";
import { UserList } from "@/components/admin/user-list";
import { useAuth } from "@/hooks/use-auth";
import { redirect } from "next/navigation";
import React from "react";
import type { User } from "@/lib/types";

export default function UserManagementPage() {
    const { user: currentUser } = useAuth();
    const [users, setUsers] = React.useState<User[]>([]);

    React.useEffect(() => {
        // Protect this page to only be accessible by admins
        if (currentUser && !currentUser.isAdmin) {
            redirect('/feed');
        }

        async function fetchUsers() {
            const userList = await getUsers();
            setUsers(userList);
        }
        
        if (currentUser?.isAdmin) {
            fetchUsers();
        }

    }, [currentUser]);
    
    if (!currentUser) {
        return (
             <main>
                <AppLayout>
                    <div className="p-4 md:p-6">
                        <h2 className="text-3xl font-headline font-bold mb-6">
                            User Management
                        </h2>
                        <p>Loading...</p>
                    </div>
                </AppLayout>
            </main>
        )
    }


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
